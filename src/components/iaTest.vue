<template>
    <v-container>
        <!-- Encabezado -->
        <v-row class="align-center">
            <v-col cols="4">
                <v-btn icon @click="goBack">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <span class="text-h5 font-weight-bold">Pago de Propinas</span>
            </v-col>
            <v-col cols="4" class="text-right">
                <span class="text-h6">Efectivo en Caja</span>
                <v-chip class="ma-2 text-h4 font-weight-bold">
                    ${{ totalAmount }}
                </v-chip>
            </v-col>
        </v-row>

        <!-- Contenido Principal -->
        <v-row>
            <!-- Columna Izquierda: Propina -->
            <v-col cols="4">
                <v-card class="pa-4">
                    <h4>Total de Propinas</h4>
                    <v-text-field v-model="newTip.valueMoney" readonly class="text-h4 red--text"
                        variant="outlined"></v-text-field>

                    <h4>¿Entre cuántos quieres dividir la propina?</h4>
                    <v-text-field v-model="newTip.peopleAmount" type="number" variant="outlined"></v-text-field>
                    <p>${{ amountPerPerson }} - por Persona</p>

                    <h4>Elige el Método de Pago</h4>
                    <v-btn-toggle v-model="newTip.paymentMethod" mandatory>
                        <v-btn v-for="option in options" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </v-btn>
                    </v-btn-toggle>
                </v-card>
            </v-col>

            <!-- Columna Central: Teclado Numérico -->
            <v-col cols="4">
                <v-card class="pa-4">
                    <v-row dense>
                        <v-col v-for="(item, index) in buttonLayout" :key="index" cols="4">
                            <v-btn class="w-16 h-16" @click="handleClick(item)">{{ item }}</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- Columna Derecha: Lista de Pagos -->
            <v-col cols="4">
                <v-card class="pa-4">
                    <h4>Pagos</h4>
                    <v-list>
                        <v-list-item v-for="(payment, index) in tip" :key="index">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ payment.paymentMethod }} - ${{ payment.valueMoney }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-btn icon @click="removePayment(index)">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <!-- Botón de Pago -->
        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn class="text-h5" color="red" @click="addPayment">
                    Pagar ${{ newTip.valueMoney }} en Propinas
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Estado reactivo
const totalAmount = ref(5500);
const tip = ref([]);
const newTip = ref({
    valueMoney: 0,
    paymentMethod: "cash",
    peopleAmount: 1,
});

// Métodos de pago
const options = [
    { value: "cash", label: "Efectivo" },
    { value: "cardBBVA", label: "BBVA 1234" },
    { value: "cardSANTANDER", label: "Santander 1234" },
];

// Teclado numérico
const buttonLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "✔"];

// Cálculo del monto dividido
const amountPerPerson = computed(() => {
    return newTip.valueMoney && newTip.peopleAmount
        ? (newTip.valueMoney / newTip.peopleAmount).toFixed(2)
        : 0;
});

// Métodos
const handleClick = (value) => {
    if (value === "✔") {
        console.log("Confirmar cantidad:", newTip.valueMoney);
    } else {
        newTip.valueMoney = Number(`${newTip.valueMoney}${value}`);
    }
};

const addPayment = () => {
    if (newTip.valueMoney > 0 && newTip.paymentMethod) {
        tip.value.push({
            valueMoney: newTip.valueMoney,
            paymentMethod: newTip.paymentMethod,
        });
        newTip.valueMoney = 0;
        newTip.paymentMethod = "cash";
        newTip.peopleAmount = 1;
    }
};

const removePayment = (index) => {
    tip.value.splice(index, 1);
};

const goBack = () => {
    console.log("Volver a la pantalla anterior");
};
</script>

<style scoped>
.w-16 {
    width: 60px;
    height: 60px;
}
</style>