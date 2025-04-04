/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";
import { getInterns, getDepartments } from "./lib/firebase";

// Eğer yukarıda tanımlı değilse bunu page.tsx'e ekle:
type Intern = {
  id: string;
  name: string;
  department: string;
  bio: string;
  photoURL: string;
  cvURL: string;
  createdAt: Date;
};


export default function HomePage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const internsData = await getInterns();
      const departmentsData = await getDepartments();
      setInterns(internsData);
      setDepartments(departmentsData);
    };
    fetchData();
  }, []);
  
  

  const filteredInterns = selectedDepartment
    ? interns.filter((i) => i.department === selectedDepartment)
    : interns;

  return (
    <main className="min-h-screen bg-white text-black px-6 pb-12">
      {/* Logo ve Başlık */}
      <header className="flex items-center justify-between p-4 border-b border-[#d71a28]">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Eçev Logosu" className="w-14 h-14" />
          <h1 className="text-3xl font-semibold text-[#d71a28]">Eçev Kariyer</h1>
        </div>
        <nav className="space-x-6 text-[#0057A0] font-medium">
          <a href="#interns">Anasayfa</a>
          <a href="#about">Biz Kimiz?</a>
          <a href="#contact">İletişim</a>
        </nav>
      </header>

      {/* Bölüm Seçim Dropdown */}
      <div className="mt-6">
        <select
          className="border border-[#d71a28] px-3 py-2 rounded-md w-full max-w-md"
          onChange={(e) => setSelectedDepartment(e.target.value)}
          value={selectedDepartment}
        >
          <option value="">Tüm Bölümler</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Stajyer Kartları */}
        <section
        id="interns"
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >

        {filteredInterns.map((intern) => (
          <div
            key={intern.id}
            className="bg-white rounded-md shadow p-4 border border-gray-200 flex flex-col"
          >
            <div className="w-full aspect-[3/2] overflow-hidden rounded-md mb-4">
              <img
                src={intern.photoURL}
                alt={intern.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-[#d71a28]">{intern.name}</h2>
            <p className="text-sm text-gray-500">{intern.department}</p>
            <p className="text-sm mt-1">{intern.bio}</p>
            <a
              href={intern.cvURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-[#0057A0] underline text-sm"
            >
              CV’yi Görüntüle
            </a>
          </div>
        ))}
      </section>

      {/* Biz Kimiz - İletişim */}
      <footer className="mt-12 bg-gray-100 py-10 text-center" id="about">
        <h2 className="text-xl font-bold text-[#d71a28] mb-2">Biz Kimiz?</h2>
        <p className="max-w-2xl mx-auto text-gray-700 px-4">
          Ege Çağdaş Eğitim Vakfı olarak, bursiyer gençlerimizin kariyer
          yolculuklarında destek olabilmek için bu platformu oluşturduk.
        </p>

        <div id="contact" className="mt-6">
          <h3 className="text-[#d71a28] font-semibold text-lg mb-1">İletişim</h3>
          <p>Email: info@ecev.org</p>
          <p>Telefon: +90 232 000 00 00</p>
        </div>
      </footer>
    </main>
  );
}
