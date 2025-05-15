//src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where, // Importa where
  updateDoc, // Importa updateDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Salva a pontuação do usuário
const salvarPontuacao = async (usuario, pontos) => {
 try {
    const pontuacoesRef = collection(db, 'pontuacoes');
    const q = query(pontuacoesRef, where('usuario', '==', usuario));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Se não existe pontuação para o usuário, cria um novo documento
      const docRef = await addDoc(pontuacoesRef, {
        usuario,
        pontos,
        data: new Date(),
      });
      console.log("Pontuação salva com ID: ", docRef.id);
    } else {
      // Se já existe uma pontuação, atualiza apenas se a nova for maior
      snapshot.forEach(async (doc) => {
        const pontuacaoExistente = doc.data().pontos;
        if (pontos > pontuacaoExistente) {
          await updateDoc(doc.ref, {
            pontos: pontos,
            data: new Date(), // Atualiza a data da melhor pontuação
          });
          console.log("Pontuação atualizada para o usuário: ", usuario);
        } else {
           console.log("Pontuação existente é maior, não atualizando: ", usuario);
        }
      });
    }
  } catch (e) {
    console.error('Erro ao salvar ou atualizar pontuação:', e);
  }
};

// Busca as 10 melhores pontuações
const buscarTopPontuacoes = async () => {
  try {
        const q = query(
            collection(db, 'pontuacoes'),
            orderBy('pontos', 'desc'),
            orderBy('data', 'asc'), // Em caso de empate
            limit(10)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            usuario: doc.data().usuario, // Garante que o nome do usuário seja incluído
            pontos: doc.data().pontos
        }));
        console.log("Dados retornados do Firestore:", data);
        return data;
    } catch (e) {
        console.error('Erro ao buscar ranking:', e);
        return [];
    }
};

export { app, auth, db, salvarPontuacao, buscarTopPontuacoes };
