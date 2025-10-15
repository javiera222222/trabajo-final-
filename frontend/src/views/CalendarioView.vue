<template>
  <div class="calendario-container">
    <h1 class="titulo-principal">Calendario de reservas</h1>
    <div class="header">
      <button @click="mesAnterior">◀</button>
      <span>{{ meses[meSeleccionado] }} {{ anioSeleccionado }}</span>
      <button @click="mesSiguiente">▶</button>
    </div>

    
    <div class="dias">
      <div class="arriba"></div>
      <div v-for="dia in diasMes" :key="dia" class="dia">{{ dia }}</div>
    </div>

   
    <div
      v-for="habitacion in habitaciones"
      :key="habitacion.id"
      class="habitacion-row"
    >
      <div class="habitacion-name">{{ habitacion.nombre }}</div>

      <div class="dias-grid">
        <div v-for="dia in diasMes" :key="dia" class="fechas"></div>

        <div
          v-for="reserva in reservasDeHabitacion(habitacion.id)"
          :key="reserva.id"
          class="reserva-bloque"
          :style="estiloReserva(reserva)"
        >
          <router-link
            :to="`/Reserva/${reserva.id}`"
            class="detalle-btn"
          >
            <span class="reserva-numero">{{ reserva.id }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { gethabitaciones } from "../api/habitacion.js";
import { getReservas } from "../api/reserva.js";

const meSeleccionado = ref(dayjs().mes());
const anioSeleccionado = ref(dayjs().year());
const habitaciones = ref([]);
const reservas = ref([]);
const loading = ref(false);
const error = ref(null);

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const diasMes = computed(() =>
  dayjs(`${anioSeleccionado.value}-${meSeleccionado.value + 1}-01`).diasMes()
);

const cargarHabitaciones = async () => {
  try {
    habitaciones.value = await gethabitaciones();
  } catch (e) {
    console.error("Error cargando habitaciones", e);
  }
};

const cargarReservas = async () => {
  loading.value = true;
  try {
    const data = await getReservas();
    reservas.value = data.map(r => ({
      ...r,
      habitacion: typeof r.habitacion === "number" ? { id: r.habitacion } : r.habitacion
    }));
  } catch (e) {
    error.value = "Error al cargar reservas";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([cargarHabitaciones(), cargarReservas()]);
});

const estiloReserva = (reserva) => {
  const inicioReserva = dayjs(reserva.desde);
  const finReserva = dayjs(reserva.hasta);
  const inicioMes = dayjs(`${anioSeleccionado.value}-${meSeleccionado.value + 1}-01`);
  const finMes = inicioMes.endOf("mes");

  if (finReserva.isBefore(inicioMes, "dia") || inicioReserva.isAfter(finMes, "dia")) {
    return { display: "none" };
  }

  
  const inicio = inicioReserva.isBefore(inicioMes, "dia") ? 1 : inicioReserva.date();
  const fin = finReserva.isAfter(finMes, "dia") ? finMes.date() : finReserva.date();

  const separacion = 0.1; 
  const duracion = Math.max(1, fin - inicio + 1 - separacion);

  return {
    "--inicio": inicio,
    "--duracion": duracion,
    "--total-dias": diasMes.value,
  };
};

const reservasDeHabitacion = (habitacionId) => {
  return reservas.value.filter((r) => {
    const id = typeof r.habitacion === "object" ? r.habitacion.id : r.habitacion;
    return id === habitacionId;
  });
};

const mesAnterior = () => {
  const nuevaFecha = dayjs(`${anioSeleccionado.value}-${meSeleccionado.value + 1}-01`).subtract(1, "mes");
  meSeleccionado.value = nuevaFecha.mes();
  anioSeleccionado.value = nuevaFecha.year();
};

const mesSiguiente = () => {
  const nuevaFecha = dayjs(`${anioSeleccionado.value}-${meSeleccionado.value + 1}-01`).add(1, "mes");
  meSeleccionado.value = nuevaFecha.mes();
  anioSeleccionado.value = nuevaFecha.year();
};
</script>

<style scoped>
.calendario-container {
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}


.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 1.3rem;
  color: #49274a;
  gap: 10px;
}

.header button {
  background-color: #94618e;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: 0.3s;
}
.header button:hover {
  background-color: #49274a;
}


.dias {
  display: grid;
  grid-template-columns: 150px repeat(auto-fit, minmax(35px, 1fr));
  text-align: center;
  font-weight: bold;
  color: #49274a;
  margin-bottom: 5px;
  font-size: 0.9rem;
}


.habitacion-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  border-top: 1px solid #ddd;
  align-items: stretch;
  min-height: 40px;
}


.habitacion-name {
  padding: 8px;
  font-weight: bold;
  background: #f8eee7;
  color: #49274a;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
  position: relative;
}


.fechas {
  border: 1px solid #e0d6e0;
  min-height: 50px;
}

.reserva-bloque {
  position: absolute;
  top: 6px;
  height: 80%;
  background-color: #94618e;
  color: #f9f9f9; 
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  transition: background-color 0.2s ease, transform 0.2s ease;

  
  left: calc((var(--inicio) - 1) * 100% / var(--total-dias));


  width: calc((var(--duracion) * 100% / var(--total-dias)) - 0.6%);

  margin-right: 0.3%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  border: 2px solid #fff; 
}


.reserva-bloque a {
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
}

.reserva-bloque:hover {
  background-color: #b075a8;
  transform: scale(1.04);
}

@media (max-width: 900px) {
  .dias {
    grid-template-columns: 120px repeat(auto-fit, minmax(30px, 1fr));
    font-size: 0.8rem;
  }
  .habitacion-row {
    grid-template-columns: 120px 1fr;
  }
  .habitacion-name {
    font-size: 0.8rem;
    padding: 6px;
  }
  .reserva-numero {
    font-size: 0.75rem;
  }
}
@media (max-width: 600px) {
  .dias {
    grid-template-columns: 100px repeat(auto-fit, minmax(25px, 1fr));
  }
  .habitacion-row {
    grid-template-columns: 100px 1fr;
  }
  .habitacion-name {
    font-size: 0.7rem;
  }
  .reserva-numero {
    font-size: 0.7rem;
  }
}
</style>
