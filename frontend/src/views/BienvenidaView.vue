
<template>
  <div class="bienvenida">
 
    <nav class="menu-superior">
      <li v-if="!auth.access"><router-link to="/Login">Iniciar Sesión</router-link></li>
      <li v-if="!auth.access"><router-link to="/Registrarse">Registrarse</router-link></li>
   </nav>
 
    <div class="bienvenida">
    
      <div class="texto">
         <h1 class="titulo-principal">Tu Alojamiento</h1>
        <transition name="fade" mode="out-in">
          <div :key="frases[fraseActual]" class="frase">
            <h1>{{ frases[fraseActual] }}</h1>
          </div>
        </transition>
        <p>
          Encontrá alojamientos que se adapten a tu personalidad.  
          Desde <strong>cabañas</strong>, <strong>hostels</strong> y <strong>hoteles</strong>,  
          hasta lugares unicos en cualquier parte del mundo .
        </p>

        <div class="iconos">
          <div class="icono"><img src="../../public/cabana.png" alt="cabana Logo" class="logo-img" /><p>Cabañas</p></div>
          <div class="icono"><img src="../../public/5-estrellas.png" alt="hotel Logo" class="logo-img" /><p>Hoteles</p></div>
          <div class="icono"><img src="../../public/cama.png" alt="cama Logo" class="logo-img" /><p>Hostels</p></div>
          <div class="icono"><img src="../../public/edificio.png" alt="edificio Logo" class="logo-img" /><p>Aparthotel</p></div>
          </div>
      </div>

      
      <div class="carrusel">
        <transition name="fade-img" mode="out-in">
          <img
            :src="imagenes[imagenActual]"
            :key="imagenes[imagenActual]"
            alt="Alojamiento"
          />
        </transition>

        <div class="indicadores">
          <span
            v-for="(img, index) in imagenes"
            :key="index"
            :class="{ activo: index === imagenActual }"
            @click="imagenActual = index"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useAuthStore } from "../stores/auth"

const auth = useAuthStore()

const frases = [
  "Tu aventura empieza aquí",
  "Un lugar hecho a tu medida",
  "Hospedajes para cada estilo de vida",
  "Descubrí dónde querés estar"
]

const fraseActual = ref(0)
let intervaloFrases

const imagenes = [
  "/inicioCinco.jpg",
  "/inicioOcho.jpg",
  "/inicioNueve.jpg",
  "/inicioDiez.jpg"
]

const imagenActual = ref(0)
let intervaloImagenes

onMounted(() => {
  intervaloFrases = setInterval(() => {
    fraseActual.value = (fraseActual.value + 1) % frases.length
  }, 3000)

  intervaloImagenes = setInterval(() => {
    imagenActual.value = (imagenActual.value + 1) % imagenes.length
  }, 4000)
})

onUnmounted(() => {
  clearInterval(intervaloFrases)
  clearInterval(intervaloImagenes)
})
</script>

<style>
.menu-superior {
  position: absolute;
  top: 30px;
  left: 20px;
  display: flex;
  gap: 15px;
  list-style: none;
  z-index: 10;
  width: 300px;
}

.menu-superior li a {
  text-decoration: none;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s;
  background-color: #49274a;
  color: #f8eee7;
}

.menu-superior li a:hover {
  background-color: #f8eee7;
  color: #94618e;
}

.bienvenida {
  display: flex;
  height: 100vh;
  background: #f4decb;
  overflow: hidden;
}

.texto {
  flex: 1;
  background-color:#f4decb;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;     
  text-align: center; 
}

.texto h1 {
  font-size: 38px;
  color: #49274a;
  margin-bottom: 20px;
}

.texto p {
  font-size: 18px;
  color: #333;
  line-height: 1.6;
}

.iconos {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.icono {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  color: #49274a;
}

.icono span {
  font-size: 36px;
  margin-bottom: 5px;
}

.carrusel {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #94618e;
  overflow: hidden;
}

.carrusel::after {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(73,39,74,0.6), rgba(0,0,0,0));
  pointer-events: none;
}

.carrusel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-left: 8px solid #f4decb;
}

.indicadores {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicadores span {
  width: 12px;
  height: 12px;
  background-color: #f8eee7;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.indicadores span.activo {
  background-color: #49274a;
  transform: scale(1.4);
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-img-enter-active, .fade-img-leave-active {
  transition: opacity 1s;
}
.fade-img-enter-from, .fade-img-leave-to {
  opacity: 0;
}


@media (max-width: 768px) {
  .bienvenida {
    flex-direction: column;
  }

  .carrusel {
    height: 50vh;
  }

  .texto {
    padding: 30px;
    text-align: center;
  }

  .texto h1 {
    font-size: 28px;
  }

  .iconos {
    justify-content: center;
  }
  img{
    height: 30px;
  }
}



</style>
