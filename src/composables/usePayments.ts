import { Ref, ref, watch } from 'vue';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  collectionGroup,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface PaymentTips {
  valueMoney: number;
  paymentMethod: string;
  splitAmount: number;
  peopleAmount: number;
  idPayment?: string;
}

export interface Transaction {
  idTransaction: string;
  totalTips: number;
  payments: PaymentTips[];
  createdAt: Date;
}

const transaction = ref<Transaction | null>(null);
const completed = ref(false);
const totalPaid = ref(0);
const totalCash = ref<number>(0);

const fetchTransaction = (id: string) => {
  const docRef = doc(db, 'tips_transactions', id);

  // Doc padre: leemos 'total' y lo mapeamos a 'totalTips'
  const unsubDoc = onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      transaction.value = null;
      return;
    }
    const data: any = docSnap.data();

    const createdAt =
      typeof data.createdAt?.toDate === 'function'
        ? data.createdAt.toDate()
        : new Date();

    if (!transaction.value) {
      transaction.value = {
        idTransaction: id,
        totalTips: Number(data.total ?? 0),
        payments: [],
        createdAt,
      };
    } else {
      transaction.value.totalTips = Number(
        data.total ?? transaction.value.totalTips
      );
    }
  });

  // Subcolección payments
  const paymentsRef = collection(docRef, 'payments');
  const q = query(paymentsRef, orderBy('createdAt', 'asc'));
  const unsubPayments = onSnapshot(q, (snap) => {
    const pagos: PaymentTips[] = snap.docs.map((d) => ({
      valueMoney: Number(d.data().valueMoney ?? 0),
      paymentMethod: String(d.data().paymentMethod ?? ''),
      splitAmount: Number(d.data().splitAmount ?? 1),
      peopleAmount: Number(d.data().peopleAmount ?? 1),
      idPayment: d.id,
    }));

    if (!transaction.value) {
      transaction.value = {
        idTransaction: id,
        totalTips: 0,
        payments: pagos,
        createdAt: new Date(),
      };
    } else {
      transaction.value.payments = pagos;
    }
    updateState();
  });

  // cleanup
  return () => {
    unsubDoc();
    unsubPayments();
  };
};

const updateState = () => {
  if (!transaction.value) return;
  totalPaid.value = transaction.value.payments.reduce(
    (sum, p) => sum + p.valueMoney,
    0
  );
  completed.value = totalPaid.value >= transaction.value.totalTips;
};

const addPayment = async (idTransaction: string, payment: PaymentTips) => {
  const txRef = doc(db, 'tips_transactions', idTransaction);
  const paymentsCol = collection(txRef, 'payments');

  await addDoc(paymentsCol, {
    valueMoney: payment.valueMoney,
    paymentMethod: payment.paymentMethod,
    peopleAmount: payment.peopleAmount,
    splitAmount: payment.splitAmount,
    createdAt: serverTimestamp(),
  });
};

const removePayment = async (idTransaction: string, idPayment: string) => {
  const paymentRef = doc(
    db,
    'tips_transactions',
    idTransaction,
    'payments',
    idPayment
  );
  await deleteDoc(paymentRef);
};

async function resetTransaction(): Promise<string> {
  const docRef = await addDoc(collection(db, 'tips_transactions'), {
    total: null,
    paid: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Total cash a partir de TODAS las subcolecciones 'payments'
const fetchTotalCashPayments = () => {
  const q = query(
    collectionGroup(db, 'payments'),
    where('paymentMethod', '==', 'cash')
  );

  return onSnapshot(q, (snapshot) => {
    let total = 0;
    snapshot.forEach((docSnap) => {
      total += Number(docSnap.data().valueMoney ?? 0);
    });
    totalCash.value = total;
  });
};

export function useTransaction(transactionId?: Ref<string | null>) {
  if (transactionId) {
    watch(
      transactionId,
      (id) => {
        if (id) fetchTransaction(id);
      },
      { immediate: true }
    );
  }

  return {
    transaction,
    totalPaid,
    completed,
    totalCash,
    addPayment,
    removePayment,
    fetchTransaction,
    resetTransaction,
    fetchTotalCashPayments,
  };
}
