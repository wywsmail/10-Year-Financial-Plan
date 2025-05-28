<template>
  <div class="charts-container">
    <!-- 累積儲蓄趨勢圖 -->
    <div class="chart-card">
      <h3 class="chart-title">
        <svg
          class="chart-icon chart-icon--blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        十年累積儲蓄趨勢
      </h3>
      <div class="chart-container chart-container--large">
        <Line :data="savingsChartData" :options="savingsChartOptions" />
      </div>
    </div>

    <!-- 收支分析圖 -->
    <div class="charts-grid">
      <div class="chart-card">
        <h3 class="chart-title">
          <svg
            class="chart-icon chart-icon--green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          年度收支結構
        </h3>
        <div class="chart-container chart-container--medium">
          <Doughnut :data="incomeExpenseChartData" :options="doughnutChartOptions" />
        </div>
      </div>

      <div class="chart-card">
        <h3 class="chart-title">
          <svg
            class="chart-icon chart-icon--purple"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          財務健康度指標
        </h3>
        <div class="chart-container chart-container--medium">
          <Bar :data="healthIndicatorData" :options="barChartOptions" />
        </div>
      </div>
    </div>

    <!-- 房貸還款進度圖 -->
    <div class="chart-card">
      <h3 class="chart-title">
        <svg
          class="chart-icon chart-icon--red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"
          />
        </svg>
        房貸本息還款分析
      </h3>
      <div class="chart-container chart-container--large">
        <Line :data="loanProgressData" :options="loanProgressOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "vue-chartjs";
import { useFinancialPlanStore } from "../stores/financialPlan";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const store = useFinancialPlanStore();

