<template class="">
    <header class="">
        <v-container class="back-button">
            <v-row align="center" justify="space-between" class="border-b-lg pb-4" no-gutters>
                <v-col cols="auto">
                    <button type="button"
                        class="py-1 px-2 m-1 rounded-sm font-times text-sm text-orange bg-transparent text-2xl"
                        @click="">
                        &#10094; Atrás
                    </button>
                </v-col>
                <v-col>
                    <h2 class="text-black font-times">Pago de propinas</h2>
                </v-col>

                <v-col cols="auto">
                    <v-row>
                        <v-col cols="12" align="center">
                            <h5 class="text-orange">Efectivo en caja</h5>
                        </v-col>
                        <v-col cols="12" align="center">
                            <h1 class="text-orange bg-orange-accent-1 font-bold rounded-lg">
                                {{ totalAmount }}
                            </h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </header>

    <v-container>
        <v-row>
            <v-col cols="4" class="bg-red lighten-2">Columna 1
                <v-row>
                    <v-col cols="12">
                        <h5 class="text-orange">Total propinas</h5>
                    </v-col>
                    <v-col cols="8">
                        <h1 readonly>{{
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
                        <v-select v-model="newTip.paymentMethod" :items="options" item-title="label" item-value="value"
                            label="Método de pago" outlined dense>
                            console.log("Método de pago seleccionado:", newTip.paymentMethod);

                        </v-select>

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
                    <v-row dense>
                        <v-col v-for="(item, index) in buttonLayout" :key="index" cols="4">
                            <v-btn
                                class="w-16 h-16 bg-green-500 text-black font-bold flex justify-center items-center rounded"
                                @click="handleClick(item)" :disabled="!isEditing">
                                {{ item }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>


            <v-col cols="4" class="bg-blue lighten-2">Columna 3
                <h2>Lista de Pagos</h2>

            </v-col>
        </v-row>
    </v-container>


    <v-col>
        <h3>Total Pagado</h3>

        <v-btn @click="guardarPago" class="pay-button" color="orange">
            Pagar
        </v-btn>
    </v-col>

    <v-col cols="12">
        <h2>Método de Pago</h2>
        <v-btn-toggle v-model="newTip.paymentMethod" class="flex flex-wrap gap-2" mandatory>
            <v-btn v-for="option in options" :key="option.value" :value="option.value" class="bg-blue-500 text-black">
                {{ option.label }}
            </v-btn>
        </v-btn-toggle>
    </v-col>


    <v-col cols="4" class="bg-blue lighten-2">Columna 3
        <h2>Lista de Pagos</h2>
        <ul>
            <li v-for="(payment, index) in tip" :key="index" class="border p-2 rounded my-1">
                💰 <strong>${{ payment.valueMoney }}</strong> -
                🏦 {{ payment.paymentMethod }}
                (Dividido: ${{ payment.splitAmount }})
            </li>
        </ul>
    </v-col>

 


    <v-col cols="4" class="bg-blue lighten-2">
        <h2>Lista de Pagos 18-03-25</h2>
<!-- 🔄 Mostrar mensaje si aún está cargando -->
<p v-if="loading">Cargando pagos...</p>

<!-- 🚀 Mostrar lista solo si hay datos -->
<ul v-if="objetos.length > 0">
    <li v-for="payment in objetos" :key="payment.id" class="border p-2 rounded my-1">
        💰 <strong>${{ payment.valueMoney }}</strong> - 
        🏦 {{ payment.paymentMethod }}
        (Dividido: ${{ payment.splitAmount }}, Personas: {{ payment.peopleAmount }})
        <h2>hola</h2>
    </li>
</ul>

<!-- ❌ Mensaje si no hay pagos -->
<p v-else-if="!loading">No hay pagos registrados.</p>
    </v-col>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import "../assets/styles/tailwind.css";
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { usePayments } from "../composables/usePayments";

//usePayments();

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
    try{
        const querySnapshot = await getDocs(collection(db, 'tips_payments'));
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
    } catch (error){
        console.error("Error al obtener los datos:", error);

    } finally {
        loading.value = false; // Marcar como cargado
    }

};

// Llamar a getItems al montar el componente
onMounted(getObjetos);


const options = [
    { value: "cash", label: "CASH" },
    { value: "cardBBVA", label: "BBVA 1234" },
    { value: "cardSANTANDER", label: "SANTANDER 1234" },
];
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
    paymentMethod: options[0].value,
    peopleAmount: 1,
});
const agregarPagoParcial = () => {
    pagosParciales.value.push({ monto: 0, metodo: "efectivo" });
};

const eliminarPagoParcial = (index: number) => {
    pagosParciales.value.splice(index, 1);
};

const guardarPago = async () => {
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
// Define el tipo del array correctamente
// Obtener datos de Firestore

//const { items, getItems } = usePayments();
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
            newTip.paymentMethod = options[0].value;
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
        agregarPagoParcial();
        // Eliminar el último carácter confirmValue();
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



// Resto de tus métodos y reactividad no se tocaron, salvo para mantener consistencia.
</script>

<style scoped></style>