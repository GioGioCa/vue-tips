import { ref, onMounted, onUnmounted} from 'vue';
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Define la interfaz de los datos
interface PaymentTips {
    valueMoney: number;
    paymentMethod: string;
    splitAmount: number;
    peopleAmount: number;
    id?: string;
}

// Define el array reactivo para almacenar los datos
const payments = ref<PaymentTips[]>([]);
const totalCash = ref<number>(0);
// Método para obtener los datos de Firestore
//const querySnapshot = await getDocs(collection(db, "tips_payments"));

const fetchPayments = async () => {

    const q = query(collection(db, "tips_payments"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    payments.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as PaymentTips),
    }));
    totalCash.value = await fetchTotalCashPayments();
});

onUnmounted(() => unsubscribe());
};

const fetchTotalCashPayments = async () => {
    const cashPaymentsQuery = query(
        collection(db, "tips_payments"),
        where("paymentMethod", "==", "cash")
    );
    const querySnapshot = await getDocs(cashPaymentsQuery);
    const total = querySnapshot.docs.reduce((sum, doc) => {
        const data = doc.data() as PaymentTips;
        return sum + data.valueMoney;
    }, 0);
    return total;
};

//onMounted(fetchPayments);

export function usePayments() {
    onMounted(fetchPayments);
    return { payments, totalCash, fetchPayments, fetchTotalCashPayments };
}