import React, { useState } from "react";
import { View,  Text, TextInput, TouchableOpacity, Alert, StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    const success = await signup(email, password);

    if (success) {
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Email already exists in Firestore.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text style={styles.linkHighlight}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#d32f2f", marginBottom: 30 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginVertical: 8 },
  button: { backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, width: "100%", marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  linkText: { marginTop: 15, color: "#555" },
  linkHighlight: { color: "#d32f2f", fontWeight: "600" },
});