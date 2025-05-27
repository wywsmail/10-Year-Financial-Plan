import { createRouter, createWebHistory } from "vue-router";
import CalculatorView from "../views/CalculatorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/calculator",
    },
    {
      path: "/calculator",
      name: "calculator",
      component: CalculatorView,
      children: [
        {
          path: "",
          redirect: "/calculator/personal",
        },
        {
          path: "personal",
          name: "personal-info",
          component: () => import("../components/PersonalInfoStep.vue"),
        },
        {
          path: "property",
          name: "property-info",
          component: () => import("../components/PropertyInfoStep.vue"),
        },
        {
          path: "expenses",
          name: "expenses",
          component: () => import("../components/ExpensesStep.vue"),
        },
        {
          path: "results",
          name: "results",
          component: () => import("../components/ResultsStep.vue"),
        },
      ],
    },
  ],
});

export default router;
