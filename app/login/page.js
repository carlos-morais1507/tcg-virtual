'use client';
import { auth, provider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/salas');
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
