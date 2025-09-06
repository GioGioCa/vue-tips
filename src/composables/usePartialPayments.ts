// src/composables/usePartialPayments.ts
import { ref, onMounted, onUnmounted } from "vue";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Transaction {
  id: string;
  totalTips: number;
  payments: number[];
  paymentMethod: string;
  createdAt: any;
}

const partialTransactions = ref<Transaction[]>([]);
const completedPayments = ref<Transaction[]>([]);

let currentTransactionId = ref<string | null>(null);

async function createTransaction(total: number, paymentMethod: string) {
  const docRef = await addDoc(collection(db, "tips_transactions"), {
    totalTips: total,
    payments: [],
    paymentMethod,
    createdAt: new Date(),
  });
  currentTransactionId.value = docRef.id!;
  return docRef.id;
}

async function addPartialPayment(amount: number) {
  if (!currentTransactionId.value) throw new Error("No hay transacción activa");

  const txRef = doc(db, "tips_transactions", currentTransactionId.value);
  await updateDoc(txRef, {
    payments: arrayUnion(amount),
  });
}

// --- suscripciones internas (igual que antes) ---

function subscribeTransactions() {
  const q = query(
    collection(db, "tips_transactions"),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    partialTransactions.value = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        payments: data.payments ?? [], // default si no existe
        ...(data as Omit<Transaction, "id" | "payments">),
      };
    });

    // Mueve a completos cuando toque
    for (const tx of partialTransactions.value) {
      const sumPaid = Array.isArray(tx.payments)
        ? tx.payments.reduce((a, b) => a + b, 0)
        : 0;

      if (sumPaid >= tx.totalTips) {
        // add a tips_payments
        const { id, ...rest } = tx;
        await addDoc(collection(db, "tips_payments"), {
          ...rest,
          completedAt: new Date(),
        });
        // delete original
        await deleteDoc(doc(db, "tips_transactions", id));
        if (currentTransactionId.value === id)
          currentTransactionId.value = null;
      }
    }
  });
  onUnmounted(unsubscribe);
}

function subscribeCompletedPayments() {
  const q = query(
    collection(db, "tips_payments"),
    orderBy("completedAt", "desc")
  );
  const unsubscribe = onSnapshot(q, (snap) => {
    completedPayments.value = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Transaction, "id">),
    }));
  });
  onUnmounted(unsubscribe);
}

export function usePartialPayments() {
  onMounted(() => {
    subscribeTransactions();
    subscribeCompletedPayments();
  });
  return {
    partialTransactions,
    completedPayments,
    createTransaction,
    addPartialPayment,
  };
}
