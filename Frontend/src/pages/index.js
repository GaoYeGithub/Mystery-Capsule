import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Dynamic import for Three.js components to avoid SSR issues
const ThreeScene = dynamic(() => import('../components/ThreeScene'), {
  ssr: false
});

export default function Home() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://discord-mystery.pockethost.io/api/collections/boxes/records')
      .then(res => res.json())
      .then(data => {
        setBoxes(data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching boxes:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
        {boxes.map((box) => (
          <Link href={`/box/${box.id}`} key={box.id}>
            <div className="cursor-pointer">
              <ThreeScene />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}