// 累積儲蓄趨勢圖
const savingsChartData = computed(() => ({
  labels: store.tenYearProjection.map((p) => `第${p.year}年`),
  datasets: [
    {
      label: "累積儲蓄",
      data: store.tenYearProjection.map((p) => p.cumulativeSavings),
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgb(59, 130, 246)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: "緊急備用金",
      data: store.tenYearProjection.map((p) => p.emergencyFund),
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      fill: false,
      tension: 0.4,
      pointBackgroundColor: "rgb(34, 197, 94)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

const savingsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: NT$ ${context.parsed.y.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return "NT$ " + (value / 10000).toFixed(0) + "萬";
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

// 收支結構圖
const incomeExpenseChartData = computed(() => {
  const totalIncome = store.personalInfo.monthlyIncome;
  const totalExpenses = Object.values(store.monthlyExpenses).reduce((sum: number, expense: number) => sum + expense, 0);
  const loanPayment = store.calculationResult.monthlyPayment;
  const savings = Math.max(0, totalIncome - totalExpenses - loanPayment);
  
  const basicLiving = store.monthlyExpenses.food + store.monthlyExpenses.transportation + (store.monthlyExpenses as any).utilities || 0;
  const otherExpenses = store.monthlyExpenses.entertainment + store.monthlyExpenses.healthcare + 
                        store.monthlyExpenses.insurance + store.monthlyExpenses.other;

  return {
    labels: ["基本生活費", "房貸月付", "其他支出", "可儲蓄"],
    datasets: [
      {
        data: [basicLiving, loanPayment, otherExpenses, savings],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(239, 68, 68)",
          "rgb(249, 115, 22)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 2,
      },
    ],
  };
});

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      callbacks: {
        label: function (context: any) {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: NT$ ${context.parsed.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};

// 財務健康度指標
const healthIndicatorData = computed(() => {
  const totalIncome = store.personalInfo.monthlyIncome;
  const totalExpenses = Object.values(store.monthlyExpenses).reduce((sum: number, expense: number) => sum + expense, 0);
  const loanPayment = store.calculationResult.monthlyPayment;
  const savingsRate = ((totalIncome - totalExpenses - loanPayment) / totalIncome) * 100;
  const loanBurdenRate = (loanPayment / totalIncome) * 100;
  // 假設 emergencyFund 是从 YearlyProjection 的第一年中获取的
  const emergencyFund = store.tenYearProjection.length > 0 ? store.tenYearProjection[0].emergencyFund : 0;
  const emergencyFundMonths = emergencyFund / (totalExpenses + loanPayment);

  return {
    labels: ["儲蓄率", "房貸負擔率", "緊急備用金(月)", "理想標準"],
    datasets: [
      {
        label: "當前狀況",
        data: [savingsRate, loanBurdenRate, emergencyFundMonths, 0],
        backgroundColor: [
          savingsRate >= 20
            ? "rgba(34, 197, 94, 0.8)"
            : savingsRate >= 10
            ? "rgba(249, 115, 22, 0.8)"
            : "rgba(239, 68, 68, 0.8)",
          loanBurdenRate <= 30
            ? "rgba(34, 197, 94, 0.8)"
            : loanBurdenRate <= 40
            ? "rgba(249, 115, 22, 0.8)"
            : "rgba(239, 68, 68, 0.8)",
          emergencyFundMonths >= 6
            ? "rgba(34, 197, 94, 0.8)"
            : emergencyFundMonths >= 3
            ? "rgba(249, 115, 22, 0.8)"
            : "rgba(239, 68, 68, 0.8)",
          "rgba(156, 163, 175, 0.3)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(59, 130, 246)",
          "rgba(156, 163, 175, 0.5)",
        ],
        borderWidth: 2,
      },
      {
        label: "建議標準",
        data: [20, 30, 6, 0],
        backgroundColor: "rgba(156, 163, 175, 0.3)",
        borderColor: "rgba(156, 163, 175, 0.5)",
        borderWidth: 1,
      },
    ],
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      callbacks: {
        label: function (context: any) {
          const value = context.parsed.y;
          if (context.dataIndex === 0) return `儲蓄率: ${value.toFixed(1)}%`;
          if (context.dataIndex === 1) return `房貸負擔率: ${value.toFixed(1)}%`;
          if (context.dataIndex === 2) return `緊急備用金: ${value.toFixed(1)}個月`;
          return `${context.dataset.label}: ${value.toFixed(1)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 50,
      ticks: {
        callback: function (value: any) {
          return value + (value <= 10 ? "個月" : "%");
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
};

// 房貸還款進度圖
const loanProgressData = computed(() => {
  const loanAmount = store.propertyInfo.propertyPrice - store.calculationResult.downPayment;
  const monthlyPayment = store.calculationResult.monthlyPayment;
  const interestRate = store.propertyInfo.interestRate / 100 / 12;
  const totalMonths = store.propertyInfo.loanYears * 12;

  const progressData = [];
  let remainingBalance = loanAmount;

  for (let year = 1; year <= 10; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * interestRate;
      const principalPayment = monthlyPayment - interestPayment;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
    }

    progressData.push({
      year,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      remaining: remainingBalance,
    });
  }

  return {
    labels: progressData.map((d) => `第${d.year}年`),
    datasets: [
      {
        label: "本金",
        data: progressData.map((d) => d.principal),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
      {
        label: "利息",
        data: progressData.map((d) => d.interest),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
      },
    ],
  };
});

const loanProgressOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: NT$ ${context.parsed.y.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
      ticks: {
        callback: function (value: any) {
          return "NT$ " + (value / 10000).toFixed(0) + "萬";
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      stacked: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}

.chart-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.chart-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  flex-shrink: 0;

  &--blue {
    color: #3b82f6;
  }

  &--green {
    color: #10b981;
  }

  &--purple {
    color: #8b5cf6;
  }

  &--red {
    color: #ef4444;
  }
}

.chart-container {
  position: relative;

  &--large {
    height: 20rem; // h-80
  }

  &--medium {
    height: 16rem; // h-64
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Mobile responsive adjustments
@media (max-width: 768px) {
  .charts-container {
    gap: 1.5rem;
  }

  .chart-card {
    padding: 1rem;
  }

  .chart-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  .chart-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .chart-container {
    &--large {
      height: 16rem; // Smaller on mobile
    }

    &--medium {
      height: 14rem; // Smaller on mobile
    }
  }
}
</style>
