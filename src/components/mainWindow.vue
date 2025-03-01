<template class="bg-black">
    <header class="header">
        <v-container class="back-button">
            <v-row align="center" justify="space-between" no-gutters>
                <v-col cols="auto">
                    <button type="button"
                        class="py-1 px-2 m-1 rounded-sm font-times text-sm bg-blue-500 text-orange hover:bg-blue-600"
                        @click="">
                        Back
                    </button>
                </v-col>
                <v-col>
                    <h2 class="text-cyan font">Pago de propinas</h2>
                </v-col>

                <!-- Contenedor de Total en caja + Monto total -->
                <v-col cols="auto">
                    <v-row>
                        <v-col cols="12">
                            <h5>Total en caja</h5>
                        </v-col>
                        <v-col cols="12">
                            <span class="text-2xl font-bold">{{ parseFloat(totalAmount).toFixed(2) }}</span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </header>

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
const totalAmount = "5580";
//const parsedAmount = parseFloat(totalAmount).toFixed(2);
const tip = ref<
    { valueMoney: number; paymentMethod: string; splitAmount: number }[]
>([]); // Lista de pagos
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
