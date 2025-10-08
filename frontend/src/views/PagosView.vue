<template>
  <div class="pagos-container">
    <div class="btn-calendario">
      <VBtn color="primary" @click="mostrarCalendario = true">
        📅 {{ formatearFecha(fechaSeleccionada) }}
      </VBtn>
    </div>

    <VDialog v-model="mostrarCalendario" max-width="350">
      <VCard class="card-calendario">
        <VDatePicker
          v-model="fechaSeleccionada"
          locale="es"
          :show-current="true"
          @update:model-value="filtrarPagos"
        />
        <VCardActions class="acciones">
          <VBtn text color="primary" @click="mostrarCalendario = false">
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <v-table class="tabla-pagos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Reserva</th>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Método de Pago</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pago in pagosFiltrados" :key="pago.id">
          <td>{{ pago.id }}</td>
          <td>#{{ pago.reserva }}</td>
          <td>{{ formatearFecha(pago.fecha) }}</td>
          <td class="cantidad">${{ pago.cantidad }}</td>
          <td><span class="badge-metodo">{{ pago.metodoDePago }}</span></td>
        </tr>
        <tr v-if="pagosFiltrados.length === 0">
          <td colspan="5" class="no-pagos">❌ No hay pagos para la fecha seleccionada.</td>
        </tr>
      </tbody>
    </v-table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { VBtn, VDatePicker, VCard } from "vuetify/components"
import { getpagos } from "@/api/pago"

const pagos = ref([])
const pagosFiltrados = ref([])
const fechaSeleccionada = ref(new Date())
const mostrarCalendario = ref(false)
const error = ref(null)
const loading = ref(false)

const formatearFecha = (fecha) => {
  if (!fecha) return ""
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const filtrarPagos = () => {
  pagosFiltrados.value = pagos.value.filter((pago) => {
    const pagoFecha = new Date(pago.fecha)
    const fechaSel = fechaSeleccionada.value

    return (
      pagoFecha.getUTCFullYear() === fechaSel.getFullYear() &&
      pagoFecha.getUTCMonth() === fechaSel.getMonth() &&
      pagoFecha.getUTCDate() === fechaSel.getDate()
    )
  })
}

const cargarPagos = async () => {
  loading.value = true
  error.value = null
  pagos.value = []
  try {
    pagos.value = await getpagos()
    filtrarPagos()
  } catch (e) {
    error.value = "Error al cargar pagos"
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarPagos()
})
</script>

<style scoped>
.pagos-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f8eee7, #f4decb);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 2rem auto;
}

.btn-calendario {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-calendario .v-btn {
  font-weight: bold;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s, background-color 0.2s;
}

.btn-calendario .v-btn:hover {
  transform: translateY(-2px);
  background-color: #94618e !important;
  color: #fff !important;
}

.card-calendario {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transition: transform 0.2s;
}
.card-calendario:hover {
  transform: scale(1.02);
}

.tabla-pagos {
  width: 100%;
  margin: 1rem auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  border-collapse: separate;
  border-spacing: 0;
}

.tabla-pagos th {
  background: #94618e;
  color: #fff;
  padding: 0.75rem;
  text-align: left;
}

.tabla-pagos td {
  padding: 0.75rem;
  border-bottom: 1px solid #f8eee7;
  transition: background 0.2s, transform 0.2s;
}

.tabla-pagos tr:nth-child(even) {
  background-color: #fff7f2;
}

.tabla-pagos tr:hover {
  background-color: #fbe8d6;
  transform: scale(1.01);
}

.cantidad {
  font-weight: bold;
  color: #16a34a;
}

.badge-metodo {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #fde2ff, #f4decb);
  color: #49274a;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-size: 0.85rem;
}

.no-pagos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-style: italic;
  color: #94618e;
  padding: 1rem;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
