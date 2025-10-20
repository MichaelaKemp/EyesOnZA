import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const success = await login(email, password);

    if (success) {
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.linkText}>
          Don’t have an account?{" "}
          <Text style={styles.linkHighlight}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#d32f2f", marginBottom: 30 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginVertical: 8, },
  button: { backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, width: "100%", marginTop: 20, },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  linkText: { marginTop: 15, color: "#555" },
  linkHighlight: { color: "#d32f2f", fontWeight: "600" },
});