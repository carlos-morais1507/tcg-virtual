'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const router = useRouter();

  const criarSala = async () => {
    const user = auth.currentUser;
    const sala = await addDoc(collection(db, 'partidas'), {
      jogador1: user.uid,
      status: 'aguardando',
    });
    router.push(`/partida/${sala.id}`);
  };

  useEffect(() => {
    const q = query(collection(db, 'partidas'), where('status', '==', 'aguardando'));
    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSalas(lista);
    });
    return () => unsub();
  }, []);

  return (
    <main className="p-6 text-white bg-zinc-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Salas disponíveis</h1>
      <ul className="space-y-2 mb-6">
        {salas.map((sala) => (
          <li key={sala.id}>
            <button
              className="bg-green-600 px-4 py-2 rounded"
              onClick={() => router.push(`/partida/${sala.id}`)}
            >
              Entrar na sala #{sala.id.substring(0, 5)}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="bg-blue-600 px-6 py-3 rounded shadow"
        onClick={criarSala}
      >
        Criar nova sala
      </button>
    </main>
  );
}
