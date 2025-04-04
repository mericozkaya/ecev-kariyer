'use client';
import { useEffect, useState } from 'react';
import { getInterns } from './lib/firebase'; // doğru import yolu olabilir, ./lib/firebase de olabilir
import InternCard from './components/InternCard';

export default function InternsList() {
  const [interns, setInterns] = useState<any[]>([]);

  useEffect(() => {
    const fetchInterns = async () => {
      const fetched = await getInterns();

      // 🔽 Zaman damgasına göre azalan sırala (en yeni en üstte)
      const sorted = fetched.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setInterns(sorted);
    };

    fetchInterns();
  }, []);

  return (
    <section id="interns" className="p-6">
      <div className="flex flex-wrap justify-center gap-6">
        {interns.map((intern) => (
          <InternCard
            key={intern.id}
            name={intern.name}
            department={intern.department}
            bio={intern.bio}
            photoURL={intern.photoURL}
            cvURL={intern.cvURL}
          />
        ))}
      </div>
    </section>
  );
}
