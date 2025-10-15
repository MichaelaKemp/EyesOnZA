import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const data: Report[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[];
        setReports(data);
        console.log("Loaded reports:", data.length);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: -25.746,
          longitude: 28.188,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {reports.map((report) =>
          report.latitude && report.longitude ? (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
              title={report.title}
              description={report.description}
              pinColor="#d32f2f"
            />
          ) : null
        )}
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Showing {reports.length} reported incidents
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  overlayText: { color: "#fff", textAlign: "center" },
});

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { useRouter } from "expo-router";

// interface Report {
//   id: string;
//   title: string;
//   description: string;
//   latitude: number;
//   longitude: number;
//   createdAt?: any;
// }

// export default function MapScreen() {
//   const [reports, setReports] = useState<Report[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "reports"));
//         const data: Report[] = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Report[];
//         setReports(data);
//         console.log("Loaded reports:", data.length);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       }
//     };

//     fetchReports();
//   }, []);

//   const handleViewReport = (id: string) => {
//     router.push({
//       pathname: "/app/report/[id]",
//       params: { id },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={StyleSheet.absoluteFillObject}
//         initialRegion={{
//           latitude: -25.746,
//           longitude: 28.188,
//           latitudeDelta: 0.2,
//           longitudeDelta: 0.2,
//         }}
//       >
//         {reports.map((report) =>
//           report.latitude && report.longitude ? (
//             <Marker
//               key={report.id}
//               coordinate={{
//                 latitude: report.latitude,
//                 longitude: report.longitude,
//               }}
//               pinColor="#d32f2f"
//             >
//  <Callout>
//   <View style={{ padding: 6 }}>
//     <Text style={{ fontWeight: "bold", fontSize: 16 }}>{report.title}</Text>
//     <Text style={{ fontSize: 12, color: "#555" }}>Tap disabled</Text>
//   </View>
// </Callout>
//             </Marker>
//           ) : null
//         )}
//       </MapView>

//       <View style={styles.overlay}>
//         <Text style={styles.overlayText}>
//           Showing {reports.length} reported incidents
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   overlay: { position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
//   overlayText: { color: "#fff", textAlign: "center" },
// });