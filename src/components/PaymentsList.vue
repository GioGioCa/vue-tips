<!-- components/PaymentList.vue -->
<template class="flex justify-center">
    <table class="w-full table-auto text-black">
        <thead>
            <tr>
                <th class="text-left pb-2 text-lg font-bold" colspan="3">
                    Pagos
                </th>
            </tr>
        </thead>
        <tbody class="">
            <tr v-for="payment in payments" :key="payment.id" class=" rounded-0 border-b-lg align-content-md-end justify-end overflow-hidden">
                <td class="text-align: right border rounded-lg">
                    <!----<oh-vue-icon :name="getPaymentIcon(payment.paymentMethod)" class="text-gray-600 w-5 h-5" />-->
                    <v-icon :name="getPaymentIcon(payment.paymentMethod)"  ></v-icon>
                    <v-icon :icon="getPaymentIcon(payment.paymentMethod)"></v-icon>
                    <span class="text-align: end text-center">{{ payment.paymentMethod }}</span>
                    ${{ payment.valueMoney.toFixed(2) }}
                    <button class="text-center hover: ">
                        <oh-vue-icon name="co-delete" class="w-4 h-4" />
                    </button>

                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {IconAliases,IconOptions,IconProps,IconSet} from "vuetify";
import {
    CoCash,
    CoCreditCard,
    PxCreditCard,
    CoDelete,
} from "oh-vue-icons/icons";
import { MdCloseRound } from "oh-vue-icons/icons";
import { usePayments } from '../composables/usePayments';
import { Icon } from "@mui/material";
const { payments, totalCash, fetchPayments } = usePayments();
// Se agregan los iconos mediante este metodo para poder usarlos
addIcons(CoCash, CoCreditCard, PxCreditCard, CoDelete, MdCloseRound);

onMounted(fetchPayments);

// Computed para obtener el ícono correcto
const getPaymentIcon = (method: string) => {
    //return method.toLowerCase() === "cash" ? "co-cash" : "px-credit-card";
    return method.toLowerCase() === "cash" ? "mdi-cash-multiple" : "mdi-credit-card-outline";
};


</script>
