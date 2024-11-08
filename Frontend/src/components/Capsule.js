import Link from 'next/link';

const TimeCapsuleGrid = () => {
  const capsules = [
    { id: "2024", title: "Memory 2024", content: "First quantum computer reaches 1 million qubits" },
    { id: "2025", title: "Vision 2025", content: "Mars colony construction begins" },
    { id: "2026", title: "Future 2026", content: "Flying cars become commercially available" },
    { id: "2027", title: "Dream 2027", content: "Teleportation breakthrough achieved" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-12">
          Temporal Vault Interface
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {capsules.map((capsule) => (
            <Link href={`/capsule/${capsule.id}`} key={capsule.id}>
              <div className="cursor-pointer">
                <TimeCapsule {...capsule} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { TimeCapsule };
export default TimeCapsuleGrid;