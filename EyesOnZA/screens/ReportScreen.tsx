import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";

export default function ReportScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const [useManualLocation, setUseManualLocation] = useState(false);
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
      Alert.alert("Location Set", "Your current location has been added!");
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Error", "Unable to get your location. Try again.");
    }
  };

  const handleSubmit = async () => {
  if (!title || !description || !latitude || !longitude) {
    Alert.alert("Error", "Please fill in all fields or set a location.");
    return;
  }

  if (!location) {
    setLocation("Current Location");
  }

    try {
      await addDoc(collection(db, "reports"), {
        title,
        description,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userEmail: user?.email || "anonymous",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Report Submitted", "Thank you for your report!");
      setTitle("");
      setDescription("");
      setLocation("");
      setLatitude("");
      setLongitude("");
      router.replace("/(tabs)/map");
    } catch (error) {
      console.error("Report error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Report an Incident</Text>

          <TextInput
            placeholder="Title (e.g. Suspicious Activity)"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description"
            style={[styles.input, { height: 100 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {!useManualLocation ? (
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={() => setUseManualLocation(true)}
            >
              <Text style={{ color: location ? "#000" : "#999" }}>
                {location || "🔍 Tap to search location manually"}
              </Text>
            </TouchableOpacity>
          ) : (
            <GooglePlacesAutocomplete
              placeholder="Type location..."
              minLength={2}
              fetchDetails={true}
              enablePoweredByContainer={false}
              debounce={300}

              onPress={(data, details = null) => {
                  console.log("GooglePlacesAutocomplete onPress:", { data, details });
                if (!data || !details) return;
                setLocation(data.description);
                setLatitude(details.geometry.location.lat.toString());
                setLongitude(details.geometry.location.lng.toString());
                setUseManualLocation(false);
              }}

              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: "en",
                components: "country:za",
              }}

              styles={{
                container: { flex: 0, width: "100%", marginVertical: 8, zIndex: 999 },
                listView: { backgroundColor: "white", borderRadius: 8, elevation: 3 },
                textInput: styles.input,
              }}
            />
          )}

          {latitude && longitude ? (
            <Text style={styles.coords}>
              📍 {latitude}, {longitude}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.secondaryButtonText}>
              📍 Use My Current Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Report</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 20, backgroundColor: "#fff", justifyContent: "center" },
  header: { fontSize: 24, fontWeight: "bold", color: "#d32f2f", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginVertical: 8 },
  coords: { textAlign: "center", color: "#555", marginVertical: 5 },
  button: { backgroundColor: "#d32f2f", padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  secondaryButton: { backgroundColor: "#eee", padding: 15, borderRadius: 8, marginTop: 10 },
  secondaryButtonText: { color: "#333", fontWeight: "600", textAlign: "center" },
});