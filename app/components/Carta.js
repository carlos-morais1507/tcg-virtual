'use client';

export default function Carta({ dados, tipo, onAdd, modo = 'builder' }) {
  return (
    <div className="bg-zinc-800 p-4 rounded shadow text-sm flex flex-col justify-between min-h-[200px]">
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-2">{dados.nome}</h2>

        {tipo === 'locais' ? (
          <>
            <p>💰 Ouro: {dados.ouro}</p>
            <p>👥 População: {dados.popul}</p>
            <p className="text-xs mt-2 italic">{dados.habilidade}</p>
          </>
        ) : (
          <>
            <p className="text-xs text-zinc-300 mb-1">
              {dados.tipo} {dados.atributo} {dados.faccao}
            </p>
            <p>💵 Custo: {dados.custo}</p>
            <p>⚔️ Influência: {dados.influencia}</p>
            <p className='font-bold mt-3'>{dados.nome_hab1 ? dados.nome_hab1 + ':' : ''}</p>
            <p className="text-xs italic">{dados.hab1}</p>
          </>
        )}
      </div>

      {modo === 'builder' && (
        <button
          onClick={onAdd}
          className="mt-auto px-3 py-1 bg-green-600 rounded text-xs hover:bg-green-500 cursor-pointer"
        >
          Adicionar
        </button>
      )}
    </div>
  );
}
