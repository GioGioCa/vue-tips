<template>
  <Header @goBack="" />

  <v-container>
    <v-row>
      <!-- Columna 1: Total y métodos -->
      <v-col cols="4">
        <v-card
          class="pa-4 rounded-xl"
          elevation="4"
        >
          <DataInput
            :totalValue="totalTips"
            :editing="isEditingTotal"
            @update:editing="handleEditing"
          />
          <PaymentDivided :newTip="{ peopleAmount: newTip.peopleAmount }" />
          <PaymentMethodInput v-model="newTip.paymentMethod" />
        </v-card>
      </v-col>

      <!-- Columna 2: InputPad siempre visible + Snackbar -->
      <v-col cols="4">
        <InputPad @confirmed="handleConfirmed" />

        <v-snackbar
          v-model="showSnackbar"
          type="info"
          class="mt-4"
          :timeout="3000"
        >
          {{ snackbarMessage }}
        </v-snackbar>
      </v-col>

      <!-- Columna 3: Lista de pagos -->
      <v-col cols="4">
        <PaymentsList
          :transactions="transactions"
          @eliminarPago="eliminarPagoParcial"
        />
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col
        cols="12"
        class="text-center"
      >
        <h3>Total Pagado: {{ paidAmount }}</h3>
        <v-btn
          :color="totalTips && paidAmount >= totalTips ? 'success' : 'primary'"
          @click="handlePago"
        >
          {{ totalTips && paidAmount >= totalTips
              ? 'Finalizar Transacción'
              : `Pagar $${confirmedValueMoney} en Propinas` }}
        </v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

import Header from "../components/Header.vue";
import DataInput from "../components/DataInput.vue";
import InputPad from "../components/InputPad.vue";
import PaymentsList from "../components/PaymentsList.vue";
import PaymentDivided from "../components/PaymentDivided.vue";
import PaymentMethodInput from "../components/PaymentMethodInput.vue";
import { useTransaction } from "../composables/usePayments";

// ——— Estado reactivo ———
const totalTips = ref<number | null>(null);
const confirmedValueMoney = ref(0);
const isEditingTotal = ref(true);
const paidAmount = ref(0);
import type { PaymentTips, Transaction } from "../composables/usePayments";
const transactions = ref<Transaction[]>([]);
const newTip = reactive({ paymentMethod: "", peopleAmount: 1 });
const transactionId = ref<string | null>(null);

const {
  fetchTransaction,
  addPayment,
  removePayment,
} = useTransaction(transactionId);

let stopTx: (() => void) | null = null;

// Snackbar toggle
const showSnackbar = ref(false);
const snackbarMessage = ref<string>("");

watch(totalTips, (v) => (showSnackbar.value = v !== null));

// Bloquear edición del total
function handleEditing(val: boolean) {
  isEditingTotal.value = !(val && totalTips.value !== null);
}

// ——— Inicializar transacción Firestore ———
async function initTransaction(amount: number) {
  const txRef = doc(collection(db, "tips_transactions"));
  await setDoc(txRef, {
    total: amount,
    paid: 0,
    createdAt: serverTimestamp(),
  });

  transactionId.value = txRef.id;

  // Escuchar pagos
  onSnapshot(collection(txRef, "payments"), (snap) => {
  const pagos = snap.docs.map((d) => ({
    valueMoney: d.data().valueMoney,
    paymentMethod: d.data().paymentMethod,
    splitAmount: d.data().splitAmount ?? 1,
    peopleAmount: d.data().peopleAmount ?? 1,
    idPayment: d.id,
  }));

    const transaccion: Transaction = {
      idTransaction: txRef.id,
      totalTips: amount,
      payments: pagos,
      createdAt: new Date(),
    };

    const index = transactions.value.findIndex(
      (t) => t.idTransaction === txRef.id
    );
    if (index !== -1) transactions.value[index] = transaccion;
    else transactions.value.push(transaccion);
  });

  // Escuchar documento padre para `paidAmount`
 // Dentro de initTransaction
  onSnapshot(txRef, (snap) => {
    const data = snap.data();
    paidAmount.value = data?.paid || 0;
    totalTips.value = data?.total ?? totalTips.value;
  });

}

