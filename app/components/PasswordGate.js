'use client';
import { useState, useEffect } from 'react';

export default function PasswordGate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('access-granted');
    if (saved === 'true') setAuthorized(true);
  }, []);

  const submit = () => {
    if (input === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      localStorage.setItem('access-granted', 'true');
      setAuthorized(true);
    } else {
      alert('Senha incorreta.');
    }
  };

  if (authorized) return children;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl mb-4">🔒 Acesso restrito</h1>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 text-black rounded mb-4"
        placeholder="Digite a senha"
      />
      <button
        onClick={submit}
        className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500"
      >
        Entrar
      </button>
    </div>
  );
}
