import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // SỬA LỖI: Đã xóa đuôi .js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { doc, getDoc, setDoc } from "firebase/firestore"; // Thêm setDoc

const AuthContext = createContext();

// DỰA VÀO HÌNH ẢNH CỦA BẠN, ĐÂY LÀ APP ID CHÍNH XÁC
const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // REGISTER
  // Cập nhật: Thêm 'setDoc' để tự động tạo 'role: user' khi đăng ký
  async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Tự động tạo document user mới với role 'user'
    // SỬA LỖI: Cập nhật đúng đường dẫn lồng nhau
    const userDocRef = doc(db, "artifacts", appId, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      role: "user" // Role mặc định
    });
    
    return userCredential;
  }

  // LOGIN
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "artifacts", appId, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Nếu chưa có document người dùng, tạo mặc định role 'user'
        await setDoc(docRef, { uid: user.uid, email: user.email, role: 'user' });
        const snapAfter = await getDoc(docRef);
        // Cập nhật currentUser
        setCurrentUser({ ...user, role: snapAfter.data().role });
        return snapAfter.data();
      }

      // Cập nhật currentUser khi đăng nhập thành công
      setCurrentUser({ ...user, role: docSnap.data().role });

      return docSnap.data();
    } catch (error) {
      throw error;
    }
  }
  // SOCIAL LOGIN: generic helper for popup providers
  async function signInWithProvider(provider) {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "artifacts", appId, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, { uid: user.uid, email: user.email, role: 'user' });
        setCurrentUser({ ...user, role: 'user' });
        return { user, role: 'user' };
      }

      const role = docSnap.data().role;
      setCurrentUser({ ...user, role });
      return { user, role };
    } catch (error) {
      throw error;
    }
  }

  // Convenience wrappers
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithProvider(provider);
  }

  function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithProvider(provider);
  }

  // Fallback: create a manual account when OAuth provider isn't available
  async function socialFallbackRegister(email, displayName) {
    try {
      // generate a random password (browser crypto when available)
      let password;
      try {
        const bytes = window.crypto.getRandomValues(new Uint8Array(16));
        password = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('') + 'A!1a';
      } catch (e) {
        password = Math.random().toString(36).slice(-12) + 'A!1a';
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // set display name
      try {
        await updateProfile(user, { displayName });
      } catch (e) {
        // non-fatal
      }

      const docRef = doc(db, "artifacts", appId, "users", user.uid);
      await setDoc(docRef, { uid: user.uid, email: user.email, role: 'user', displayName });

      setCurrentUser({ ...user, role: 'user', displayName });
      return { user, role: 'user', password };
    } catch (error) {
      throw error;
    }
  }
  // LOGOUT
  function logout() {
    return signOut(auth);
  }

  // GET USER + ROLE (Hàm này dùng để duy trì phiên đăng nhập khi F5)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // SỬA LỖI: Cập nhật đúng đường dẫn lồng nhau
        const docRef = doc(db, "artifacts", appId, "users", user.uid);
        const docSnap = await getDoc(docRef);

        const role = docSnap.exists() ? docSnap.data().role : "user";

        setCurrentUser({
          ...user,
          role: role
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  loading,
    register,
    login,
    signInWithGoogle,
    signInWithFacebook,
    socialFallbackRegister,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}