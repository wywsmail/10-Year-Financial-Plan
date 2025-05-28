<template>
  <div class="calculator-view">
    <!-- 頂部導航 -->
    <nav class="top-nav">
      <div class="nav-container">
        <div class="nav-content">
          <div class="nav-brand">
            <h1 class="brand-title">十年購屋財務規劃計算器</h1>
            <span class="brand-subtitle">台北市內湖區</span>
          </div>

          <!-- 步驟指示器 -->
          <div class="step-indicators">
            <StepIndicator
              v-for="step in steps"
              :key="step.number"
              :step="step"
              :current="currentStep"
              @click="setStep(step.number)"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要內容區域 -->
    <main class="main-content">
      <div class="content-card">
        <!-- 進度條 -->
        <div class="progress-section">
          <div class="progress-info">
            <span>步驟 {{ currentStep }} / {{ steps.length }}</span>
            <span>{{ Math.round((currentStep / steps.length) * 100) }}% 完成</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(currentStep / steps.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 步驟內容 -->
        <div class="step-content">
          <router-view />
        </div>

        <!-- 導航按鈕 -->
        <div class="nav-buttons">
          <button @click="prevStep" :disabled="currentStep === 1" class="btn btn-secondary nav-btn">
            <svg class="btn-icon-left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            上一步
          </button>

          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            class="btn btn-primary nav-btn"
          >
            下一步
            <svg class="btn-icon-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button v-else @click="resetCalculator" class="btn btn-success nav-btn">
            <svg class="btn-icon-left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            重新開始
          </button>
        </div>
      </div>
    </main>

    <!-- 側邊欄摘要 -->
    <aside class="sidebar-summary">
      <h3 class="summary-title">規劃摘要</h3>

      <div class="summary-content">
        <div class="summary-item">
          <span class="summary-label">房屋價格：</span>
          <span class="summary-value">{{ formatCurrency(propertyInfo.propertyPrice) }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">頭期款：</span>
          <span class="summary-value">{{ formatCurrency(downPayment) }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">貸款金額：</span>
          <span class="summary-value">{{ formatCurrency(loanAmount) }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">月付金：</span>
          <span class="summary-value text-red">{{ formatCurrency(monthlyLoanPayment) }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">月支出總計：</span>
          <span class="summary-value">{{ formatCurrency(totalMonthlyExpenses) }}</span>
        </div>

        <hr class="summary-divider" />

        <div class="summary-item">
          <span class="summary-label">月儲蓄能力：</span>
          <span
            class="summary-value"
            :class="monthlySavingsCapacity >= 0 ? 'text-green' : 'text-red'"
          >
            {{ formatCurrency(monthlySavingsCapacity) }}
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useFinancialPlanStore } from "../stores/financialPlan";
import StepIndicator from "../components/StepIndicator.vue";

const router = useRouter();
const store = useFinancialPlanStore();

const steps = [
  { number: 1, title: "個人資訊", route: "personal-info" },
  { number: 2, title: "房屋資訊", route: "property-info" },
  { number: 3, title: "支出規劃", route: "expenses" },
  { number: 4, title: "規劃結果", route: "results" },
];

const currentStep = computed(() => store.currentStep);
const propertyInfo = computed(() => store.propertyInfo);
const downPayment = computed(() => store.downPayment);
const loanAmount = computed(() => store.loanAmount);
const monthlyLoanPayment = computed(() => store.monthlyLoanPayment);
const totalMonthlyExpenses = computed(() => store.totalMonthlyExpenses);
const monthlySavingsCapacity = computed(() => store.monthlySavingsCapacity);

function nextStep() {
  store.nextStep();
  const nextRoute = steps.find((step) => step.number === store.currentStep);
  if (nextRoute) {
    router.push({ name: nextRoute.route });
  }
}

function prevStep() {
  store.prevStep();
  const prevRoute = steps.find((step) => step.number === store.currentStep);
  if (prevRoute) {
    router.push({ name: prevRoute.route });
  }
}

function setStep(step: number) {
  store.setStep(step);
  const targetRoute = steps.find((s) => s.number === step);
  if (targetRoute) {
    router.push({ name: targetRoute.route });
  }
}

function resetCalculator() {
  store.resetCalculator();
  router.push({ name: "personal-info" });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
</script>

<style lang="scss" scoped>
.calculator-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
}

// 頂部導航樣式
.top-nav {
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
}

.nav-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.brand-subtitle {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.step-indicators {
  display: flex;
  align-items: center;
  gap: 2rem;
}

// 主要內容區域
.main-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
}

.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

// 進度條區域
.progress-section {
  background: #f9fafb;
  padding: 1rem 1.5rem;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  height: 0.5rem;
}

.progress-fill {
  background: #3b82f6;
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s ease-in-out;
}

// 步驟內容
.step-content {
  padding: 1.5rem;

  @media (min-width: 1024px) {
    padding: 2rem;
  }
}

// 導航按鈕區域
.nav-buttons {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #3b82f6;
    }
  }

  &.btn-success {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #10b981;
    }
  }
}

.btn-icon-left {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.btn-icon-right {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

// 側邊欄摘要
.sidebar-summary {
  position: fixed;
  top: 5rem;
  right: 1rem;
  width: 20rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: none;

  @media (min-width: 1280px) {
    display: block;
  }
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.summary-content {
  font-size: 0.875rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.summary-label {
  color: #4b5563;
}

.summary-value {
  font-weight: 500;

  &.text-red {
    color: #ef4444;
  }

  &.text-green {
    color: #10b981;
  }
}

.summary-divider {
  margin: 0.75rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}
</style>
