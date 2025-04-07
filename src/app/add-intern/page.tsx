'use client';

import { useEffect, useState } from 'react';
import {
  addIntern,
  getDepartments,
  ensureDepartmentExists,
  getInterns,
  deleteIntern,
  type Intern,
} from '../../lib/firebase/firebase';

export default function AddInternPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [newDepartment, setNewDepartment] = useState('');
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [departmentMessage, setDepartmentMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('admin-auth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const fetchInterns = async () => {
    const data = await getInterns();
    setInterns(data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchInterns();
  }, []);

  const handleLogin = () => {
    if (password === 'ecevadmin') {
      localStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
    } else {
      alert('Hatalı şifre!');
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!photoFile || !cvFile) {
      return alert('Lütfen hem fotoğraf hem CV yükleyin.');
    }

    if (!['image/jpeg', 'image/png'].includes(photoFile.type)) {
      return alert('Sadece JPG veya PNG formatında fotoğraf yükleyin.');
    }

    if (photoFile.size > 2 * 1024 * 1024) {
      return alert('Fotoğraf dosyası 2MB’den büyük olamaz.');
    }

    const imgCheck = new Image();
    imgCheck.src = URL.createObjectURL(photoFile);
    imgCheck.onload = async () => {
      if (imgCheck.width < 300 || imgCheck.height < 300) {
        return alert('Fotoğraf çözünürlüğü en az 300x300 piksel olmalı.');
      }

      if (cvFile.type !== 'application/pdf') {
        return alert('CV sadece PDF formatında olmalı.');
      }

      try {
        setIsSubmitting(true);
        setMessage('Kaydediliyor...');
        await addIntern(name, department, bio, photoFile, cvFile);
        setMessage('✅ Stajyer başarıyla eklendi!');
        setName('');
        setDepartment('');
        setBio('');
        setPhotoFile(null);
        setCvFile(null);
        setPhotoPreview(null);
        fetchDepartments();
        fetchInterns();
      } catch (err) {
        alert('Bir hata oluştu.');
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setMessage(''), 3000);
      }
    };
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      setDepartmentMessage('Lütfen bir bölüm adı girin.');
      return;
    }

    try {
      setIsAddingDepartment(true);
      await ensureDepartmentExists(newDepartment.trim());
      setDepartmentMessage('✅ Bölüm eklendi veya zaten mevcut.');
      setNewDepartment('');
      fetchDepartments();
    } catch (err) {
      setDepartmentMessage('❌ Bir hata oluştu.');
    } finally {
      setIsAddingDepartment(false);
      setTimeout(() => setDepartmentMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu stajyeri silmek istediğinize emin misiniz?")) return;

    try {
      await deleteIntern(id);
      setInterns((prev) => prev.filter((i) => i.id !== id));
      alert("Stajyer başarıyla silindi.");
    } catch (err) {
      alert("Bir hata oluştu.");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-semibold text-[#d71a28]">Admin Girişi</h1>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-[#d71a28] text-white px-4 py-2 rounded hover:bg-[#a30f19]"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-10 p-6 text-black">
      {/* STAJYER EKLEME */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-[#d71a28] rounded-xl bg-white shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-center text-[#d71a28]">Yeni Stajyer Ekle</h1>
        {message && <p className="text-center text-sm text-green-600 font-medium">{message}</p>}

        <input type="text" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded-md" required />

        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border p-2 rounded-md" required>
          <option value="">Bölüm Seçin</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <textarea placeholder="Tanıtım Yazısı" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border p-2 rounded-md" required />

        <div>
          <label className="block font-medium">Fotoğraf:</label>
          <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)} className="mt-1" required />
          {photoPreview && <img src={photoPreview} alt="Önizleme" className="mt-2 w-full h-48 object-cover rounded" />}
          <p className="text-sm text-gray-500 mt-1">• En az 300x300px • JPG veya PNG • Maks. 2MB</p>
        </div>

        <div>
          <label className="block font-medium">CV:</label>
          <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="mt-1" required />
          {cvFile && <p className="text-sm text-gray-700 mt-1">Yüklenen dosya: {cvFile.name}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full px-4 py-2 rounded text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#d71a28] hover:bg-[#a30f19]'}`}>
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>

      {/* YENİ BÖLÜM EKLEME */}
      <div className="space-y-4 border border-[#0057A0] rounded-xl bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-center text-[#0057A0]">Yeni Bölüm Ekle</h2>
        {departmentMessage && <p className="text-center text-sm text-green-600 font-medium">{departmentMessage}</p>}
        <input type="text" placeholder="Yeni bölüm adı" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} className="w-full border p-2 rounded-md" />
        <button onClick={handleAddDepartment} disabled={isAddingDepartment} className={`w-full px-4 py-2 rounded text-white transition ${isAddingDepartment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0057A0] hover:bg-[#004070]'}`}>
          {isAddingDepartment ? 'Ekleniyor...' : 'Bölüm Ekle'}
        </button>
      </div>

      {/* STAJYER SİLME */}
      <div className="space-y-4 border border-red-400 rounded-xl bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-center text-red-600">Stajyer Listesi (Silme)</h2>
        {interns.length === 0 ? (
          <p className="text-gray-500 text-center">Henüz hiç stajyer eklenmemiş.</p>
        ) : (
          <ul className="space-y-4">
            {interns.map((intern) => (
              <li key={intern.id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <p className="font-medium">{intern.name}</p>
                  <p className="text-sm text-gray-500">{intern.department}</p>
                </div>
                <button
                  onClick={() => handleDelete(intern.id)}
                  className="text-sm bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
