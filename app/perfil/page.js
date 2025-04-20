'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import AdminCSVUploader from '../components/AdminCSVUploader';
import MenuAcoesDeck from '../components/MenuAcoesDeck';



export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);
  const [decks, setDecks] = useState([]);
  const [deckEscolhido, setDeckEscolhido] = useState(null);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) return;
    setUsuario(user);

    // Checagem de admin
    const raw = process.env.NEXT_PUBLIC_ADMINS || '[]';
    try {
      const lista = JSON.parse(raw);
      setIsAdmin(lista.includes(user.email));
    } catch (e) {
      console.error('NEXT_PUBLIC_ADMINS inválido', e);
    }

    // Dados do jogador
    const ref = doc(db, 'jogadores', user.uid);
    getDoc(ref).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setDecks(data.decks || []);
        setDeckEscolhido(data.deckEscolhido || null); // ← aqui!
      }      
      });
    });

  return () => unsubscribe();
}, []);



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
  
      setUsuario(user); // salvar no estado
  
      const ref = doc(db, 'jogadores', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        console.log('Decks carregados:', data.decks);
        setDecks(data.decks || []);
      } else {
        console.log('Documento do jogador não encontrado.');
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6 bg-zinc-900 text-white min-h-screen">
      {usuario && (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <img src={usuario.photoURL} />
            <div>
              <p className="text-lg">{usuario.displayName}</p>
              <p className="text-sm text-zinc-400">{usuario.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className='flex gap-4 mb-4'>
        <h2 className="text-xl font-semibold p-2">🃏 Seus Decks</h2>
        <a href='/perfil/adddeck' className='bg-green-800 text-white font-bold p-2 rounded-md'>Adicionar Deck</a>
      </div>

      {decks.length === 0 ? (
        <p className="text-zinc-400">Nenhum deck salvo ainda.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck, i) => (
                    <li key={i} className="relative bg-zinc-800 p-4 rounded shadow">
          <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold">
            {deck.nome}
            {deck.nome === deckEscolhido && (
              <span className="text-xs text-green-400 font-bold ml-2">✔️ Selecionado</span>
            )}
          </h3>
            <MenuAcoesDeck
              index={i}
              deck={deck}
              userId={usuario.uid}
              setDecks={setDecks}
            />
          </div>
          <p className="text-sm text-zinc-400">Cartas: {(deck.nlocais?.length || 0) + (deck.locais?.length || 0)}</p>
          <p className="text-sm text-zinc-400">Locais: {deck.locais?.length || 0}</p>
          <p className="text-sm text-zinc-400">Não-Locais: {deck.nlocais?.length || 0}</p>
        </li>

          ))}
        </ul>
      )}

    <button
      onClick={async () => {
        await signOut(auth);
        router.push('/login');
      }}
      className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-500"
    >
      Sair da Conta
    </button>

    {isAdmin && (
  <section className="mt-10 border-t border-zinc-700 pt-6">
    <h2 className="text-xl font-bold mb-4">🛠️ Área de Admin</h2>

    <AdminCSVUploader />
  </section>
)}


    </main>
  );
}
