import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
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
const db = getFirestore(app);
const storage = getStorage(app);

// Tip tanımı
export type Intern = {
  id: string;
  name: string;
  department: string;
  bio: string;
  photoURL: string;
  cvURL: string;
  createdAt: Date;
};

// 🔴 Stajyer Silme
export const deleteIntern = async (id: string) => {
  await deleteDoc(doc(db, "interns", id));
};

// 🔵 Bölüm kontrol: Yoksa ekle ve sıralama yap
export const ensureDepartmentExists = async (name: string) => {
  const departmentsRef = collection(db, "departments");
  const q = query(departmentsRef, where("name", "==", name));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(departmentsRef, { name });
    console.log(`Yeni bölüm eklendi: ${name}`);

    // Yeni eklenen bölümü ekledikten sonra tüm bölümleri alıp sıralayalım
    const departments = await getDepartments();
    console.log("Alfabetik sıralanmış bölümler:", departments);
  }
};

// 🔴 Stajyer Ekleme
export const addIntern = async (
  name: string,
  department: string,
  bio: string,
  photoFile: File | null,
  cvFile: File | null
) => {
  try {
    // Departman kontrolü ve gerekirse ekleme
    await ensureDepartmentExists(department);

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

// 🟢 Tüm stajyerleri al
export const getInterns = async (): Promise<Intern[]> => {
  const internsCollection = collection(db, "interns");
  const internSnapshot = await getDocs(internsCollection);

  const internList = internSnapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<Intern, "id" | "createdAt">),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));

  return internList;
};

// 🔵 TÜM BÖLÜMLERİ AL (ALFABETİK SIRALAMALI)
export const getDepartments = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "departments"));
  const departments = snapshot.docs.map((doc) => doc.data().name);

  // Alfabetik sıraya göre sıralama
  departments.sort((a, b) => a.localeCompare(b));

  return departments;
};

// Firebase bağlantıları dışa aktar
export { db, storage };
