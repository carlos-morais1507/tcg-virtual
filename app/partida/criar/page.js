'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function PaginaPartida() {
  const [codigo, setCodigo] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  onAuthStateChanged(auth, (u) => {
    if (u) setUser(u);
  });

  const criarPartida = async () => {
    if (!user) return alert('Usuário não autenticado');

    const snap = await getDoc(doc(db, 'jogadores', user.uid));
    if (!snap.exists()) return alert('Jogador não encontrado.');

    const jogador = snap.data();
    const deckEscolhido = jogador.deckEscolhido;
    if (!deckEscolhido) return alert('Escolha um deck primeiro.');

    const deck = jogador.decks.find(d => d.nome === deckEscolhido);
    if (!deck) return alert('Deck escolhido não encontrado.');

    const codigo = Math.random().toString(36).substring(2, 8); // ID curto

    await setDoc(doc(db, 'partidas', codigo), {
      id: codigo,
      status: 'esperando',
      criador: user.uid,
      jogadores: [user.uid],
      deckCriador: [...deck.locais, ...deck.nlocais],
      deckConvidado: [],
    });

    router.push(`/partida/${codigo}`);
  };

  const entrarNaPartida = async () => {
    const ref = doc(db, 'partidas', codigo);
    const partida = await getDoc(ref);
    if (!partida.exists()) return alert('Partida não encontrada.');

    const dados = partida.data();
    if (dados.status !== 'esperando') return alert('Partida já iniciada ou finalizada.');

    await updateDoc(ref, {
      jogadores: [...dados.jogadores, user.uid],
      status: 'pronto'
    });

    router.push(`/partida/${codigo}`);
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎲 Partidas</h1>

      <button
        onClick={criarPartida}
        className="w-full mb-6 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500"
      >
        Criar nova partida
      </button>

      <div className="mb-2 text-sm">ou entre com o código:</div>

      <div className="flex gap-2">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="abc123"
          className="flex-1 px-3 py-2 rounded text-black"
        />
        <button
          onClick={entrarNaPartida}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}
