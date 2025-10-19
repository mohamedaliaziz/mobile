// screens/TransferBusiness.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import api from "../api/client";

let LottieView: any = null;
try { LottieView = require("lottie-react-native").default; } catch {}

const LABELS_WITH_TAM = ["اختيار الأطراف + المستندات","مراجعة الموظف","الدفع/التحويل","أكواد تم","تم النقل"];
const LABELS_NO_TAM   = ["اختيار الأطراف + المستندات","مراجعة الموظف","الدفع/التحويل","تم النقل"];

/** تحويل حالة السيرفر إلى رقم خطوة بالواجهة */
function statusToStep(status: string, needsTam: boolean) {
  const s = String(status || "").trim();

  if (!needsTam) {
    // بدون TAM (مؤسسات فقط): 1 مستندات → 2 مراجعة → 3 دفع → 4 تم
    const mapNoTam: Record<string, number> = {
      under_review: 2,
      waiting_user_action: 2,
      rejected: 2,

      awaiting_payment: 3,
      payment_submitted: 3,
      payment_verified: 3,
      processing: 3, // لو موجودة عندك

      completed: 4,
    };
    return mapNoTam[s] ?? 1;
  }

  // مع TAM (لو فيه فرد): 1 مستندات → 2 مراجعة → 3 دفع → 4 أكواد تم → 5 تم
  const mapWithTam: Record<string, number> = {
    under_review: 2,
    waiting_user_action: 2,
    rejected: 2,

    awaiting_payment: 3,
    payment_submitted: 3,
    payment_verified: 4,   // بعد تأكيد الدفع نطلب الأكواد
    awaiting_codes: 4,
    codes_submitted: 4,
    codes_verified: 5,     // جاهز للإكمال

    completed: 5,
  };
  return mapWithTam[s] ?? 1;
}

