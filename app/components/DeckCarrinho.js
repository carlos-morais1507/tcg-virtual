export default function DeckCarrinho({ deck, remover, adicionar, salvar, cartasLocais, cartasNaoLocais }) {
  // Agrupar cartas por id e contar quantidades
  const agrupado = deck.reduce((acc, carta) => {
    const idStr = carta.id.toString();
    acc[idStr] = (acc[idStr] || 0) + 1;
    return acc;
  }, {});

  const totalCartas = deck.length;

  const totalLocais = Object.entries(agrupado)
    .filter(([id]) =>
      cartasLocais.some(c => c.id?.toString() === id && c.tipo?.toLowerCase() === 'local')
    )
    .reduce((soma, [, qtd]) => soma + qtd, 0);

  // Função para exibir nome da carta
  const getCartaNome = (id) => {
    const local = cartasLocais.find(c => c.id?.toString() === id);
    const nlocal = cartasNaoLocais.find(c => c.id?.toString() === id);
    return local?.nome || nlocal?.nome || id;
  };

  return (
    <aside className="w-full md:w-[300px] bg-zinc-800 p-4 rounded shadow h-fit">
      <h2 className="text-xl font-bold mb-4">🧺 Seu Deck</h2>

      {Object.entries(agrupado).length === 0 ? (
        <p className="text-sm text-zinc-400">Nenhuma carta adicionada.</p>
      ) : (
        <ul className="space-y-2 mb-4 scroll-auto">
          {Object.entries(agrupado).map(([id, qtd]) => (
            <li key={id} className="flex justify-between items-center text-sm bg-zinc-700 px-2 py-1 rounded">
              <span className="w-[60%] truncate">{getCartaNome(id)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => remover(id)}
                  className="bg-red-600 px-2 rounded text-white hover:bg-red-500"
                >–</button>
                <span>{qtd}</span>
                <button
                  onClick={() => adicionar(id)}
                  className="bg-green-600 px-2 rounded text-white hover:bg-green-500"
                >+</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm mb-1">🧮 Total: {totalCartas}/50</p>
      <p className="text-sm mb-4">🏙️ Locais: {totalLocais}/10</p>

      <button
        onClick={salvar}
        className={`w-full px-4 py-2 rounded ${totalCartas === 0 ? 'bg-zinc-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        disabled={totalCartas === 0}
      >
        Confirmar Deck
      </button>
    </aside>
  );
}
