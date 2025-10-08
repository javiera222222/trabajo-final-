<template>
  <VAppBar>
    <nav v-if="auth.access" class="menu">
      <ul class="navegacion d-none d-md-flex">
        <li class="logo">
          <router-link to="/bienvenida">
            <img src="../../public/hotel.png" alt="Hotel Logo" class="logo-img" />
          </router-link>
        </li>
        <div class="botones">
          <li v-for="(item, i) in items" :key="i">
            <router-link :to="item.to">{{ item.title }}</router-link>
          </li>
        </div>

        <li class="cerrar-sesion">
          <button @click="logout">Cerrar sesión</button>
        </li>
      </ul>

      <div class="mobile-nav d-flex d-md-none" style="width:100%; align-items:center;">
        <router-link to="/bienvenida" class="logo" style="margin-right:auto;">
          <img src="../../public/hotel.png" alt="Hotel Logo" class="logo-img" />
        </router-link>

        <v-spacer></v-spacer>

        <v-menu location="bottom end" :close-on-content-click="true"   content-class="menu-desplegable">
          <template #activator="{ props }">
            <v-btn icon v-bind="props" aria-label="Abrir menú">
        <img src="../../public/menu.png" alt="menu" class="menu-icon" />
      </v-btn>
          </template>

          <v-list color="#94618e">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="item.to"
              link
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="logout">
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </nav>
  </VAppBar>
</template>


<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()

const logout = () => {
  auth.logout()
}

const items = computed(() => {
  const base = [
    { title: 'Habitaciones', to: '/Habitaciones' },
    { title: 'Reservas', to: '/Reservas' },
  ]
  if (auth.grupos.includes('propietario')) {
    base.unshift({ title: 'Calendario', to: '/Calendario' })
    base.push({ title: 'Registro de pagos', to: '/Pagos' })
  }
  return base
})
</script>

<style>
.menu {
  background-color: #94618e;
  height: 140px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.navegacion {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.logo-img {
  height: 60px;
  width: auto;
  display: block;
}

.menu-icon {
  height: 28px;
  width: auto;
  display: block;
}


.botones {
  display: flex;
  gap: 15px;  
}


.botones li a,
.cerrar-sesion button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  background-color: transparent;
  border: 2px solid #f8eee7;
  color: #f8eee7;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}


.botones li a:hover,
.cerrar-sesion button:hover {
  background-color: #49274a;
  color: #f8eee7;
}

.cerrar-sesion {
  margin-left: auto;
}

.menu-desplegable {
  background-color: #94618e !important;
}

</style>
