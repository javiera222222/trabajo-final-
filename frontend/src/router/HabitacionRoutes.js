export const HabitacionRoutes = [
    {
        path: "/Habitacion/:id",
        component: () => import("../views/HabitacionView.vue"),
        name: "Habitacion",
    },]