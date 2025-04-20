'use client';
import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MenuAcoesDeck({ index, deck, userId, setDecks }) {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAberto(false);
      }
    };

    if (aberto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [aberto]);

  const toggle = () => setAberto(!aberto);

  const selecionar = async () => {
    await updateDoc(doc(db, 'jogadores', userId), {
      deckEscolhido: deck.nome
    });
    alert(`Deck "${deck.nome}" agora está selecionado para partidas!`);
  };
  

  const remover = async () => {
    const ref = doc(db, 'jogadores', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    const novos = [...(data.decks || [])];
    novos.splice(index, 1);
    await updateDoc(ref, { decks: novos });
    setDecks(novos);
  };

  const duplicar = async () => {
    const novoDeck = { ...deck, nome: deck.nome + ' (cópia)' };
    const ref = doc(db, 'jogadores', userId);
    const snap = await getDoc(ref);
    const data = snap.data();
    const atualizados = [...(data.decks || []), novoDeck];
    await updateDoc(ref, { decks: atualizados });
    setDecks(atualizados);
  };

  const editar = () => {
    alert('Em breve: editor de decks 😎');
    // Redirecionamento futuro aqui
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={toggle} className="text-xl">⚙️</button>
      {aberto && (
        <ul className="absolute right-0 bg-zinc-700 text-sm rounded shadow overflow-hidden mt-1 z-50 min-w-30">
          <li className="px-4 py-2 hover:bg-zinc-600 cursor-pointer" onClick={selecionar}>
            ✅ Selecionar
          </li>
          <li className="px-4 py-2 hover:bg-zinc-600 cursor-pointer" onClick={editar}>✏️ Editar</li>
          <li className="px-4 py-2 hover:bg-zinc-600 cursor-pointer" onClick={duplicar}>📄 Duplicar</li>
          <li className="px-4 py-2 hover:bg-red-600 cursor-pointer text-red-300" onClick={remover}>🗑️ Remover</li>
        </ul>
      )}
    </div>
  );
}
