'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function BarraPerfil() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  const sair = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="bg-zinc-800 px-4 py-2 flex justify-between items-center text-white shadow-md">
      <h1 className="font-bold text-lg cursor-pointer" onClick={() => router.push('/')}>
        DAGA - TCG
      </h1>

      {usuario ? (
        <div className="flex items-center gap-4 text-sm">
          <button onClick={() => router.push('/perfil')} className="hover:underline cursor-pointer">
            @{usuario.email.split('@')[0]}
          </button>
          <button onClick={sair} className="text-red-400 hover:text-red-300 cursor-pointer">
            Sair
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 text-sm"
        >
          Entrar
        </button>
      )}
    </header>
  );
}
