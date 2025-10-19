<template>
  <div class="reserva">
   
    <p v-if="cargando">Cargando reserva...</p>

    <div v-else-if="reserva" class="reserva-card">
<h1 class="titulo-principal">Tu reserva</h1>
      <div class="resumen">
        <div class="resumen-item">
          <h3>{{ reserva.cantNoches }}</h3>
          <p>Noches</p>
        </div>
        <div class="resumen-item">
          <h3>${{ reserva.precio }}</h3>
          <p>Precio total</p>
        </div>
        
        <div class="resumen-item">
          <span :class="['pago', reserva.pagado ? 'pago-hecho' : 'pago-noHecho']">
            {{ reserva.pagado ? 'Pagado' : 'Pago pendiente' }}
          </span>
          <p>Estado</p>
        </div>
      </div>

      <div class="ingreso">
        <div class="ingreso-item">
          <strong>Check In</strong>
          <p>{{ formatFecha(reserva.checkIn) }}</p>
        </div>
        <div class="ingreso"></div>
        <div class="ingreso-item">
          <strong>Check Out</strong>
          <p>{{ formatFecha(reserva.checkOut) }}</p>
        </div>
      </div>

      <div v-if="!editar" class="detalles">
        <p><strong>Habitación:</strong> {{ reserva.habitacionNombre }}</p>
        <p><strong>ID Reserva:</strong> {{ reserva.id }}</p>
        <p><strong>Desde:</strong> {{ formatFecha(reserva.desde) }}</p>
        <p><strong>Hasta:</strong> {{ formatFecha(reserva.hasta) }}</p>
<p>
  
  <span v-if="auth.grupos.includes('propietario')">
    <strong>Huésped:</strong>
    {{ reserva.nombreHuesped }}
  </span>
  
</p>


        <p><strong>DNI/Pasaporte:</strong> {{ reserva.dniHuesped }}</p>
        <p><strong>Cantidad de huespedes:</strong> {{ reserva.cantHuespedes }}</p>
      </div>

      <div class="acciones" v-if="!editar">
        <button class="btn editar" @click="editar = true"><img src="../../public/lapiz-3d.png" alt="editar logo" class="logo-img"/> Editar</button>
        <button class="btn eliminar" @click="eliminarReserva"><img src="../../public/eliminar.png" alt="eliminar Logo" class="logo-img"/> Eliminar</button>
        <button 
          v-if="auth.grupos.includes('propietario') && !reserva.pagado" 
          class="btn editar" 
          @click="pagar = true">
           Registrar pago
        </button>
      </div>

      <div v-if="editar" class="editar-form">
        <div class="furmularios">
          <label>Cantidad de noches:</label>
          <input v-model="reserva.cantNoches" />
        </div>

        <div class="furmularios">
          <label>Fecha de entrada:</label>
          <input type="date" v-model="reserva.desde" />
        </div>

        <div class="furmularios">
          <label>Fecha de salida:</label>
          <input type="date" v-model="reserva.hasta" />
         
          <div v-if="auth.grupos.includes('propietario')">
          <div class="furmularios">
            
            <label>Check-in</label>
            <input type="datetime-local" v-model="reserva.checkIn" placeholder="..."/>
          </div>

          <div class="furmularios">
            <label>Check-out</label>
            <input type="datetime-local" v-model="reserva.checkOut" placeholder="..." />
          </div>
        </div></div>

        <button class="btn editar" @click="editarReserva">Guardar edición</button>
      </div>

      <div v-if="pagar" class="pago-card">
        <label>Método de pago:
          <input v-model="pago.metodoDePago" />
        </label>
        <button class="btn editar" @click="GuardarPago">Guardar Pago</button>
      </div>

    </div>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getReserva, updateReserva, deleteReserva } from "../api/reserva.js"
import { createpago } from "../api/pago.js"
import { useRoute, useRouter } from 'vue-router'
import { gethabitacion } from "../api/habitacion.js"

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const reserva = ref(null)
const cargando = ref(false)
const error = ref(null)
const editar = ref(false)
const pagar = ref(false)


const pago = ref({
  reserva: route.params.id,
  fecha: new Date().toISOString().slice(0, 19),
  cantidad: 0,
  metodoDePago: "",
})

const formatFecha = (fecha) => {
 if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const cargarReserva = async () => {
  cargando.value = true
  error.value = null
  try {
    reserva.value = await getReserva(route.params.id)

    const habitacion = await gethabitacion(reserva.value.habitacion)
    reserva.value.habitacionNombre = habitacion.nombre


  } catch (e) {
  console.error('Error al actualizar la reserva:', e.response?.data || e.message)
}
 finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarReserva()})


const editarReserva = async () => {
  try {
    await updateReserva(reserva.value.id, reserva.value);

    editar.value = false; 
    await cargarReserva(); 
  } catch (err) {
    console.error("Error al actualizar la reserva:", err);
  }
};

const eliminarReserva = async () => {
  if (confirm('¿Seguro deseas eliminar esta reserva?')) {
    try {
      await deleteReserva(route.params.id)
      router.push('/Reservas')
    } catch (e) {
      error.value = 'Error al eliminar la reserva'
    }
  }
}

const GuardarPago = async () => {
  pago.value.cantidad = reserva.value.precio
  delete pago.value.id
  try {
    await createpago(pago.value)
    reserva.value.pagado = true   
    pagar.value = false
  } catch (err) {
    error.value = 'Error al guardar el pago'
  }
}
</script>

<style scoped>
.reserva {
  min-height: 100vh;
  padding: 30px;
  background: url('/public/inicioCuatro.jpg') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.reserva-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.resumen {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.resumen-item { text-align: center; }

.ingreso {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.ingreso-item { flex: 1; text-align: center; }
.ingreso {
  width: 80px;
  height: 4px;
  background: #94618e;
  margin: 0 10px;
  border-radius: 2px;
}

.pago {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}
.pago-hecho { background: #28a745; color: white; }
.pago-noHecho { background: #dc3545; color: white; }

.acciones { display: flex; gap: 10px; margin: 15px 0; }
.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.btn.editar { background: #94618e; color: white; }
.btn.eliminar { background: #dc3545; color: white; }

.editar-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}
.editar-form .furmularios {
  display: flex;
  flex-direction: column;
}
.editar-form label {
  font-weight: 500;
  margin-bottom: 4px;
}

.pago-card {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  background: #fff5f8;
  border-left: 6px solid #94618e;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
  letter-spacing: 1px;
  background: linear-gradient(90deg, #94618e, #7b4b8e);
  transition: transform 0.3s;
}
</style>
