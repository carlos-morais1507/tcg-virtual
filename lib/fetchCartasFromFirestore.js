import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Papa from 'papaparse';

// tipo = 'locais' ou 'nao-locais'
export async function fetchCartasFromFirestore(tipo) {
  const snap = await getDocs(collection(db, 'patches'));

  const patches = [];
  snap.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    patches.push({ id, ...data });
  });

  // Filtrar por tipo de patch
  const filtrado = patches
    .filter(p => {
      const isLocal = p.id.endsWith('-L');
      return tipo === 'locais' ? isLocal : !isLocal;
    })
    .sort((a, b) => b.criadoEm?.seconds - a.criadoEm?.seconds); // mais recente primeiro

  if (filtrado.length === 0) return [];

  const { csv } = filtrado[0];
  const resultado = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) =>
      header.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
  });
  

  return resultado.data;
}