export default function TransferSmart({ onBack, onGoStatus }: {onBack:()=>void; onGoStatus:()=>void; }){
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // نوع كل طرف
  const [sellerType, setSellerType] = useState<"person"|"company">("person");
  const [buyerType,  setBuyerType]  = useState<"person"|"company">("company");

  // مرفقات البائع
  const [sellerId, setSellerId] = useState<any>(null);
  const [sellerCR, setSellerCR] = useState<any>(null);
  const [sellerLetter, setSellerLetter] = useState<any>(null);

  // مرفقات المشتري
  const [buyerId, setBuyerId] = useState<any>(null);
  const [buyerCR, setBuyerCR] = useState<any>(null);
  const [buyerLetter, setBuyerLetter] = useState<any>(null);

  // مشترك
  const [istimara, setIstimara] = useState<any>(null);

  // بيانات المعاملة
  const [clientRef, setClientRef] = useState<string|null>(null);
  const [transferId, setTransferId] = useState<string|null>(null);
  const [amount, setAmount] = useState<number>(420);

  // الحاجة لـ TAM (لو أي طرف فرد)
  const [needsTam, setNeedsTam] = useState<boolean>(true);
  const [needBuyerCode, setNeedBuyerCode] = useState(false);
  const [needSellerCode, setNeedSellerCode] = useState(false);

  // أكواد تم
  const [tamBuyer, setTamBuyer] = useState("");
  const [tamSeller, setTamSeller] = useState("");

  const pollRef = useRef<any>(null);
  useEffect(()=>()=>{ if(pollRef.current) clearInterval(pollRef.current); },[]);

  function recomputeNeedsTam(localSellerType: "person"|"company", localBuyerType: "person"|"company"){
    // لو فيه طرف فرد ⇒ نحتاج TAM
    const require = localSellerType === "person" || localBuyerType === "person";
    setNeedsTam(require);
    // كل طرف فرد فقط هو اللي يحتاج كود
    setNeedSellerCode(localSellerType === "person");
    setNeedBuyerCode(localBuyerType  === "person");
  }

  useEffect(()=>{
    recomputeNeedsTam(sellerType, buyerType);
  }, [sellerType, buyerType]);

  function labels(){ return needsTam ? LABELS_WITH_TAM : LABELS_NO_TAM; }

  function requiredForParty(partyType: "person"|"company"){
    return partyType === "person" ? ["هوية"] : ["سجل تجاري","خطاب الغرفة"];
  }
// اختَر أفضل مُعرّف للمسارات المحمية (الأقوى: transferId)
function getTransferKey(transferId?: string|null, clientRef?: string|null){
  return transferId || clientRef || "";
}

// لعرض رسالة الخطأ بدل "تعذّر..." العامة
function showApiError(e:any, fallback:string){
  const msg = e?.response?.data?.message || e?.message || "";
  Toast.show({ type:"error", text1: fallback, text2: msg || undefined });
}

  function validateAndListMissing(){
    const missing:string[] = [];
    if(sellerType === "person"){
      if(!sellerId) missing.push("هوية البائع (فرد)");
    }else{
      if(!sellerCR) missing.push("سجل البائع (مؤسسة)");
      if(!sellerLetter) missing.push("خطاب غرفة البائع");
    }
    if(buyerType === "person"){
      if(!buyerId) missing.push("هوية المشتري (فرد)");
    }else{
      if(!buyerCR) missing.push("سجل المشتري (مؤسسة)");
      if(!buyerLetter) missing.push("خطاب غرفة المشتري");
    }
    if(!istimara) missing.push("استمارة السيارة");
    return missing;
  }

  async function pick(setter:(v:any)=>void){
    try{
      const res = await DocumentPicker.getDocumentAsync({ multiple:false });
      if(res.assets?.length){
        const a = res.assets[0];
        setter({ uri:a.uri, name:a.name, mime:a.mimeType || "application/octet-stream" });
      }
    }catch{
      Toast.show({type:"error",text1:"تعذّر اختيار الملف"});
    }
  }
async function uploadOne(file:{uri:string; name:string; mime:string}, niceName:string){
  const fd = new FormData();
  fd.append("files", { uri:file.uri, name:file.name || "file", type:file.mime || "application/octet-stream" } as any);
  const r = await api.post("/api/uploads/public", fd, { headers:{ "Content-Type":"multipart/form-data" } });
  const it = (r.data?.files?.[0]) || null;
  if(!it) throw new Error("upload failed");
  return { url: it.url, key: it.key, mime: it.mime, size: it.size, filename: niceName };
}

  /** متابعة الحالة من السيرفر — مبنية على /:id/status */
 function startPolling(ref:string){
  if(pollRef.current) clearInterval(pollRef.current);
  pollRef.current = setInterval(async ()=>{
    try{
      const { data } = await api.get("/api/transfers/lookup/by-ref", {
        params: { ref, _t: Date.now() }, // منع الكاش
        headers: { "Cache-Control":"no-cache", "Pragma":"no-cache" },
      });

      // تحديد الحاجة لـ TAM حسب نوع الطرفين (جاية من السيرفر عادة عبر buyer/seller)
      const sellerIsIndividual = String(data?.seller?.type || data?.sellerType) === 'individual' || String(data?.sellerType) === 'person';
      const buyerIsIndividual  = String(data?.buyer?.type  || data?.buyerType)  === 'individual' || String(data?.buyerType)  === 'person';
      const localNeedsTam = sellerIsIndividual || buyerIsIndividual;

      setNeedsTam(localNeedsTam);
      setNeedSellerCode(sellerIsIndividual);
      setNeedBuyerCode(buyerIsIndividual);

      if (typeof data?.amount === "number") setAmount(data.amount);

      const next = stepFromStatus(String(data?.status||""), localNeedsTam);
      setStep(prev => (next ? Math.max(prev, next) : prev)); // لا ترجع للخلف

      await AsyncStorage.setItem("@last_transfer_ref", ref);
    }catch{/* ignore */}
  }, 4500);
}


  async function submitStep1(){
    const missing = validateAndListMissing();
    if(missing.length){
      Toast.show({ type:"error", text1:"أكمل المستندات", text2: "ناقص: " + missing.join("، ") });
      return;
    }

    const type = (sellerType === "company" || buyerType === "company") ? "business" : "individual";
    const prefix = (type === "business") ? "B" : "T";
    const refLocal = prefix + new Date().toISOString().slice(2,10).replace(/-/g,"") + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
    setClientRef(refLocal);
    await AsyncStorage.setItem("@last_transfer_ref", refLocal);

    setLoading(true);
    try{
      // نرسل بنفس طريقتك (FormData) لأنها شغالة عندك
      const fd = new FormData();
      fd.append("type", type);
      fd.append("clientRef", refLocal);
      fd.append("sellerType", sellerType);
      fd.append("buyerType",  buyerType);

      if(sellerType === "person"){
        fd.append("sellerId", { uri:sellerId.uri, name:sellerId.name, type:sellerId.mime } as any);
      }else{
        fd.append("sellerCR",     { uri:sellerCR.uri,     name:sellerCR.name,     type:sellerCR.mime } as any);
        fd.append("sellerLetter", { uri:sellerLetter.uri, name:sellerLetter.name, type:sellerLetter.mime } as any);
      }

      if(buyerType === "person"){
        fd.append("buyerId", { uri:buyerId.uri, name:buyerId.name, type:buyerId.mime } as any);
      }else{
        fd.append("buyerCR",     { uri:buyerCR.uri,     name:buyerCR.name,     type:buyerCR.mime } as any);
        fd.append("buyerLetter", { uri:buyerLetter.uri, name:buyerLetter.name, type:buyerLetter.mime } as any);
      }

      fd.append("istimara", { uri:istimara.uri, name:istimara.name, type:istimara.mime } as any);

      const { data } = await api.post("/api/transfers", fd, { headers:{ "Content-Type":"multipart/form-data" } });
      if(data?.id) setTransferId(data.id);
      if(typeof data?.amount === "number") setAmount(data.amount);

      // ثبّت قواعد TAM حسب الاختيار المحلي
      recomputeNeedsTam(sellerType, buyerType);

      // فور الإرسال نبدأ المتابعة على clientRef (من الرد أو refLocal)
      startPolling(data?.clientRef || refLocal);
      setStep(prev => Math.max(prev, 2));
      Toast.show({ type:"success", text1:"تم الإرسال", text2:"قيد المراجعة الآن" });
    }catch(e:any){
      Toast.show({ type:"error", text1:"تعذّر إرسال الطلب", text2: e?.response?.data?.message || "حاول مجددًا" });
    }finally{
      setLoading(false);
    }
  }

 async function uploadReceipt(){
  const key = getTransferKey(transferId, clientRef);
  if(!key){
    Toast.show({type:"error", text1:"المرجع غير معروف", text2:"رجاءً أرسل الطلب أولًا"});
    return;
  }
  try{
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85
    });
    if(res.canceled) return;
    const a = res.assets[0];

    const proof = await uploadOne(
      { uri:a.uri, name:(a as any).fileName || "receipt.jpg", mime:(a as any).mimeType || "image/jpeg" },
      "receipt-إيصال-التحويل"
    );

    await api.post(`/api/transfers/${encodeURIComponent(key)}/payment/proof`, {
      amount,
      reference: clientRef || key, // مرجع الدفع الأفضل يكون clientRef
      proof
    });

    Toast.show({type:"success", text1:"تم رفع الإيصال", text2:"بانتظار تأكيد الموظف"});
  }catch(e:any){
    showApiError(e, "تعذّر رفع الإيصال");
  }
}



 async function submitTamCodes(){
  if(needBuyerCode && !tamBuyer){ Toast.show({type:"error",text1:"أدخل كود المشتري"}); return; }
  if(needSellerCode && !tamSeller){ Toast.show({type:"error",text1:"أدخل كود البائع"}); return; }

  const key = getTransferKey(transferId, clientRef);
  if(!key){ Toast.show({type:"error",text1:"المرجع غير معروف"}); return; }

  setLoading(true);
  try{
    const payload:any = {};
    if(needBuyerCode)  payload.buyerCode  = tamBuyer;
    if(needSellerCode) payload.sellerCode = tamSeller;

    await api.post(`/api/transfers/${encodeURIComponent(key)}/codes`, payload);
    Toast.show({type:"success",text1:"تم حفظ الأكواد", text2:"بانتظار التحقق"});
    setTamBuyer(""); setTamSeller("");
  }catch(e:any){
    showApiError(e, "تعذّر حفظ الأكواد");
  }finally{
    setLoading(false);
  }
}



  return (
    <LinearGradient colors={["#eef6ff","#e6f3ff","#eef7ff"]} style={{flex:1}}>
      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:140 }}>
        {/* Header */}
        <View style={styles.top}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color="#0ea5e9" />
          </TouchableOpacity>
          <Text style={styles.title}>نقل ملكية — ذكي (أفراد/مؤسسات)</Text>
          <View style={{width:36}} />
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {labels().map((nm,i)=>(
            <View key={i} style={styles.tlItem}>
              <View style={[styles.tlDot, i+1<=step?styles.tlDotActive:null]} />
              <Text numberOfLines={1} style={[styles.tlLabel, i+1<=step?{color:"#0ea5e9",fontWeight:"900"}:null]}>{nm}</Text>
              {i<labels().length-1 && <View style={[styles.tlBar, i+1<step?{backgroundColor:"#0ea5e9"}:null]} />}
            </View>
          ))}
        </View>

        {/* Step 1 */}
        {step===1 && (
          <View style={styles.card}>
            <Text style={styles.h2}>حدِّد نوع كل طرف</Text>

            <PartyPicker
              label="البائع"
              value={sellerType}
              onChange={(v)=>{ setSellerType(v as any); recomputeNeedsTam(v as any, buyerType); }}
              hint={`المطلوب: ${requiredForParty(sellerType).join(" + ")}`}
            />

            <PartyPicker
              label="المشتري"
              value={buyerType}
              onChange={(v)=>{ setBuyerType(v as any); recomputeNeedsTam(sellerType, v as any); }}
              hint={`المطلوب: ${requiredForParty(buyerType).join(" + ")}`}
            />

            <View style={styles.sep} />
            <Text style={styles.h2}>المستندات</Text>

            {sellerType === "person" ? (
              <Upload label="هوية البائع (فرد)" file={sellerId} onPick={()=>pick(setSellerId)} required />
            ) : (
              <>
                <Upload label="سجل البائع (مؤسسة)" file={sellerCR} onPick={()=>pick(setSellerCR)} required />
                <Upload label="خطاب الغرفة (البائع)" file={sellerLetter} onPick={()=>pick(setSellerLetter)} required />
              </>
            )}

            {buyerType === "person" ? (
              <Upload label="هوية المشتري (فرد)" file={buyerId} onPick={()=>pick(setBuyerId)} required />
            ) : (
              <>
                <Upload label="سجل المشتري (مؤسسة)" file={buyerCR} onPick={()=>pick(setBuyerCR)} required />
                <Upload label="خطاب الغرفة (المشتري)" file={buyerLetter} onPick={()=>pick(setBuyerLetter)} required />
              </>
            )}

            <Upload label="استمارة السيارة" file={istimara} onPick={()=>pick(setIstimara)} required />

            <TouchableOpacity onPress={submitStep1} style={styles.btn}>
              <Text style={styles.btnTxt}>إرسال الطلب للمراجعة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2 */}
        {step===2 && (
          <View style={styles.card}>
            <Text style={styles.h2}>جاري المراجعة من الموظف</Text>
            <Text style={styles.muted}>مرجعك: <Text style={{fontWeight:"900"}}>{clientRef || "—"}</Text></Text>
            <Text style={[styles.muted,{marginTop:6}]}>
              سيتم نقلك تلقائيًا لخطوة {needsTam ? "الدفع ثم أكواد تم" : "الدفع"} عند تحديث الحالة من لوحة الموظفين.
            </Text>
          </View>
        )}

        {/* Step 3 */}
        {step===3 && (
          <View style={styles.card}>
            <Text style={styles.h2}>الدفع/التحويل</Text>
            <Text style={styles.muted}>المبلغ المستحق: <Text style={{fontWeight:"900"}}>{amount} ر.س</Text></Text>
            <TouchableOpacity onPress={uploadReceipt} style={[styles.btn,{marginTop:8}]}>
              <Text style={styles.btnTxt}>رفع إيصال التحويل</Text>
            </TouchableOpacity>
            <Text style={[styles.muted,{marginTop:6}]}>
              {needsTam
                ? "بعد تأكيد الدفع، ستنتقل لخطوة إدخال أكواد تم للطرف الفرد."
                : "بعد التأكيد من الموظف ستكتمل المعاملة تلقائيًا."}
            </Text>
          </View>
        )}

        {/* Step 4 — TAM */}
        {needsTam && step===4 && (
          <View style={styles.card}>
            <Text style={styles.h2}>أكواد منصة تم</Text>
            {needBuyerCode && (
              <LabeledInput label="كود المشتري (فرد)" value={tamBuyer} onChangeText={setTamBuyer} placeholder="xxxxxx" />
            )}
            {needSellerCode && (
              <LabeledInput label="كود البائع (فرد)" value={tamSeller} onChangeText={setTamSeller} placeholder="xxxxxx" />
            )}
            <TouchableOpacity onPress={submitTamCodes} style={[styles.btn,{backgroundColor:"#10b981"}]}>
              <Text style={styles.btnTxt}>إرسال الأكواد</Text>
            </TouchableOpacity>
            <Text style={[styles.muted,{marginTop:6}]}>سيتم التحقق من الأكواد من قِبل الموظف ثم متابعة التنفيذ.</Text>
          </View>
        )}

        {/* Done */}
        {(!needsTam && step===4) || (needsTam && step===5) ? (
          <View style={styles.card}>
            <View style={{alignItems:"center",gap:6}}>
              <Ionicons name="checkmark-circle-outline" size={42} color="#10b981" />
              <Text style={styles.h2}>تم نقل الملكية</Text>
              <Text style={styles.muted}>خلال ~30 دقيقة تقدر تستلم الاستمارة الجديدة.</Text>
            </View>
            <TouchableOpacity onPress={onGoStatus} style={[styles.btn,{marginTop:10}]}>
              <Text style={styles.btnTxt}>الانتقال لصفحة الاستعلام</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {loading && (
        <View style={styles.loading}>
          {LottieView ? <LottieView source={require("../../assets/lottie/loading.json")} autoPlay loop style={{width:120,height:120}}/> : <ActivityIndicator size="large" />}
          <Text style={{color:"#0f172a",marginTop:6}}>جارٍ المعالجة…</Text>
        </View>
      )}
    </LinearGradient>
  );
}

/* Helpers */
function PartyPicker({ label, value, onChange, hint }:{
  label:string; value:"person"|"company"; onChange:(v:"person"|"company")=>void; hint?:string;
}){
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ fontWeight:"900", color:"#0f172a", marginBottom:6 }}>{label}</Text>
      <View style={{ flexDirection:"row", gap:8 }}>
        <Seg value={value} current="person"  title="فرد"     onPress={()=>onChange("person")} />
        <Seg value={value} current="company" title="مؤسسة"  onPress={()=>onChange("company")} />
      </View>
      {!!hint && <Text style={{ color:"#64748b", fontSize:12, marginTop:4 }}>{hint}</Text>}
    </View>
  );
}
function Seg({ value, current, title, onPress }:{
  value:"person"|"company"; current:"person"|"company"; title:string; onPress:()=>void;
}){
  const active = value === current;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.seg, active && styles.segActive]}>
      <Text style={[styles.segTxt, active && styles.segTxtActive]}>{title}</Text>
    </TouchableOpacity>
  );
}
function Upload({ label, file, onPick, required=false }:{
  label:string; file:any; onPick:()=>void; required?:boolean;
}){
  return (
    <View style={{gap:6,marginTop:10}}>
      <View style={{ flexDirection:"row", alignItems:"center", gap:6 }}>
        <Text style={{fontWeight:"700",color:"#0f172a"}}>{label}</Text>
        {required ? <Badge text="مطلوب" /> : <Badge text="اختياري" muted />}
      </View>
      <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
        {!!file?.name && <Ionicons name="checkmark-done-circle-outline" size={20} color="#10b981" />}
        <TouchableOpacity onPress={onPick} style={styles.btnMini}>
          <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
          <Text style={styles.btnMiniTxt}>{file?.name?"تغيير الملف":"رفع الملف"}</Text>
        </TouchableOpacity>
      </View>
      {!!file?.name && <Text style={styles.muted}>{file.name}</Text>}
    </View>
  );
}
function Badge({ text, muted=false }:{text:string; muted?:boolean;}){
  return (
    <View style={[styles.badge, muted && { backgroundColor:"#f1f5f9", borderColor:"#e5e7eb" }]}>
      <Text style={[styles.badgeTxt, muted && { color:"#64748b" }]}>{text}</Text>
    </View>
  );
}
function LabeledInput({label, ...props}:{label:string; [k:string]:any;}){
  return (
    <View style={{marginTop:8}}>
      <Text style={{fontWeight:"700",color:"#0f172a",marginBottom:4}}>{label}</Text>
      <TextInput {...props} style={styles.input}/>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  backBtn:{width:36,height:36,borderRadius:18,borderWidth:1,borderColor:"#bae6fd",alignItems:"center",justifyContent:"center",backgroundColor:"#fff"},
  title:{fontSize:18,fontWeight:"900",color:"#0f172a"},

  timeline:{flexDirection:"row",alignItems:"center",gap:8,marginBottom:8},
  tlItem:{flex:1,alignItems:"center"},
  tlDot:{width:10,height:10,borderRadius:5,backgroundColor:"#e5e7eb"},
  tlDotActive:{backgroundColor:"#0ea5e9"},
  tlBar:{height:2,backgroundColor:"#e5e7eb",position:"absolute",left:"50%",right:"-50%",top:4},
  tlLabel:{fontSize:10,color:"#64748b",marginTop:4},

  card:{backgroundColor:"#fff",borderRadius:22,padding:16,elevation:2,shadowColor:"#000",shadowOpacity:0.06,shadowRadius:8,marginBottom:12},
  h2:{fontSize:16,fontWeight:"900",color:"#0f172a"},
  muted:{fontSize:12,color:"#64748b"},
  input:{backgroundColor:"#fff",borderRadius:12,padding:12,borderWidth:1,borderColor:"#e5e7eb"},

  seg:{flex:1,backgroundColor:"#f1f5f9",borderColor:"#e5e7eb",borderWidth:1,borderRadius:12,paddingVertical:10,alignItems:"center"},
  segActive:{backgroundColor:"#e0f2fe",borderColor:"#7dd3fc"},
  segTxt:{color:"#475569",fontWeight:"700"},
  segTxtActive:{color:"#0ea5e9",fontWeight:"900"},

  btn:{backgroundColor:"#0ea5e9",paddingVertical:13,borderRadius:14,alignItems:"center",marginTop:12},
  btnTxt:{color:"#fff",fontWeight:"800"},
  btnMini:{backgroundColor:"#0ea5e9",borderRadius:10,paddingVertical:8,paddingHorizontal:10,flexDirection:"row",alignItems:"center",gap:6,alignSelf:"flex-start"},
  btnMiniTxt:{color:"#fff",fontWeight:"800",fontSize:12},

  badge:{paddingHorizontal:8,paddingVertical:2,borderRadius:999,backgroundColor:"#e0f2fe",borderWidth:1,borderColor:"#7dd3fc"},
  badgeTxt:{fontSize:10,color:"#0369a1",fontWeight:"800"},

  loading:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"rgba(255,255,255,0.7)",justifyContent:"center",alignItems:"center"},
  sep:{height:1,backgroundColor:"#e5e7eb",marginVertical:12},
});
