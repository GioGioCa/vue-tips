import { ref, onMounted } from 'vue';
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Define la interfaz de los datos
interface PaymentTips {
    valueMoney: number;
    paymentMethod: string;
    splitAmount: number;
    peopleAmount: number;
    id: string;
}

// Define el array reactivo para almacenar los datos
const items = ref<PaymentTips[]>([]);

// Método para obtener los datos de Firestore
const getItems = async () => {
    items.value = [];
    const querySnapshot = await getDocs(collection(db, 'tips_payments'));
    querySnapshot.forEach((doc) => {
        const data = doc.data() as PaymentTips;
        items.value.push({
            valueMoney: data.valueMoney,
            paymentMethod: data.paymentMethod,
            splitAmount: data.splitAmount,
            peopleAmount: data.peopleAmount,
            id: doc.id,
        });
    });
};
const q = query(collection(db, "tips_payments"));
const notes = ref([]);

const getNotes = async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const note: PaymentTips = {
            id: doc.id,
            valueMoney: docData.valueMoney,
            paymentMethod: docData.paymentMethod,
            splitAmount: docData.splitAmount,
            peopleAmount: docData.peopleAmount
        };
        items.value.push(note);
    });
}

export function usePayments() {
    return { notes, getNotes };
}