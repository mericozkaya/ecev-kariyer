'use client';
import { useEffect, useState } from 'react';
import { getInterns } from '../lib/firebase/firebase';
import InternCard from './InternCard';
import InternCardSkeleton from './InternCardSkeleton';
import type { Intern } from '../lib/firebase/firebase';

export default function InternsList() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterns = async () => {
      const fetched = await getInterns();
      const sorted = fetched.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      setInterns(sorted);
      setLoading(false);
    };
    fetchInterns();
  }, []);

  return (
    <section id="interns" className="px-4 sm:px-10 max-w-screen-xl mx-auto py-6">
      <div className="flex flex-wrap justify-center gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <InternCardSkeleton key={i} />)
          : interns.map((intern) => (
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
