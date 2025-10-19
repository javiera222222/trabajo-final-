
<template>
  <div class="habitacion">
    <p v-if="loading" class="cargando">Cargando habitación...</p>

    <div v-else-if="habitacion" class="habitacion-card">
      <div class="habitacion-layout">
        <div class="habitacion-info">
          <h1 class="titulo-principal">Habitacion {{ habitacion.nombre }}</h1>

          <p class="habitacion-precio">${{ habitacion.precio }}</p>
         
          <div class="habitacion-caracteristicas">
            <div v-if="habitacion.camasSimples > 0" class="icono-texto">
              <img src="../../public/camas.png" alt="Camas simples" class="logo-img"/>
              <span>
                {{ habitacion.camasSimples }}
                cama{{ habitacion.camasSimples > 1 ? 's' : '' }}
                simple{{ habitacion.camasSimples > 1 ? 's' : '' }}
              </span>
            </div>

            <div v-if="habitacion.camasDobles > 0" class="icono-texto">
              <img src="../../public/camas.png" alt="Camas dobles" class="logo-img"/>
              <span>
                {{ habitacion.camasDobles }}
                cama{{ habitacion.camasDobles > 1 ? 's' : '' }}
                doble{{ habitacion.camasDobles > 1 ? 's' : '' }}
              </span>
            </div>

            <div class="icono-texto">
              <img src="../../public/ducha.png" alt="Baño privado" class="logo-img" />
              <span>{{ habitacion.banoPrivado ? "Baño privado" : "Baño compartido" }}</span>
            </div>

            <div v-if="habitacion.cocina" class="icono-texto">
              <img src="../../public/frito.png" alt="Cocina" class="logo-img"/>
              <span>Cocina disponible</span>
            </div>

            <div v-if="habitacion.desayuno" class="icono-texto">
              <img src="../../public/desayuno.png" alt="Desayuno" class="logo-img"/>
              <span>Desayuno incluido</span>
            </div>
          </div>

          <div v-if="alojamiento" class="alojamiento-info">
            <h2>Sobre el alojamiento</h2>
            <p><strong>{{ alojamiento.nombre }}</strong></p>
            <p class="icono-texto">
              <img src="../../public/globo-terraqueo.png" alt="ubicacion Logo" class="logo-img" />
              <span>{{ alojamiento.ubicacion }}</span>
            </p>
            <p class="icono-texto">
              <img src="../../public/mapa.png" alt="direccion Logo" class="logo-img"/>
              <span>{{ alojamiento.direccion }}</span>
            </p>
            <p class="icono-texto">
              <img src="../../public/5-estrellas.png" alt="tipo alojamiento Logo" class="logo-img"/>
              <span>{{ alojamiento.tipoAlojamiento }}</span>
            </p>
          </div>

          <div class="acciones">
            <button v-if="auth.grupos.includes('propietario')" @click="activarEdicion" class="icono-texto">
              <img src="../../public/lapiz-3d.png" alt="editar logo" class="logo-img"/>
              <span>Editar</span>
            </button>
            <button @click="irAReservaNueva" class="reservar-btn">
              Reservar esta habitación
            </button>
          </div>
        </div>

<div class="habitacion-foto">
  <Galleria
    v-if="images.length"
    :value="images"
    :numVisible="3"
    :circular="true"
    :showThumbnails="true"
    :showIndicators="false"
    :showItemNavigators="false"
    containerStyle="max-width: 600px; border-radius: 12px; overflow: hidden;"
  >
    <template #item="slotProps">
      <img
        :src="slotProps.item.itemImageSrc"
        :alt="slotProps.item.alt"
        class="foto-item"
      />
    </template>

    <template #thumbnail="slotProps">
      <img
        :src="slotProps.item.thumbnailImageSrc"
        :alt="slotProps.item.alt"
        class="foto-miniatura"
      />
    </template>
  </Galleria>

  <p v-else class="sin-fotos">Sin fotos disponibles</p>
</div>


      </div>
    </div>

<div v-if="editar" class="habitacion-card editar-card">
  <h2>Editar habitación</h2>
  <div class="editar-form">
    <label>Nombre:
      <input v-model="habitacion.nombre" />
    </label>
    <label>Precio:
      <input v-model.number="habitacion.precio" type="number" />
    </label>
    <label>Camas simples:
      <input v-model.number="habitacion.camasSimples" type="number" />
    </label>
    <label>Camas dobles:
      <input v-model.number="habitacion.camasDobles" type="number" />
    </label>
    <label>Baño privado:
      <input v-model="habitacion.banoPrivado" type="checkbox" />
    </label>
    <label>Cocina:
      <input v-model="habitacion.cocina" type="checkbox" />
    </label>
    <label>Desayuno:
      <input v-model="habitacion.desayuno" type="checkbox" />
    </label>


    <div class="acciones">
      <button @click="editarHabitacion" class="icono-texto">
        <img src="../../public/marcador.png" alt="guardar Logo" class="logo-img"/>
        <span>Guardar</span>
      </button>
      <button @click="eliminarHabitacion" class="eliminar-btn icono-texto">
        <img src="../../public/eliminar.png" alt="eliminar Logo" class="logo-img"/>
        <span>Eliminar</span>
      </button>
    </div>
  </div>
