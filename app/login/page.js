"use client"

import { auth, provider, db } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 👇 Extrair parte do e-mail antes do "@"
      const username = user.email.split('@')[0];

      // 👇 Verifica se o jogador já está salvo
      const ref = doc(db, 'jogadores', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          nome: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          username: username,
          decks: [],
          partidas: [],
        });
      }

      router.push('/perfil');
    } catch (error) {
      console.error('Erro ao logar:', error);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-zinc-900 text-white">
      <button
        onClick={login}
        className="px-6 py-3 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500"
      >
        Entrar com Google
      </button>
    </main>
  );
}
