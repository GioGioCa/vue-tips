<template>
    <v-container>
        <!-- HEADER -->
        <v-row align="center" justify="space-between" class="border-b-lg pb-4" no-gutters>
            <v-col cols="auto">
                <button type="button" class="py-1 px-2 m-1 rounded-sm text-orange bg-transparent text-2xl" @click="">
                    &#10094; Atrás
                </button>
            </v-col>
            <v-col>
                <h2 class="text-black font-times">Pago de Propinas</h2>
            </v-col>
            <v-col cols="auto">
                <v-row>
                    <v-col cols="12" align="center">
                        <h5 class="text-orange">Efectivo en caja</h5>
                    </v-col>
                    <v-col cols="12" align="center">
                        <h1 class="text-orange bg-orange-accent-1 font-bold rounded-lg">
                            ${{ totalAmount.toFixed(2) }}
                        </h1>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- MAIN CONTENT -->
        <v-row>
            <!-- SECCIÓN IZQUIERDA (Ingresar Propinas) -->
            <v-col cols="4">
                <h5 class="text-orange">Total de Propinas</h5>
                <h1>{{ confirmedAmount }}</h1>
                <v-btn color="blue" @click="toggleEdit">
                    {{ isEditing ? "Cancelar" : "Editar" }}
                </v-btn>

                <h5>¿Entre cuántos quieres dividir la propina?</h5>
                <input type="number" v-model="newTip.peopleAmount" min="1" />
                <span>$ {{ amountPerPerson }} por Persona</span>

                <h5>Elige el Método de Pago</h5>
                <v-select v-model="newTip.paymentMethod" :items="paymentMethods" item-title="label" item-value="value"
                    outlined dense></v-select>
            </v-col>

            <!-- SECCIÓN CENTRAL (Teclado Numérico) -->
            <v-col cols="4">
                <v-text-field v-model="inputText" label="Ingresar número" readonly dense outlined
                    :disabled="!isEditing"></v-text-field>
                <v-btn @click="deleteText" color="red" :disabled="!isEditing">Delete</v-btn>

                <v-container>
                    <v-row dense>
                        <v-col v-for="(item, index) in keypad" :key="index" cols="4">
                            <v-btn class="w-16 h-16 bg-green-500 text-black font-bold rounded"
                                @click="handleKeypadInput(item)" :disabled="!isEditing">
                                {{ item }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>

            <!-- SECCIÓN DERECHA (Lista de Pagos) -->
            <v-col cols="4">
                <h2>Pagos</h2>
                <ul>
                    <li v-for="(payment, index) in tipList" :key="index" class="border p-2 rounded my-1">
                        💰 <strong>${{ payment.valueMoney }}</strong> - 🏦 {{ payment.paymentMethod }} (Dividido: ${{
                        payment.splitAmount }})
                    </li>
                </ul>
            </v-col>
        </v-row>

        <!-- BOTÓN DE PAGO -->
        <v-col class="text-center mt-4">
            <h3>Total Pagado</h3>
            <ul>
                <li v-for="(payment, index) in tipList" :key="index">
                    {{ payment.paymentMethod }}: ${{ payment.valueMoney }}
                </li>
            </ul>
            <v-btn @click="addPayment" class="pay-button" color="orange">
                Pagar ${{ confirmedAmount }} en Propinas
            </v-btn>
        </v-col>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

// Estado de edición
const isEditing = ref(false);
const inputText = ref('');
const confirmedAmount = ref(0);

// Lista de métodos de pago
const paymentMethods = [
    { value: "cash", label: "Efectivo" },
    { value: "cardBBVA", label: "BBVA 1234" },
    { value: "cardSANTANDER", label: "Santander 1234" },
];

// Teclado numérico
const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "✔"];

// Estado de nuevo pago
const newTip = reactive({
    valueMoney: 0,
    paymentMethod: paymentMethods[0].value, // Siempre inicia con la primera opción
    peopleAmount: 1,
});

// Lista de pagos
const tipList = ref<{ valueMoney: number; paymentMethod: string; splitAmount: number }[]>([]);

// Total en caja
const totalAmount = ref(5500);

// Cálculo del monto por persona
const amountPerPerson = computed(() => newTip.peopleAmount > 0 ? (confirmedAmount.value / newTip.peopleAmount).toFixed(2) : "0");

// Alternar edición
const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) inputText.value = ''; // Limpia si se cancela
};

// Manejo del teclado numérico
const handleKeypadInput = (value: string) => {
    if (value === "✔") {
        if (inputText.value) {
            confirmedAmount.value = parseFloat(inputText.value) || 0;
            newTip.valueMoney = confirmedAmount.value;
            isEditing.value = false; // Desactiva edición automáticamente
        }
    } else {
        inputText.value += value;
    }
};

// Borrar último dígito
const deleteText = () => inputText.value = inputText.value.slice(0, -1);

// Agregar pago
const addPayment = () => {
    if (newTip.valueMoney > 0 && newTip.paymentMethod && newTip.peopleAmount) {
        tipList.value.push({
            valueMoney: newTip.valueMoney,
            paymentMethod: newTip.paymentMethod,
            splitAmount: parseFloat(amountPerPerson.value),
        });

        totalAmount.value += newTip.paymentMethod === "cash" ? newTip.valueMoney : 0; // Solo efectivo suma al total

        // Reset valores después del pago
        confirmedAmount.value = 0;
        newTip.valueMoney = 0;
        newTip.peopleAmount = 1;
        newTip.paymentMethod = paymentMethods[0].value; // Restablece al primer método de pago
    }
};

// Actualización de totalAmount si el pago es en efectivo
watch(tipList, (newPayments) => {
    const cashTotal = newPayments.filter(p => p.paymentMethod === "cash").reduce((sum, p) => sum + p.valueMoney, 0);
    totalAmount.value = 5500 + cashTotal;
}, { deep: true });
</script>

<style scoped>
.border-b-lg {
    border-bottom: 2px solid #ddd;
}

.text-orange {
    color: #ff5722;
}

.bg-orange-accent-1 {
    background-color: #ffe0b2;
}

.pay-button {
    width: 300px;
    font-size: 18px;
}
</style>