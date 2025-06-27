<template class="">
    <Header @goBack="" />
    <v-container>
        <v-row>
            <v-col cols="4" class="">Columna 1
                <v-card class="pa-4 rounded-xl" elevation="4">
                <v-row>
                    <v-col cols="12" class="align-center">
                        <DataInput :confirmedValue="confirmedValueMoney" v-model:editing="isEditing" />
                        <PaymentDivided :newTip="{ peopleAmount: newTip.peopleAmount }" />
                        <PaymentMethodInput v-model="newTip.paymentMethod"/>
                    </v-col>
                </v-row>
                </v-card>
            </v-col>
            <v-col cols="4" class="bg-green lighten-2">Columna 2
                <v-container>
                    <InputPad :isEditing="isEditing" @confirmed="handleConfirmed" @close="isEditing = false"/>
                </v-container>
            </v-col>

            <v-col cols="4" class="">
                <PaymentsList />
            </v-col>
        </v-row>

    </v-container>


    <v-col>
        <h3>Total Pagado</h3>

        <v-btn
        
      color="primary"
        @click="guardarPago" class="pay-button" >
            Pagar ${{ totalTips.toFixed(2) }} en Propinas
        </v-btn>
        <div>Restante por Pagar: ${{ restante.toFixed(2) }}</div>
    </v-col>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, watchEffect } from "vue";
import "../assets/styles/tailwind.css";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { usePayments } from "../composables/usePayments";
import Header from "./Header.vue";
import PaymentsList from "./PaymentsList.vue";
import InputPad from "./InputPad.vue";
import DataInput from "./DataInput.vue";
import PaymentDivided from "./PaymentDivided.vue";
import PaymentMethodInput from "./PaymentMethodInput.vue";
import Test from "./Test.vue";

const confirmedTip = ref<number | null>(1500); // valor por defecto
const pagosParciales = ref([]); // lista de pagos parciales
const restante = computed(() => {
  const suma = pagosParciales.value.reduce((acc, p) => acc + p.monto, 0);
  return Math.max(totalTips.value - suma, 0);
});
const selectedOption = ref<string | null>(null);

const guardarPago2 = async () => {
  if (!esPagoCompleto.value) {
    alert("Aún falta completar el pago");
    return;
  }

  const nuevoPago = {
    total: totalTips.value,
    divididoEntre: newTip.peopleAmount,
    pagos: pagosParciales.value,
    estado: "completo"
  };

  await firebase.database().ref("propinas/" + someGeneratedId()).set(nuevoPago);
  alert("Propinas guardadas correctamente");
};

onMounted(() => {
    try {
        // Código que podría fallar
        usePayments();
    } catch (error) {
        console.error("Error en mounted:", error);
    }
});

const confirmedValueMoney = ref<number | null>(null);

const handleConfirmed = (val: number) => {
    confirmedValueMoney.value = val;
};


const isEditing = ref(false); // Estado para bloquear/desbloquear edición

const loading = ref(true); // Para saber si aún está cargando


import { usePaymentMethod } from '../composables/usePaymentMethod';
const { options, selectedMethod } = usePaymentMethod();

const totalAmount = ref(5500);

//const confirmedValueMoney = ref(0); // Almacena el valor confirmado
const tip = ref<
    { valueMoney: number; paymentMethod: string; splitAmount: number }[]
>([
    { valueMoney: 50, paymentMethod: "Efectivo", splitAmount: 2 },
    { valueMoney: 100, paymentMethod: "Tarjeta", splitAmount: 3 },
]); // Lista de pagos
const newTip = reactive({
    valueMoney: 0,
    paymentMethod: '' as string, // Evita errores si options aún no está listo
    peopleAmount: 1,
});


const guardarPago = async () => {
    try {
        console.log("Guardando pago..."); // Verifica si se ejecuta

        const docRef = await addDoc(collection(db, "tips_payments"), {
            valueMoney: confirmedValueMoney.value,
            paymentMethod: newTip.paymentMethod,
            splitAmount: Number(amountPerPerson.value),
            peopleAmount: newTip.peopleAmount,
            createdAt: serverTimestamp()
        });

        console.log("Pago guardado con ID:", docRef.id); // Verifica que se guarde en Firebase

        await usePayments();

        // Reiniciar valores
        confirmedValueMoney.value = 0;
        newTip.paymentMethod = '';
        newTip.peopleAmount = 1;

    } catch (error) {
        console.error("Error al guardar el pago:", error);
    }
};
watchEffect(() => {
    if (options.value.length) {
        newTip.paymentMethod = options.value[0].value;
    }
});

// Cálculo del monto por persona
const amountPerPerson = computed(() => {
    if (!confirmedValueMoney.value || newTip.peopleAmount <= 0) return "0";
    return (confirmedValueMoney.value / newTip.peopleAmount).toFixed(2);
});

interface PaymentTips {
    valueMoney: number;
    paymentMethod: string;
    splitAmount: number;
    peopleAmount: number;
    id?: string;
}
// Monitorea el cambio de selección
watch(() => newTip.paymentMethod, (newVal) => {
    console.log('Método de pago seleccionado:', newVal);
});

const inputText = ref('');

// Sincroniza newTip.valueMoney con inputText
watch(inputText, (newValue) => {
    newTip.valueMoney = parseFloat(newValue) || 0;
});
watch(tip, (newPayments) => {
    const cashTotal = newPayments
        .filter(p => p.paymentMethod === "cash")
        .reduce((sum, p) => sum + p.valueMoney, 0);

    totalAmount.value = 5500 + cashTotal;
}, { deep: true });

</script>