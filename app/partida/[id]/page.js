'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SalaPartida() {
  const { id } = useParams();
  const router = useRouter();
  const [partida, setPartida] = useState(null);
  const [jogador, setJogador] = useState(null);
  const [criador, setCriador] = useState(false);
  const [nomesJogadores, setNomesJogadores] = useState({});

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return router.push('/login');
      setJogador(user);
    
      const snap = await getDoc(doc(db, 'partidas', id));
      if (!snap.exists()) {
        alert('Partida não encontrada');
        router.push('/partida');
        return;
      }
    
      const dados = snap.data();
      setPartida(dados);
      setCriador(user.uid === dados.criador);
    
      // Buscar nomes dos jogadores
      const nomesTemp = {};
      for (const uid of dados.jogadores) {
        const userSnap = await getDoc(doc(db, 'jogadores', uid));
        if (userSnap.exists()) {
          nomesTemp[uid] = userSnap.data().username || uid;
        } else {
          nomesTemp[uid] = uid;
        }
      }      
      setNomesJogadores(nomesTemp);
    });

    return () => unsub();
  }, [id, router]);

  const iniciarPartida = async () => {
    await updateDoc(doc(db, 'partidas', id), {
      status: 'em andamento'
    });
    alert('Partida iniciada! 🎮');
    // Você pode redirecionar ou carregar a partida aqui
  };

  if (!partida) return <main className="p-6 text-white">Carregando partida...</main>;

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎮 Sala da Partida</h1>
      <p className="mb-2">Código: <strong>{partida.id}</strong></p>
      <p className="mb-4">Status: <span className="text-indigo-400">{partida.status}</span></p>

      <h2 className="text-lg font-semibold mb-2">Jogadores:</h2>
      <ul className="mb-4 list-disc list-inside text-zinc-300">
      {partida.jogadores.map((j, i) => (
        <li key={i}>
          {j === jogador?.uid ? '🧍 Você' : `@${nomesJogadores[j] || j}`}
        </li>
      ))}

      </ul>

      {criador && partida.jogadores.length === 2 && partida.status === 'pronto' && (
        <button
          onClick={iniciarPartida}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Iniciar Partida
        </button>
      )}

      {!criador && <p className="text-sm text-zinc-400">Aguardando o criador iniciar...</p>}
    </main>
  );
}
