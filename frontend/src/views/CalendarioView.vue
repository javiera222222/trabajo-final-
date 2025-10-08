<template>
  <div class="calendario-container">

    <div class="header">
      <button @click="prevMonth">◀</button>
      <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="week-days">
      <div class="first-cell"></div>
      <div v-for="day in weekDays" :key="day" class="day-name">{{ day }}</div>
    </div>

    <div v-for="habitacion in habitaciones" :key="habitacion.id" class="habitacion-row">
      <div class="habitacion-name">{{ habitacion.nombre }}</div>

      <div class="dates">
        <div 
          v-for="d in daysInMonth" 
          :key="d" 
          class="date-cell"
          :class="{ 'has-event': hasEvent(habitacion.id, d) }"
        >
          {{ d }}
          <div v-for="e in getEventsForDay(habitacion.id, d)" :key="e.id" class="event">
            {{ e.title }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import dayjs from "dayjs"
import { gethabitaciones } from "../api/habitacion.js"
import { getReservas } from "../api/reserva.js"




const today = dayjs()
const currentMonth = ref(today.month()) // 0-11
const currentYear = ref(today.year())

const habitaciones = ref([])
const events = ref([])

const weekDays = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]
const monthNames = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]
const cargarDatos = async () => {
  habitaciones.value = await gethabitaciones()
  events.value = await getReservas()
}

onMounted(() => {
  cargarDatos()
})

const daysInMonth = computed(() => {
  return dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`).daysInMonth()
})

const getEventsForDay = (habitacionId, day) => {
  const dateStr = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${day}`).format('YYYY-MM-DD')
  return events.value.filter(e => e.habitacion_id === habitacionId && e.date === dateStr)
}

const hasEvent = (habitacionId, day) => getEventsForDay(habitacionId, day).length > 0

const prevMonth = () => {
  const newDate = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`).subtract(1, 'month')
  currentMonth.value = newDate.month()
  currentYear.value = newDate.year()
}

const nextMonth = () => {
  const newDate = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`).add(1, 'month')
  currentMonth.value = newDate.month()
  currentYear.value = newDate.year()
}
</script>

<style scoped>
.calendario-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}
.header button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.week-days {
  display: grid;
  grid-template-columns: 150px repeat(31, 1fr);
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}
.first-cell {
  width: 150px;
}

.habitacion-row {
  display: grid;
  grid-template-columns: 150px repeat(31, 1fr);
  gap: 2px;
  align-items: start;
}
.habitacion-name {
  padding: 5px;
  font-weight: bold;
  background: #eee;
  border-right: 1px solid #ccc;
}
.dates {
  display: contents;
}

.date-cell {
  border: 1px solid #ccc;
  min-height: 50px;
  position: relative;
  padding: 2px;
}
.date-cell.has-event {
  background-color: #4cafef33;
}

.event {
  background: #4cafef;
  color: white;
  font-size: 0.7rem;
  margin-top: 2px;
  padding: 1px 2px;
  border-radius: 4px;
}
</style>
