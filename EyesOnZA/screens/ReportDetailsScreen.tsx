import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ReportDetailsScreen() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const docRef = doc(db, "reports", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReport(docSnap.data());
      }
      setLoading(false);
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text>Report not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.date}>
        {report.createdAt?.toDate
          ? new Date(report.createdAt.toDate()).toLocaleString()
          : "Unknown date"}
      </Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.location}>📍 {report.location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#d32f2f", marginBottom: 10 },
  date: { fontSize: 14, color: "#666", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  location: { fontSize: 16, fontStyle: "italic", color: "#333" },
});