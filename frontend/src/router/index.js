import { createRouter, createWebHistory } from "vue-router";
import { CalendarioRoutes } from "./CalendarioRoutes";
import { HabitacionesRoutes } from "./HabitacionesRoutes";
import { HabitacionRoutes } from "./HabitacionRoutes";
import { NuevaHabitacionRoutes } from "./NuevaHabitacionRoutes";
import { NuevaReservaRoutes } from "./NuevaReservaRoutes";
import { PagosRoutes } from "./PagosRoutes";
import { RegistrarseRoutes } from "./RegistrarseRoutes";
import { ReservaRoutes } from "./ReservaRoutes";
import { BienvenidaRoutes } from "./BienvenidaRoutes";
import { ReservasRoutes } from "./ReservasRoutes";
import { LoginRoutes } from "./LoginRoutes";
import { useAuthStore } from '../stores/auth'

const routes = [

    ...CalendarioRoutes,
    ...HabitacionesRoutes,
    ...HabitacionRoutes,
    ...NuevaHabitacionRoutes,
    ...NuevaReservaRoutes,
    ...PagosRoutes,
    ...RegistrarseRoutes,
    ...ReservaRoutes,
    ...BienvenidaRoutes,
    ...ReservasRoutes,
    ...LoginRoutes,



    {
        path: "/",
        redirect: "/Bienvenida",
    },

    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/PaginaNoEncontrada.vue"),
    },
];

const router = createRouter({
    history: createWebHistory('/'),

    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.access) {
        next('/')
    } else {
        next()
    }
})

export default router;

