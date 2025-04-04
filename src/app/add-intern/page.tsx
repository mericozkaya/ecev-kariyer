'use client';

import { useEffect, useState } from 'react';
import { addIntern, getDepartments } from '../lib/firebase';

export default function AddInternPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin-auth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
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

      await addIntern(name, department, bio, photoFile, cvFile);
      alert('✅ Stajyer başarıyla eklendi!');

      setName('');
      setDepartment('');
      setBio('');
      setPhotoFile(null);
      setCvFile(null);
      setPhotoPreview(null);
    };
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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-4 p-6 border border-[#d71a28] rounded-xl bg-white shadow-md text-black"
    >
      <h1 className="text-2xl font-bold text-center text-[#d71a28]">Yeni Stajyer Ekle</h1>

      <input
        type="text"
        placeholder="Ad Soyad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded-md"
        required
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="w-full border p-2 rounded-md"
        required
      >
        <option value="">Bölüm Seçin</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Tanıtım Yazısı"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full border p-2 rounded-md"
        required
      />

      <div>
        <label className="block font-medium">Fotoğraf:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
          className="mt-1"
          required
        />
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Önizleme"
            className="mt-2 w-full h-48 object-cover rounded"
          />
        )}
        <p className="text-sm text-gray-500 mt-1">• En az 300x300px • JPG veya PNG • Maks. 2MB</p>
      </div>

      <div>
        <label className="block font-medium">CV:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
          className="mt-1"
          required
        />
        {cvFile && (
          <p className="text-sm text-gray-700 mt-1">Yüklenen dosya: {cvFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-[#d71a28] text-white px-4 py-2 rounded hover:bg-[#a30f19]"
      >
        Kaydet
      </button>
    </form>
  );
}