</div>


    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAuthStore } from "../stores/auth";
import { gethabitacion, updatehabitacion, deletehabitacion } from "../api/habitacion.js";
import { useRoute, useRouter } from "vue-router";
import { getAlojamiento } from "../api/alojamiento.js";
import Galleria from 'primevue/galleria';
import{getfoto} from "../api/fotos.js";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const habitacion = ref(null);
const alojamiento = ref(null);
const loading = ref(false);
const error = ref(null);
const editar = ref(false);
const images = ref([]);


const cargarHabitacion = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await gethabitacion(route.params.id);
    habitacion.value = data;
    alojamiento.value = await getAlojamiento(data.alojamiento);
  } catch (e) {
    error.value = "Error al cargar habitación";
  } finally {
    loading.value = false;
  }
};

const cargarFotos = async () => {
  try {
    const foto = await getfoto(route.params.id); 
      images.value = foto.map(foto => ({
      itemImageSrc: foto.imagen,
      thumbnailImageSrc: foto.imagen,
      alt: `Foto ${foto.id}`
    }));
    console.log("Fotos cargadas:", images.value);
  } catch (e) {
    console.error("Error al cargar fotos:", e);
  }
};

onMounted(async () => {
  await cargarHabitacion(); 
  await cargarFotos();      
});

const activarEdicion = async () => {
  editar.value = true;
  await nextTick();
  const formEl = document.querySelector(".editar-form");
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const editarHabitacion = async () => {
  try {
    await updatehabitacion(habitacion.value.id, habitacion.value);
    editar.value = false;
  } catch (e) {
    error.value = "Error al actualizar la habitación";
  }
};

const eliminarHabitacion = async () => {
  if (!confirm("¿Estás segura/o de eliminar esta habitación?")) return;
  try {
    await deletehabitacion(route.params.id);
    router.push("/Habitaciones");
  } catch (e) {
    error.value = "Error al eliminar la habitación";
  }
};

const irAReservaNueva = () => {
  router.push(`/habitacion/${route.params.id}/NuevaReserva`);
};
</script>

<style scoped>
.habitacion {
  min-height: 100vh;
  padding: 40px 20px;
  background: url("/public/inicioCuatro.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.habitacion-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  padding: 30px;
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.habitacion-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.habitacion-info {
  flex: 1 1 50%;
}

.habitacion-foto {
  flex: 1 1 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-left: 40px;
  min-height: 320px;
}

.p-galleria {
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.p-galleria-content {
  width: 100%;
  height: auto;
}

.foto-item {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
  display: block;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.foto-item:hover {
  transform: scale(1.03);
}

.foto-miniatura {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.sin-fotos {
  color: #777;
  font-style: italic;
  text-align: center;
  margin-top: 10px;
}

.habitacion-nombre {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #49274a;
}

.habitacion-precio {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #94618e;
}

.icono-texto {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}

.logo-img {
  width: 20px;
  height: 20px;
}

.acciones {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.reservar-btn {
  background: #94618e;
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.reservar-btn:hover {
  background: #49274a;
}

.eliminar-btn {
  background: #e74c3c;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}

.eliminar-btn:hover {
  background: #c0392b;
}

.editar-card {
  margin-top: 30px;
  max-width: 800px;
  width: 100%;
  align-self: center;
}

.editar-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editar-form label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #49274a;
}

.editar-form input[type="text"],
.editar-form input[type="number"],
.editar-form input[type="checkbox"] {
  margin-top: 4px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.error {
  text-align: center;
  color: red;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .habitacion-layout {
    flex-direction: column;
  }
  .habitacion-info,
  .habitacion-foto {
    flex: 1 1 100%;
    margin-left: 0;
  }
  .acciones {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .foto-item {
    height: 220px;
  }
  .foto-miniatura {
    width: 60px;
    height: 45px;
  }
}

@media (max-width: 500px) {
  .habitacion-nombre {
    font-size: 1.6rem;
  }
  .habitacion-precio {
    font-size: 1.2rem;
  }
  .logo-img {
    width: 18px;
    height: 18px;
  }
  .reservar-btn,
  .eliminar-btn {
    width: 100%;
    padding: 8px 12px;
  }
}
</style>