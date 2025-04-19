<template class="">
    <Header @goBack="" />
    <v-container>
        <v-row>
            <v-col cols="4" class="bg-red lighten-2">Columna 1
                <v-row>
                    <v-col cols="12">
                        <h5 class="text-orange">Total propinas</h5>
                    </v-col>
                    <v-col cols="8" class="align-center">
                        <h1 readonly class="text-orange bg-orange-accent-1 font-bold rounded-lg text-center">{{
                            confirmedValueMoney
                        }}</h1>
                    </v-col>
                    <v-col cols="4" class="text-center">
                        <v-btn color="blue" @click="toggleEdit">
                            {{ isEditing ? "Cancelar" : "Editar" }}
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <h5>¿Entre cuantos quieres dividir la propina?</h5>
                        <input type="number" v-model="newTip.peopleAmount" min="1" />
                        <span>$ {{ amountPerPerson }} - por Persona</span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <h2>Método de Pago</h2>
                        <v-row>
                            <v-container>
                                <v-row justify="center" align-content="center">
                                    <v-col cols="6" v-for="option in options" :key="option.value"
                                        class="d-flex justify-center">
                                        <v-btn-toggle v-model="selectedMethod" mandatory class="flex flex-wrap gap-2">
                                            <v-btn :value="option.value" class="bg-white text-black text-center"
                                                style=" border-radius: 12px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);">
                                                {{ option.label }}
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="4" class="bg-green lighten-2">Columna 2
                <v-row no-gutters>
                    <v-col cols="10">
                        <v-text-field v-model="inputText" label="Ingresar número" readonly dense outlined
                            :disabled="!isEditing"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="deleteText" color="red" :disabled="!isEditing">Delete</v-btn>
                    </v-col>
                </v-row>

                <v-container>
                    <v-row dense class="gap-1 justify-center">
                        <v-col v-for="(item, index) in buttonLayout" :key="index" cols="4" class="pa-1">
                            <v-btn
                                class="bg-gray-100 text-black font-bold flex justify-center items-center rounded-lg text-h6 w-16 h-16"
                                @click="handleClick(item)" :disabled="!isEditing">
                                {{ item }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>

            </v-col>

            <v-col cols="4" class="">
                <PaymentsList/>
            </v-col>
        </v-row>
    </v-container>


    <v-col>
        <h3>Total Pagado</h3>

        <v-btn @click="guardarPago" class="pay-button" color="orange">
            Pagar
        </v-btn>
    </v-col>
    <InputPad/>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, watchEffect } from "vue";
import "../assets/styles/tailwind.css";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { usePayments } from "../composables/usePayments";
import Header from "./Header.vue";
import PaymentsList from "./PaymentsList.vue";
import InputPad from "./inputPad.vue";

onMounted(() => {
    try {
        // Código que podría fallar
        usePayments();
    } catch (error) {
        console.error("Error en mounted:", error);
    }
});


const buttonLayout = ref([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "00",
    "0",
    "✔",
]);
const isEditing = ref(false); // Estado para bloquear/desbloquear edición

const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
        inputText.value = "";
    }
};

// Estado reactivo para los datos
const objetos = ref<PaymentTips[]>([]);
const loading = ref(true); // Para saber si aún está cargando

// Función para obtener datos de Firebase
const getObjetos = async () => {
    objetos.value = []; // Limpiar datos previos
    try {
        const querySnapshot = await getDocs(collection(db, 'tips_payments'));
        console.log("Documentos obtenidos:", querySnapshot.docs.map(doc => doc.data()));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            objetos.value.push({
                id: doc.id,
                valueMoney: data.valueMoney,
                paymentMethod: data.paymentMethod,
                splitAmount: data.splitAmount,
                peopleAmount: data.peopleAmount
            });
        });
        console.log("Objetos cargados:", objetos.value);
        loading.value = false;  // Solo marcar como false si hay datos
    } catch (error) {
        console.error("Error al obtener los datos:", error);

    } finally {
        loading.value = false; // Marcar como cargado
    }

};

// Llamar a getItems al montar el componente
onMounted(getObjetos);

import { usePaymentMethod } from '../composables/usePaymentMethod';
const { options, selectedMethod } = usePaymentMethod();

const totalAmount = ref(5500);
const montoTotal = ref(1500); // Ejemplo, podrías obtenerlo dinámicamente
const pagosParciales = ref([{ monto: 0, metodo: "efectivo" }]);
const confirmedValueMoney = ref(0); // Almacena el valor confirmado
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
const agregarPagoParcial = () => {
    pagosParciales.value.push({ monto: 0, metodo: "efectivo" });
};



const guardarPago2 = async () => {
    try {
        // 1. Crea el documento del pago principal en la colección "pagos"
        const docRef = await addDoc(collection(db, "pagos"), {
            monto_total: montoTotal.value,
            fecha: new Date(),
        });
        // 2. Añade cada pago parcial a la subcolección "pagos_parciales"
        const pagosParcialesRef = collection(db, `pagos/${docRef.id}/pagos_parciales`);
        for (const pago of pagosParciales.value) {
            await addDoc(pagosParcialesRef, pago);
        }

        // 3. Limpia la pantalla después de guardar
        pagosParciales.value = [{ monto: 0, metodo: "efectivo" }];
        alert("Pago registrado correctamente");
    } catch (error) {
        console.error("Error al guardar el pago:", error);
    }
};

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

        await obtenerPagos(); // Recargar lista sin refrescar la página

        // Reiniciar valores
        confirmedValueMoney.value = 0;
        newTip.paymentMethod = '';
        newTip.peopleAmount = 1;

        alert("Pago registrado correctamente");
    } catch (error) {
        console.error("Error al guardar el pago:", error);
    }
};
watchEffect(() => {
    if (options.value.length) {
        newTip.paymentMethod = options.value[0].value;
    }
});

