<!-- components/PaymentList.vue -->
<template>
    <table>
        <thead>
            <tr>
                <th><strong>Pagos</strong></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="payment in payments" :key="payment.id">
                <td>{{ payment.paymentMethod}}</td>
                <td>{{ payment.valueMoney}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import {db} from '../firebaseConfig';
import {collection, getDocs, doc, updateDoc} from 'firebase/firestore';
import { ref, onMounted } from 'vue';


interface PaymentTips {
    valueMoney: number;
    paymentMethod: string;
    splitAmount: number;
    peopleAmount: number;
    id?: string;
}
const payments = ref<PaymentTips[]>([]);

const fetchPayments = async () => {
    const querySnapshot = await getDocs(collection(db, "tips_payments"));
    payments.value = querySnapshot.docs
        .map(doc => ({id: doc.id, ...doc.data() as PaymentTips}));
}

onMounted(fetchPayments);

</script>