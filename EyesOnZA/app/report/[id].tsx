import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ReportDetails() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const docRef = doc(db, "reports", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReport({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert("Not Found", "This report no longer exists.");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        Alert.alert("Error", "Failed to load report.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.date}>
          {report.createdAt?.toDate
            ? new Date(report.createdAt.toDate()).toLocaleString()
            : "Unknown date"}
        </Text>
        <Text style={styles.description}>{report.description}</Text>

        {report.userEmail && (
          <Text style={styles.email}>Reported by: {report.userEmail}</Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#d32f2f" },
  date: { fontSize: 12, color: "#666", marginBottom: 20 },
  description: { fontSize: 16, lineHeight: 22, color: "#333" },
  email: { marginTop: 10, fontSize: 14, color: "#666" },
  backButton: { marginTop: 30, padding: 12, backgroundColor: "#d32f2f", borderRadius: 8 },
  backButtonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});