const pagos = ref([]);

const obtenerPagos = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tips_Payments"));
        const listaPagos = [];

        for (const doc of querySnapshot.docs) {
            const pagoPrincipal = { ...doc.data(), id: doc.id, pagosParciales: [] };

            try {

            } catch (error) {
                console.error(`Error obteniendo pagos parciales para ${doc.id}:`, error);
            }

            listaPagos.push(pagoPrincipal);
        }


        console.log("Pagos obtenidos:", pagos.value);
    } catch (error) {
        console.error("Error obteniendo pagos principales:", error);
    }
};

// Cálculo del monto por persona
const amountPerPerson = computed(() => newTip.peopleAmount > 0 ? (confirmedValueMoney.value / newTip.peopleAmount).toFixed(2) : "0");
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

const addPaymentToFirestore = async (payment: {
    valueMoney: number;
    paymentMethod: string;
    splitAmount: string;
    peopleAmount: number;
}) => {
    try {
        await addDoc(collection(db, "tips_payments"), {
            valueMoney: payment.valueMoney,
            paymentMethod: payment.paymentMethod,
            splitAmount: payment.splitAmount,
            peopleAmount: payment.peopleAmount,
            createdAt: serverTimestamp()
        });
        window.location.reload(); // Recarga para ver los cambios
        console.log("Pago guardado en Firestore");
    } catch (error) {
        console.error("Error al guardar el pago:", error);
    }
};

// Lista de pagos en efectivo
const cashPayments = ref([
    { amount: 500 },
    { amount: 1000 },
    { amount: 1500 }
]);

// Calcular total sumando los pagos en efectivo
const totalCash = computed(() => {
    return totalAmount.value + cashPayments.value.reduce((sum, payment) => sum + payment.amount, 0);
});

const addCashPayment = (amount: number) => {
    cashPayments.value.push({ amount });
};

// Llamar la función cuando se haga un pago
const addPayment = async () => {
    console.log("Intentando agregar pago...");
    if (confirmedValueMoney.value > 0 && newTip.paymentMethod && newTip.peopleAmount) {
        const payment = {
            valueMoney: confirmedValueMoney.value,
            paymentMethod: newTip.paymentMethod,
            splitAmount: Number(amountPerPerson.value),
            peopleAmount: newTip.peopleAmount
        };

        try {
            // First save to Firebase
            await addPaymentToFirestore({
                ...payment,
                splitAmount: String(payment.splitAmount) // Convert splitAmount to string
            });

            // Then update local state
            tip.value.push({
                valueMoney: payment.valueMoney,
                paymentMethod: payment.paymentMethod,
                splitAmount: payment.splitAmount
            });

            // Update total for cash payments
            if (newTip.paymentMethod === "cash") {
                totalAmount.value += confirmedValueMoney.value;
            }

            // Reset values
            confirmedValueMoney.value = 0;
            newTip.paymentMethod = '';
            newTip.peopleAmount = 1;

        } catch (error) {
            console.error("Error al procesar el pago:", error);
            // You might want to show an error message to the user here
        }
    } else {
        console.error("Faltan datos para agregar el pago.");
    }
};



// Función para confirmar el valor ingresado y asignarlo a newTip.valueMoney
const confirmValue = () => {
    if (inputText.value) {
        confirmedValueMoney.value = parseFloat(inputText.value) || 0; // Guardamos el valor final
        inputText.value = ""; // Limpia el input después de confirmar
        isEditing.value = false; // Desactiva la edición automáticamente
    }
};


const handleClick = (value: string) => {
    if (value === '✔') {
        //agregarPagoParcial();
        // Eliminar el último carácter
        confirmValue();
    } else {
        inputText.value += value; // Agregar el número al texto
    }
};
const inputText = ref('');
const deleteText = () => {
    inputText.value = inputText.value.slice(0, -1); // Borra el último dígito
};

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



// Llamar a `getItems` en el hook onMounted, con manejo de errores
onMounted(async () => {
    try {
        // Llamada a la función del composable
        await obtenerPagos(); // Obtener datos de Firebase
    } catch (error) {
        console.error("Error en onMounted:", error);
    }
});

const fetchTotalCashPayments = async () => {
  const cashPaymentsQuery = query(
    collection(db, "tips_payments"),
    where("paymentMethod", "==", "cash")
  );
  const querySnapshot = await getDocs(cashPaymentsQuery);
  const totalCashFire = querySnapshot.docs.reduce((sum, doc) => {
    const data = doc.data() as PaymentTips;
    return sum + data.valueMoney;
  }, 0);
  return totalCashFire;
};

//onMounted(fetchPayments);
// Resto de tus métodos y reactividad no se tocaron, salvo para mantener consistencia.
</script>

<style scoped></style>