import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ThreeScene = dynamic(() => import('../../components/ThreeScene'), {
  ssr: false
});

export default function BoxPage() {
  const router = useRouter();
  const { id } = router.query;
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://discord-mystery.pockethost.io/api/collections/boxes/records/${id}`)
        .then(res => res.json())
        .then(data => {
          setBoxData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching box:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!boxData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Box not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <ThreeScene boxData={boxData} />
    </div>
  );
}