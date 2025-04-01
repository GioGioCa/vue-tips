import { ref } from 'vue';

export function usePaymentMethod() {
    const options = ref([
        { value: "cash", label: "CASH" },
        { value: "cardBBVA", label: "BBVA 1234" },
        { value: "cardSANTANDER", label: "SANTANDER 1234" },
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
