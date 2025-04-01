<!-- pages/Payments.vue -->
<template>
    <div>
        <h2>Gestión de Pagos</h2>
        <p v-if="loading">Cargando...</p>
        <PaymentList v-else :pagos="objetos" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PaymentList from "../components/PaymentsList.vue"; // Importamos el nuevo componente

const objetos = ref([]);
const loading = ref(true);

const getObjetos = async () => {
    objetos.value = []; // Limpiar antes de cargar
    try {
        const querySnapshot = await getDocs(collection(db, "tips_payments"));
        objetos.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("📌 Pagos obtenidos:", objetos.value);
    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(getObjetos);
</script>