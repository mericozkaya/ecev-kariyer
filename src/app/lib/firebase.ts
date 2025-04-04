type Intern = {
  id: string;
  name: string;
  department: string;
  bio: string;
  photoURL: string;
  cvURL: string;
  createdAt: Date;
};

// Firebase SDK'larını import ediyoruz
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAC2PgtZEQtDde3XHIkF7E1DOvqKWO_8wM",
  authDomain: "stajyer-sitesi-final2-454813.firebaseapp.com",
  projectId: "stajyer-sitesi-final2-454813",
  storageBucket: "stajyer-sitesi-final2-454813.firebasestorage.app",
  messagingSenderId: "821882575556",
  appId: "1:821882575556:web:868ec10e114079634c4791",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Storage referanslarını oluştur
const db = getFirestore(app);
const storage = getStorage(app);

//
// 🔴 STAJYER EKLEME
//
export const addIntern = async (
  name: string,
  department: string,
  bio: string,
  photoFile: File | null,
  cvFile: File | null
) => {
  try {
    // Fotoğraf yükle
    const photoRef = ref(storage, `photos/${photoFile?.name}`);
    await uploadBytes(photoRef, photoFile as Blob);
    const photoURL = await getDownloadURL(photoRef);

    // CV yükle
    const cvRef = ref(storage, `cvs/${cvFile?.name}`);
    await uploadBytes(cvRef, cvFile as Blob);
    const cvURL = await getDownloadURL(cvRef);

    // Firestore'a yaz
    await addDoc(collection(db, "interns"), {
      name,
      department,
      bio,
      photoURL,
      cvURL,
      createdAt: Timestamp.now(),
    });

    console.log("✅ Stajyer başarıyla eklendi!");
  } catch (error) {
    console.error("❌ Stajyer eklenirken hata oluştu:", error);
  }
};

//
// 🟢 TÜM STAJYERLERİ AL
//
export const getInterns = async (): Promise<Intern[]> => {
  const internsCollection = collection(db, "interns");
  const internSnapshot = await getDocs(internsCollection);

  const internList = internSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Intern[];

  return internList;
};


//
// 🔵 TÜM BÖLÜMLERİ AL
//
export const getDepartments = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "departments"));
  return snapshot.docs.map((doc) => doc.data().name);
};

//
// 🔚 Firebase bağlantılarını dışa aktar
//
export { db, storage };
