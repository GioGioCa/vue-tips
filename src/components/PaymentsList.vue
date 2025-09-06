<template class="flex justify-center">
    <table class="w-full table-auto text-black">
      <thead>
        <tr>
          <th class="text-left pb-2 text-lg font-bold" colspan="3">Transacciones</th>
        </tr>
      </thead>
  
      <tbody>
        <tr
          v-for="tx in transactions"
          :key="tx.idTransaction"
          class="border-b border-gray-300"
        >
          <td colspan="3" class="py-2">
            <div class="font-semibold text-gray-700">
              ID: {{ tx.idTransaction }} — Total: ${{ tx.totalTips }} — Pagado: ${{ getTotalPaid(tx) }}
              <span v-if="getTotalPaid(tx) >= tx.totalTips" class="text-green-500 ml-2">✅ Completado</span>
            </div>
  
            <ul class="pl-4 pt-1">
              <li
                v-for="(payment, index) in tx.payments"
                :key="payment.idPayment ?? index"
                class="flex justify-between items-center border-b border-gray-200 py-1"
              >
                <span>
                  <v-icon :icon="getPaymentIcon(payment.paymentMethod)" class="mr-2" />
                  {{ payment.paymentMethod }} — ${{ payment.valueMoney }}
                </span>
                <button @click="$emit('eliminarPago', { txId: tx.idTransaction, index })">
                  <v-icon class="text-red-500">mdi-close</v-icon>
                </button>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup lang="ts">
  import { addIcons } from 'oh-vue-icons';
  import { CoCash, CoCreditCard, PxCreditCard, CoDelete, MdCloseRound } from 'oh-vue-icons/icons';
  
  addIcons(CoCash, CoCreditCard, PxCreditCard, CoDelete, MdCloseRound);
  
  import { Transaction, useTransaction } from '../composables/usePayments';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
  const {} = useTransaction();
  
  const props = defineProps<{ transactions: Transaction[] }>();
  const emit = defineEmits<{
    (e: 'eliminarPago', payload: { txId: string; index: number }): void;
  }>();
  
  const getPaymentIcon = (method: string | undefined) => {
    if (!method) return 'mdi-help-circle-outline';
    return method.toLowerCase() === 'cash' ? 'mdi-cash-multiple' : 'mdi-credit-card-outline';
  };
  
  const getTotalPaid = (tx: Transaction): number => {
    return tx.payments.reduce((sum, p) => sum + p.valueMoney, 0);
  };


  </script>
