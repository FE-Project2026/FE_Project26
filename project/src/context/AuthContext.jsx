import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithCredential,
  linkWithCredential // CẦN THIẾT: Để gộp tài khoản khi trùng Email
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();
const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function syncUserToDb(user) {
    const userDocRef = doc(db, "artifacts", appId, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        createdAt: serverTimestamp()
      });
      return "user";
    }
    return docSnap.data().role;
  }

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const role = await syncUserToDb(res.user);
    return { ...res.user, role };
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncUserToDb(result.user);
  };

  // HÀM FACEBOOK ĐÃ TỐI ƯU
  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');

    try {
      // Dùng popup Firebase để không bị lỗi "FB.login from http pages"
      const result = await signInWithPopup(auth, provider);
      await syncUserToDb(result.user);
      return result.user;
    } catch (error) {
      // Xử lý lỗi trùng Email (Account Exists)
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const pendingCredential = FacebookAuthProvider.credentialFromError(error);
        
        alert(`Email ${email} đã được đăng ký qua Google. Vui lòng xác thực Google để gộp tài khoản.`);
        
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ login_hint: email });
        
        const googleResult = await signInWithPopup(auth, googleProvider);
        const linkedUser = await linkWithCredential(googleResult.user, pendingCredential);
        await syncUserToDb(linkedUser.user);
        return linkedUser.user;
      }
      
      if (error.code === 'auth/popup-blocked') {
        alert("Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép Popup cho trang web này!");
      }
      throw error;
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "artifacts", appId, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        const role = docSnap.exists() ? docSnap.data().role : "user";
        setCurrentUser({ 
          ...user, 
          role,
          displayName: docSnap.exists() ? docSnap.data().displayName : user.displayName,
          photoURL: docSnap.exists() ? docSnap.data().photoURL : user.photoURL
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
    login,
    loginWithGoogle,
    loginWithFacebook, 
    logout,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}