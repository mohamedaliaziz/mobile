import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Wallet() {
  const [phone, setPhone] = useState("");
  const [points, setPoints] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem("@user_phone")) || "";
      if (saved) setPhone(saved);
    })();
  }, []);

  function fetchPoints() {
    // ربط لاحقاً بـ /api/wallet (يتطلب توكن موظف)، الآن عرض تجريبي
    setPoints(0);
    Alert.alert("محفظة", "سيتم ربط النقاط بالحساب قريباً.");
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="wallet-outline" size={20} color="#0ea5e9" />
          <Text style={styles.h2}>محفظتك</Text>
        </View>
        <Text style={styles.muted}>اكتب رقمك لعرض رصيد النقاط الخاص بك.</Text>
        <TextInput value={phone} onChangeText={setPhone} placeholder="05xxxxxxxx" style={styles.input} />
        <TouchableOpacity onPress={fetchPoints} style={styles.btn}>
          <Text style={styles.btnTxt}>عرض الرصيد</Text>
        </TouchableOpacity>
        {points !== null && (
          <Text style={{ marginTop: 8 }}>
            نقاطك الحالية: <Text style={{ fontWeight: "900" }}>{points}</Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 14, elevation: 2 },
  h2: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  muted: { fontSize: 12, color: "#64748b" },
  input: {
    backgroundColor: "#fff", borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "#e5e7eb", marginTop: 8,
  },
  btn: { backgroundColor: "#0ea5e9", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 8 },
  btnTxt: { color: "#fff", fontWeight: "800" },
});
