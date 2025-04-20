'use client';
import { useEffect, useState } from 'react';
import { fetchCartasFromFirestore } from '@/lib/fetchCartasFromFirestore';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import DeckCarrinho from './DeckCarrinho';
import Carta from './Carta';

export default function DeckBuilder() {
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [cartasLocais, setCartasLocais] = useState([]);
  const [cartasNaoLocais, setCartasNaoLocais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [aba, setAba] = useState('nao-locais');
  const [deck, setDeck] = useState([]);

  // Carregar CSVs
  useEffect(() => {
    fetchCartasFromFirestore('locais').then(cartas => {
      console.log('Locais carregados:', cartas);
      setCartasLocais(cartas);
    });
  
    fetchCartasFromFirestore('nao-locais').then(cartas => {
      console.log('Não-locais carregados:', cartas);
      setCartasNaoLocais(cartas);
    });
  }, []);
  
  
  

  const cartasAtuais = aba === 'locais' ? cartasLocais : cartasNaoLocais;


  const cartasFiltradas = cartasAtuais.filter((carta) =>
    carta.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const adicionarCarta = (id) => {
    console.log('🟢 Adicionando carta com id:', id);
  
    // Procurar pela carta usando ID corretamente
    const cartaBase = (aba === 'locais' ? cartasLocais : cartasNaoLocais).find(c => c.id?.toString() === id.toString());
    console.log('📦 Carta encontrada:', cartaBase);
    if (!cartaBase) return;
  
    // Limites
    const limite = (() => {
      if (aba === 'locais') return 2;
      if (cartaBase.atributo?.toLowerCase().includes('personagem')) return 1;
      return 5;
    })();
  
    const maxTotal = aba === 'locais' ? 10 : 50;
  
    const total = deck.filter(c =>
      (aba === 'locais' ? cartasLocais : cartasNaoLocais)
        .some(cl => cl.id?.toString() === c.id?.toString())
    ).length;
  
    if (total >= maxTotal) return;
  
    const existentes = deck.filter(c => c.id?.toString() === id.toString()).length;
    if (existentes >= limite) return;
  
    // Adiciona a carta ao deck
    setDeck([...deck, { id: id.toString() }]);
  };
  
  

  const removerCarta = (id) => {
    const novaLista = [...deck];
    const i = novaLista.findIndex(c => c.id === id);
    if (i !== -1) {
      novaLista.splice(i, 1);
      setDeck(novaLista);
    }
  };

  const salvarDeck = async () => {
    const nome = prompt('Nome do deck:');
    if (!nome) return;

    const locais = deck.filter(c => cartasLocais.some(cl => cl.id === c.id)).map(c => c.id);
    const nlocais = deck.filter(c => cartasNaoLocais.some(cl => cl.id === c.id)).map(c => c.id);    

    const user = auth.currentUser;
    const ref = doc(db, 'jogadores', user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        decks: [{ nome, locais, nlocais }]
      });
    } else {
      const data = snap.data();
      const decks = data.decks || [];
      decks.push({ nome, locais, nlocais });
      await updateDoc(ref, { decks });
    }

    alert('Deck salvo!');
    setDeck([]);
  };

  return (
    <div className="flex flex-col md:flex-row bg-zinc-900 text-white min-h-screen p-4 gap-4">
      <div className="flex-1">
        <div className="mb-4 flex gap-4">
          <button onClick={() => setAba('nao-locais')} className={`px-4 py-2 rounded ${aba === 'nao-locais' ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
            Não-Locais
          </button>
          <button onClick={() => setAba('locais')} className={`px-4 py-2 rounded ${aba === 'locais' ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
            Locais
          </button>
          <input
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="ml-auto p-2 text-white rounded"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {cartasFiltradas.map((carta, i) => (
    <Carta
  key={i}
  dados={carta}
  tipo={aba}
  onAdd={() => adicionarCarta(carta.id)} // ← usa 'carta.id', não 'dados.id'
  modo="builder"
/>

  ))}
</div>


      </div>

      <>
      {!mostrarCarrinho && (
  <button
    onClick={() => setMostrarCarrinho(true)}
    className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-500 z-40"
  >
    🧺 Abrir Deck <strong>({deck.length}/50)</strong>
  </button>
)}



  {mostrarCarrinho && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMostrarCarrinho(false)}>
      <div
        className="absolute right-0 top-0 bottom-0 w-full md:w-[350px] bg-zinc-800 p-4 shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
<div className="flex flex-col h-full">
  <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
    <DeckCarrinho
    deck={deck}
    remover={removerCarta}
    adicionar={adicionarCarta}
    salvar={salvarDeck}
    cartasLocais={cartasLocais}
    cartasNaoLocais={cartasNaoLocais}
  />
  </div>
  <button
    onClick={() => setMostrarCarrinho(false)}
    className="mt-4 w-full bg-red-600 px-4 py-2 rounded hover:bg-red-500"
  >
    Fechar
  </button>
</div>
      </div>
    </div>
  )}
</>

    </div>
  );
}
