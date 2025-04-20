'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminCSVUploader() {
  const [tipo, setTipo] = useState('nao-locais');
  const [versao, setVersao] = useState('');
  const [csv, setCsv] = useState('');
  const [msg, setMsg] = useState('');

  const salvarPatch = async () => {
    if (!csv || !versao || !tipo) return alert('Preencha tudo');

    const ref = doc(db, 'patches', versao);
    await setDoc(ref, {
      tipo,
      csv,
      criadoEm: serverTimestamp()
    });

    setMsg('✅ Patch salvo com sucesso!');
    setCsv('');
    setVersao('');
  };

  return (
    <div className="bg-zinc-800 p-4 rounded">
      <label className="block mb-2 text-sm">Tipo do CSV:</label>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="mb-4 p-2 text-black rounded w-full"
      >
        <option value="nao-locais">Não-Locais</option>
        <option value="locais">Locais</option>
      </select>

      <label className="block mb-2 text-sm">Código do Patch:</label>
      <input
        value={versao}
        onChange={(e) => setVersao(e.target.value)}
        placeholder="ex: patch-1.2"
        className="mb-4 p-2 text-black rounded w-full"
      />

      <label className="block mb-2 text-sm">CSV:</label>
      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        rows={6}
        placeholder="Cole o conteúdo do CSV aqui"
        className="mb-4 p-2 text-black rounded w-full font-mono"
      />

      <button
        onClick={salvarPatch}
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
      >
        Salvar patch
      </button>

      {msg && <p className="text-green-400 text-sm mt-3">{msg}</p>}
    </div>
  );
}