// ——— Confirmación de InputPad ———
async function handleConfirmed(amount: number) {
  if (transactionId.value === null) {
    totalTips.value = amount;
    isEditingTotal.value = false;
    await initTransaction(amount);
    return;
  }

  const remaining = totalTips.value! - paidAmount.value;
  if (amount > remaining) {
    snackbarMessage.value = `Solo restan ${remaining}`;
    showSnackbar.value = true;
    return;
  }

  // Usamos addPayment del composable
  const newPayment: PaymentTips = {
    valueMoney: amount,
    paymentMethod: newTip.paymentMethod,
    splitAmount: amount / (newTip.peopleAmount || 1),
    peopleAmount: newTip.peopleAmount,
  };

  await addPayment(transactionId.value, newPayment);

  const txRef = doc(db, "tips_transactions", transactionId.value);
  await updateDoc(txRef, {
    paid: paidAmount.value + amount,
  });

  confirmedValueMoney.value = amount;

  if (paidAmount.value + amount >= totalTips.value!) {
    isEditingTotal.value = true;
  }
}

// ——— Eliminar pago parcial ———
async function eliminarPagoParcial({
  txId,
  index,
}: {
  txId: string;
  index: number;
}) {
  const tx = transactions.value.find((t) => t.idTransaction === txId);
  if (!tx) return;

  const pago = tx.payments[index];
  if (!pago?.idPayment) return;

  const pagoRef = doc(db, "tips_transactions", txId, "payments", pago.idPayment);
  await deleteDoc(pagoRef);

  const txRef = doc(db, "tips_transactions", txId);
  await updateDoc(txRef, {
    paid: paidAmount.value - pago.valueMoney,
  });
}

// ——— Utilidades ———
function splitAmountValue() {
  if (!confirmedValueMoney.value || !newTip.peopleAmount || newTip.peopleAmount <= 0) {
    return 0;
  }
  return confirmedValueMoney.value / newTip.peopleAmount;
}

function resetForm() {
  newTip.paymentMethod = "";
  newTip.peopleAmount = 1;
  confirmedValueMoney.value = 0;
}

async function resetTransaction() {
  try {
    const docRef = await addDoc(collection(db, "tips_transactions"), {
      total: null,
      paid: 0,
      createdAt: serverTimestamp(),
    });
    transactionId.value = docRef.id;
    totalTips.value = null;
    isEditingTotal.value = true;
    // reset estado local
    paidAmount.value = 0;
    confirmedValueMoney.value = 0;
    return docRef.id;
  } catch (err) {
    console.error("Error al crear nueva transacción:", err);
    return null;
  }
}

// ——— Guardar pago con botón ———
async function guardarPago() {
  if (!transactionId.value) {
    console.warn("No hay transactionId activo.");
    return;
  }

  const value = confirmedValueMoney.value ?? 0;
  if (value <= 0) {
    snackbarMessage.value = "Ingresa un monto válido";
    showSnackbar.value = true;
    return;
  }

  const newPayment: PaymentTips = {
    valueMoney: value,
    paymentMethod: newTip.paymentMethod,
    splitAmount: splitAmountValue(),
    peopleAmount: newTip.peopleAmount,
  };

  try {
    await addPayment(transactionId.value, newPayment);

    const txRef = doc(db, "tips_transactions", transactionId.value);
    await updateDoc(txRef, {
      paid: (paidAmount.value || 0) + newPayment.valueMoney,
    });

    console.log("Pago agregado correctamente");
    resetForm();
  } catch (err) {
    console.error("Error al agregar pago:", err);
    snackbarMessage.value = "Error al agregar pago";
    showSnackbar.value = true;
  }
}

async function handlePago() {
  // Si ya está pagado el total -> finalizar transacción
  if (totalTips.value && paidAmount.value >= totalTips.value) {
    try {
      const newId = await resetTransaction();
      transactionId.value = newId;
      totalTips.value = null;
      isEditingTotal.value = true;
      transactions.value = [];
      console.log("Transacción finalizada y reiniciada");
    } catch (err) {
      console.error("Error al finalizar transacción:", err);
      snackbarMessage.value = "Error al finalizar transacción";
      showSnackbar.value = true;
    }
    return;
  }

  // Si aún no se completa el total -> guardar pago normal
  await guardarPago();
}

//Escuchar transacción (aun no es necesario)
async function startListeningTo(txId: string) {
  if (stopTx) {
    stopTx();
    stopTx = null;
  }
  const unsub = await fetchTransaction(txId);
  if (typeof unsub === "function") stopTx = unsub;
}
</script>
