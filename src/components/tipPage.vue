<template>
    <header class="header">
        <div class="back-button">
            <button type="button" class="back-icon" @click="">
                Back
            </button>
            <span>Pago de propinas</span>
        </div>
        <div class="cash-total">
            <span>Total en caja </span>
            <span class="cash-total-amount">${{}}</span>
        </div>
    </header>

    <v-container>
        <v-btn color="primary">¡Hola Vuetify!</v-btn>
    </v-container>

    <v-col>
        <v-row>
            <p>Total propinas</p>
            <textarea v-model="newTip.valueMoney">{{ newTip.valueMoney }}</textarea>
        </v-row>
        <v-row>
            <h3>Entre cuantos quieres dividir la propina?</h3>
            <input type="number" v-model="newTip.peopleAmount" min="1" />
            <span>$ {{ amountPerPerson }} por Persona</span>
        </v-row>
        <v-row>
            <h3>Elige el metodo de pago</h3>
            <select v-model="paymentMethod">
                <option value="" disabled>
                    Seleccione un metodo de pago:
                </option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </v-row>
    </v-col>

    <!-- Teclado Numérico -->
    <v-col class="bg-gray-100 p-6 rounded-lg shadow flex flex-col items-center">
        <div class="grid grid-cols-3 gap-2">
            <button v-for="num in keypad" :key="num" class="bg-white p-4 text-lg shadow rounded-lg">
                {{ num }}
            </button>
        </div>
    </v-col>

    <v-col>
        <h3>Total Pagado</h3>
        //Mostrar lista de pagos efectuados
        <ul>
            <li v-for="(payment, index) in tip" :key="index">
                {{ payment.paymentMethod }}: ${{ payment.valueMoney }}
            </li>
        </ul>
        <button @click="addPayment" class="pay-button">
            Pagar
        </button>
    </v-col>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

// interface Tip{
//     value: number
//    description: string
//}

const paymentMethod = ref("cash");
const options = [
    { value: "cash", label: "CASH" },
    { value: "cardBBVA", label: "BBVA 1234" },
    { value: "cardSANTANDER", label: "SANTANDER 1234" },
];
//const tipTotalAmount = computed(() => Tips.value)
const tip = ref <
    { valueMoney: number; paymentMethod: string; splitAmount: number }[]
    > ([]); // Lista de pagos
const newTip = reactive({
    valueMoney: 0,
    paymentMethod: "",
    peopleAmount: 1,
});

const amountPerPerson = computed(() => {
    return newTip.peopleAmount > 0
        ? Number((newTip.valueMoney / newTip.peopleAmount).toFixed(2))
        : 0;
});
const addPayment = () => {
    if (newTip.valueMoney > 0 && newTip.paymentMethod && newTip.peopleAmount) {
        tip.value.push({
            valueMoney: newTip.valueMoney,
            paymentMethod: newTip.paymentMethod,
            splitAmount: amountPerPerson.value, // Guardamos el monto dividido
        });
        newTip.valueMoney = 0;
        newTip.paymentMethod = "";
        newTip.peopleAmount = 1;
    }
};

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "✔"];
</script>

<style scoped></style>
