import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as DocPicker from "expo-document-picker";
import axios from "axios";

export default function Uploader({ baseUrl, onUploaded }:{ baseUrl:string; onUploaded:(files:any[])=>void }){
  const [list,setList]=useState<any[]>([]);
  async function choose(){
    const res = await DocPicker.getDocumentAsync({ copyToCacheDirectory:true, multiple:true });
    if(res.type!=="success") return;
    const assets = Array.isArray(res.assets)? res.assets : [res];
    setList(prev=>[...prev, ...assets]);
  }
  async function upload(){
    const fd = new FormData();
    list.forEach((f:any)=>{
      fd.append("files", { uri:f.uri, name:f.name||"file", type:f.mimeType||"application/octet-stream" } as any);
    });
    const r = await axios.post(baseUrl + "/api/uploads/public", fd, { headers: { "Content-Type":"multipart/form-data" } });
    onUploaded(r.data.files||[]);
  }
  return <View style={{backgroundColor:"#fff",borderRadius:12,padding:12,marginVertical:8}}>
    <Text style={{fontWeight:"800",marginBottom:6}}>رفع المستندات</Text>
    <View style={{gap:6}}>
      {list.map((f:any,i:number)=>(<Text key={i} style={{fontSize:12,opacity:0.7}}>{f.name}</Text>))}
    </View>
    <View style={{flexDirection:"row",gap:10,marginTop:8}}>
      <TouchableOpacity onPress={choose} style={{backgroundColor:"#e5e7eb",padding:10,borderRadius:8}}><Text>اختيار ملفات</Text></TouchableOpacity>
      <TouchableOpacity onPress={upload} style={{backgroundColor:"#0ea5e9",padding:10,borderRadius:8}}><Text style={{color:"#fff",fontWeight:"800"}}>رفع</Text></TouchableOpacity>
    </View>
  </View>;
}