import React, { createContext, useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log("🟨 Attempting login:", email);
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email.toLowerCase().trim()),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);
      console.log("📊 Query snapshot size:", snapshot.size);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        console.log("✅ Logged in user:", userData);
        setUser(userData);
        return true;
      } else {
        console.warn("❌ Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("🔥 Login Firestore error:", error);
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log("🟩 Attempting signup:", email);
      const usersRef = collection(db, "users");

      const normalizedEmail = email.toLowerCase().trim();
      const q = query(usersRef, where("email", "==", normalizedEmail));
      const snapshot = await getDocs(q);
      console.log("📊 Query snapshot size:", snapshot.size);

      if (!snapshot.empty) {
        console.warn("⚠️ Email already exists in Firestore");
        return false;
      }

      console.log("🧾 Adding new user...");
      await addDoc(usersRef, {
        email: normalizedEmail,
        password,
        createdAt: serverTimestamp(),
      });

      console.log("✅ User successfully added!");
      setUser({ email: normalizedEmail });
      return true;
    } catch (error) {
      console.error("🔥 Signup Firestore error:", error);
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};