// src/services/scoreService.js
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';

export const saveScore = async (score) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, 'scores'), {
      uid: user.uid,
      email: user.email,
      score,
      createdAt: serverTimestamp()
    });
    console.log("Pontuação salva!");
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error);
  }
};
