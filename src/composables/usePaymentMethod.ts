import { ref } from 'vue';

export function usePaymentMethod() {
    const options = ref([
        { value: "cash", label: "CASH",icon: "mdi-cash" },
        { value: "BBVA", label: "BBVA",icon: "mdi-credit-card-outline"},
        { value: "SANTANDER", label: "SANTANDER",icon: "mdi-credit-card-outline" },
    ]);

    const selectedMethod = ref(options.value[0].value); // Por defecto, el primer método

    const setPaymentMethod = (method: string) => {
        selectedMethod.value = method;
    };

    return {
        options,
        selectedMethod,
        setPaymentMethod,
    };
}
