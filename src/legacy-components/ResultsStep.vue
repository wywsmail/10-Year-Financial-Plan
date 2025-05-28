<template>
  <div class="results-step">
    <!-- 標題 -->
    <div class="step-header">
      <h2 class="step-title">十年財務規劃結果</h2>
      <p class="step-description">基於您的設定，以下是詳細的財務規劃分析</p>
    </div>

    <!-- 關鍵指標概覽 -->
    <section class="key-metrics">
      <div class="metrics-grid">
        <div class="metric-card metric-card--blue">
          <div class="metric-content">
            <svg class="metric-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"
              />
            </svg>
            <div class="metric-details">
              <p class="metric-label">房屋總價</p>
              <p class="metric-value">{{ formatCurrency(propertyInfo.propertyPrice) }}</p>
            </div>
          </div>
        </div>

        <div class="metric-card metric-card--green">
          <div class="metric-content">
            <svg class="metric-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <div class="metric-details">
              <p class="metric-label">頭期款</p>
              <p class="metric-value">{{ formatCurrency(calculationResult.downPayment) }}</p>
            </div>
          </div>
        </div>

        <div class="metric-card metric-card--purple">
          <div class="metric-content">
            <svg class="metric-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <div class="metric-details">
              <p class="metric-label">月付金</p>
              <p class="metric-value">{{ formatCurrency(calculationResult.monthlyPayment) }}</p>
            </div>
          </div>
        </div>

        <div class="metric-card metric-card--orange">
          <div class="metric-content">
            <svg class="metric-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div class="metric-details">
              <p class="metric-label">月儲蓄能力</p>
              <p
                class="metric-value"
                :class="monthlySavingsCapacity >= 0 ? '' : 'metric-value--negative'"
              >
                {{ formatCurrency(monthlySavingsCapacity) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 貸款詳細資訊 -->
    <section class="loan-details">
      <h3 class="section-title">貸款詳細資訊</h3>
      <div class="loan-grid">
        <div class="loan-column">
          <div class="loan-item">
            <span class="loan-label">房屋總價：</span>
            <span class="loan-value">{{ formatCurrency(propertyInfo.propertyPrice) }}</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">頭期款 ({{ propertyInfo.downPaymentRatio }}%)：</span>
            <span class="loan-value">{{ formatCurrency(calculationResult.downPayment) }}</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">貸款金額：</span>
            <span class="loan-value">{{ formatCurrency(loanAmount) }}</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">貸款年限：</span>
            <span class="loan-value">{{ propertyInfo.loanYears }} 年</span>
          </div>
        </div>
        <div class="loan-column">
          <div class="loan-item">
            <span class="loan-label">貸款利率：</span>
            <span class="loan-value">{{ propertyInfo.interestRate }}%</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">月付金：</span>
            <span class="loan-value loan-value--highlight">{{
              formatCurrency(calculationResult.monthlyPayment)
            }}</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">總利息：</span>
            <span class="loan-value">{{ formatCurrency(calculationResult.totalInterest) }}</span>
          </div>
          <div class="loan-item">
            <span class="loan-label">總還款額：</span>
            <span class="loan-value loan-value--bold">{{
              formatCurrency(calculationResult.totalPayment)
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 十年規劃表格 -->
    <section class="planning-section">
      <h3 class="section-title">十年詳細規劃</h3>

      <!-- 表格控制 -->
      <div class="table-controls">
        <div class="view-buttons">
          <button
            @click="activeView = 'table'"
            :class="['view-button', { 'view-button--active': activeView === 'table' }]"
          >
            表格檢視
          </button>
          <button
            @click="activeView = 'chart'"
            :class="['view-button', { 'view-button--active': activeView === 'chart' }]"
          >
            圖表檢視
          </button>
        </div>
        <button @click="exportData" class="export-button">
          <svg class="export-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          匯出資料
        </button>
      </div>

      <!-- 表格檢視 -->
      <div v-if="activeView === 'table'" class="table-container">
        <table class="planning-table">
          <thead class="table-header">
            <tr>
              <th class="table-header-cell">年份</th>
              <th class="table-header-cell">年齡</th>
              <th class="table-header-cell">年收入</th>
              <th class="table-header-cell">生活支出</th>
              <th class="table-header-cell">房貸支出</th>
              <th class="table-header-cell">年儲蓄</th>
              <th class="table-header-cell">累積儲蓄</th>
              <th class="table-header-cell">緊急預備金</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="projection in tenYearProjection" :key="projection.year" class="table-row">
              <td class="table-cell">第 {{ projection.year }} 年</td>
              <td class="table-cell">{{ projection.age }} 歲</td>
              <td class="table-cell">{{ formatCurrency(projection.income) }}</td>
              <td class="table-cell">{{ formatCurrency(projection.expenses) }}</td>
              <td class="table-cell table-cell--loan">
                {{ formatCurrency(projection.loanPayment) }}
              </td>
              <td
                class="table-cell"
                :class="projection.savings >= 0 ? 'table-cell--positive' : 'table-cell--negative'"
              >
                {{ formatCurrency(projection.savings) }}
              </td>
              <td class="table-cell table-cell--bold">
                {{ formatCurrency(projection.cumulativeSavings) }}
              </td>
              <td class="table-cell table-cell--emergency">
                {{ formatCurrency(projection.emergencyFund) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 專業圖表檢視 -->
      <div v-else>
        <FinancialCharts />
      </div>
    </section>

    <!-- 財務健康度評估 -->
    <section class="health-assessment">
      <h3 class="section-title">財務健康度評估</h3>

      <div class="assessment-grid">
        <!-- 評估指標 -->
        <div class="metrics-list">
          <div class="metric-row">
            <span class="metric-row__label">儲蓄率：</span>
            <div class="metric-row__value">
              <span class="metric-row__percentage">{{ savingsRatePercent.toFixed(1) }}%</span>
              <div class="progress-bar">
                <div
                  class="progress-bar__fill"
                  :class="`progress-bar__fill--${getSavingsRateColorClass()}`"
                  :style="{ width: `${Math.min(savingsRatePercent, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="metric-row">
            <span class="metric-row__label">房貸負擔率：</span>
            <div class="metric-row__value">
              <span class="metric-row__percentage">{{ loanBurdenPercent.toFixed(1) }}%</span>
              <div class="progress-bar">
                <div
                  class="progress-bar__fill"
                  :class="`progress-bar__fill--${getLoanBurdenColorClass()}`"
                  :style="{ width: `${Math.min(loanBurdenPercent, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="metric-row">
            <span class="metric-row__label">緊急預備金充足度：</span>
            <div class="metric-row__value">
              <span class="metric-row__percentage">{{ emergencyFundMonths.toFixed(1) }} 個月</span>
              <div class="progress-bar">
                <div
                  class="progress-bar__fill"
                  :class="`progress-bar__fill--${getEmergencyFundColorClass()}`"
                  :style="{ width: `${Math.min((emergencyFundMonths / 6) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 建議 -->
        <div class="suggestions-panel">
          <h4 class="suggestions-panel__title">專業建議</h4>
          <ul class="suggestions-list">
            <li v-for="suggestion in suggestions" :key="suggestion" class="suggestions-list__item">
              <span class="suggestions-list__bullet">•</span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 風險提醒 -->
    <section v-if="risks.length > 0" class="risk-warnings">
      <h3 class="risk-warnings__title">風險提醒</h3>
      <ul class="risk-list">
        <li v-for="risk in risks" :key="risk" class="risk-list__item">
          <svg class="risk-list__icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ risk }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFinancialPlanStore } from "../stores/financialPlan";
import FinancialCharts from "./FinancialCharts.vue";

const store = useFinancialPlanStore();
const activeView = ref<"table" | "chart">("table");

// 計算屬性
const personalInfo = computed(() => store.personalInfo);
const propertyInfo = computed(() => store.propertyInfo);
const calculationResult = computed(() => store.calculationResult);
const tenYearProjection = computed(() => store.tenYearProjection);
const loanAmount = computed(() => store.loanAmount);
const monthlySavingsCapacity = computed(() => store.monthlySavingsCapacity);
const totalMonthlyExpenses = computed(() => store.totalMonthlyExpenses);

// 評估指標
const savingsRatePercent = computed(() => {
  return (monthlySavingsCapacity.value / personalInfo.value.monthlyIncome) * 100;
});

const loanBurdenPercent = computed(() => {
  return (calculationResult.value.monthlyPayment / personalInfo.value.monthlyIncome) * 100;
});

const emergencyFundMonths = computed(() => {
  const monthlyExpenses = totalMonthlyExpenses.value + calculationResult.value.monthlyPayment;
  return calculationResult.value.remainingSavingsAfterDownPayment / monthlyExpenses;
});

// 顏色指標
const savingsRateColor = computed(() => {
  const rate = savingsRatePercent.value;
  if (rate >= 20) return "bg-green-500";
  if (rate >= 10) return "bg-yellow-500";
  return "bg-red-500";
});

const loanBurdenColor = computed(() => {
  const burden = loanBurdenPercent.value;
  if (burden <= 30) return "bg-green-500";
  if (burden <= 40) return "bg-yellow-500";
  return "bg-red-500";
});

const emergencyFundColor = computed(() => {
  const months = emergencyFundMonths.value;
  if (months >= 6) return "bg-green-500";
  if (months >= 3) return "bg-yellow-500";
  return "bg-red-500";
});

// 顏色類別方法
function getSavingsRateColorClass() {
  const rate = savingsRatePercent.value;
  if (rate >= 20) return "green";
  if (rate >= 10) return "yellow";
  return "red";
}

function getLoanBurdenColorClass() {
  const burden = loanBurdenPercent.value;
  if (burden <= 30) return "green";
  if (burden <= 40) return "yellow";
  return "red";
}

function getEmergencyFundColorClass() {
  const months = emergencyFundMonths.value;
  if (months >= 6) return "green";
  if (months >= 3) return "yellow";
  return "red";
}

// 圖表數據
const savingsChartData = computed(() => {
  return tenYearProjection.value.map((item, index) => {
    const x = (index / (tenYearProjection.value.length - 1)) * 750 + 25;
    const maxSavings = Math.max(...tenYearProjection.value.map((p) => p.cumulativeSavings));
    const y = 175 - (item.cumulativeSavings / maxSavings) * 150;
    return { x, y };
  });
});

const savingsChartPoints = computed(() => {
  return savingsChartData.value.map((point) => `${point.x},${point.y}`).join(" ");
});

// 建議和風險
const suggestions = computed(() => {
  const suggestions = [];

  if (savingsRatePercent.value < 20) {
    suggestions.push("建議提高儲蓄率至 20% 以上，可考慮減少非必要支出");
  }

  if (loanBurdenPercent.value > 30) {
    suggestions.push("房貸負擔率偏高，建議考慮降低房價或增加頭期款");
  }

  if (emergencyFundMonths.value < 6) {
    suggestions.push("建議增加緊急預備金至 6 個月生活費");
  }

  suggestions.push("定期檢視並調整投資配置，以達成長期財務目標");
  suggestions.push("考慮通膨因素，適時調整薪資成長預期");

  return suggestions;
});

const risks = computed(() => {
  const risks = [];

  if (monthlySavingsCapacity.value < 0) {
    risks.push("月支出超過收入，存在財務風險，需要立即調整支出結構");
  }

  if (loanBurdenPercent.value > 40) {
    risks.push("房貸負擔過重，可能影響生活品質和其他財務目標");
  }

  if (calculationResult.value.remainingSavingsAfterDownPayment < 0) {
    risks.push("目前存款不足以支付頭期款，需要延後購屋計畫或調整房價預期");
  }

  if (emergencyFundMonths.value < 3) {
    risks.push("緊急預備金不足，面臨突發狀況時可能出現財務困難");
  }

  return risks;
});

// 方法
function exportData() {
  const data = {
    personalInfo: personalInfo.value,
    propertyInfo: propertyInfo.value,
    monthlyExpenses: store.monthlyExpenses,
    calculationResult: calculationResult.value,
    tenYearProjection: tenYearProjection.value,
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `財務規劃_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
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
.results-step {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

// Step Header
.step-header {
  text-align: center;
  margin-bottom: 2rem;

  .step-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;

    @media (min-width: 768px) {
      font-size: 2.25rem;
    }
  }

  .step-description {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
  }
}

// Section Title
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

// Key Metrics Section
.key-metrics {
  margin-bottom: 2rem;

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .metric-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }

    &--blue {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
    }

    &--green {
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      color: white;
      border: none;
    }

    &--purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border: none;
    }

    &--orange {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      border: none;
    }
  }

  .metric-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .metric-icon {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    opacity: 0.9;
  }

  .metric-details {
    flex: 1;
  }

  .metric-label {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    opacity: 0.9;
    font-weight: 500;
  }

  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;

    &--negative {
      color: #ef4444;
    }
  }
}

// Loan Details Section
.loan-details {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .loan-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .loan-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .loan-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }

  .loan-label {
    color: #6b7280;
    font-weight: 500;
    flex: 1;
  }

  .loan-value {
    color: #1f2937;
    font-weight: 600;
    text-align: right;

    &--highlight {
      color: #3b82f6;
      font-size: 1.125rem;
    }

    &--bold {
      font-weight: 700;
      font-size: 1.125rem;
    }
  }
}

// Planning Section
.planning-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .view-buttons {
    display: flex;
    background: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.25rem;
  }

  .view-button {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #374151;
    }

    &--active {
      background: white;
      color: #3b82f6;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }

  .export-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: #2563eb;
    }

    .export-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .table-container {
    overflow-x: auto;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .planning-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
  }

  .table-header {
    background: #f9fafb;

    .table-header-cell {
      padding: 1rem 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;

      @media (min-width: 768px) {
        padding: 1rem 1rem;
      }
    }
  }

  .table-body {
    .table-row {
      &:nth-child(even) {
        background: #f9fafb;
      }

      &:hover {
        background: #f3f4f6;
      }
    }

    .table-cell {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
      white-space: nowrap;

      @media (min-width: 768px) {
        padding: 1rem;
      }

      &--loan {
        color: #dc2626;
        font-weight: 600;
      }

      &--positive {
        color: #059669;
        font-weight: 600;
      }

      &--negative {
        color: #dc2626;
        font-weight: 600;
      }

      &--bold {
        font-weight: 700;
        color: #1f2937;
      }

      &--emergency {
        color: #7c3aed;
        font-weight: 600;
      }
    }
  }
}

// Health Assessment Section
.health-assessment {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .assessment-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .metrics-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__label {
      color: #6b7280;
      font-weight: 500;
    }

    &__value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__percentage {
      font-weight: 600;
      color: #1f2937;
    }
  }

  .progress-bar {
    width: 5rem;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;

    &__fill {
      height: 100%;
      border-radius: 9999px;
      transition: all 0.3s ease;

      &--green {
        background: #10b981;
      }

      &--yellow {
        background: #f59e0b;
      }

      &--red {
        background: #ef4444;
      }
    }
  }

  .suggestions-panel {
    background: #eff6ff;
    border-radius: 0.5rem;
    padding: 1rem;

    &__title {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 0.75rem;
    }
  }

  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__item {
      display: flex;
      align-items: flex-start;
      font-size: 0.875rem;
      color: #1e40af;
    }

    &__bullet {
      color: #3b82f6;
      margin-right: 0.5rem;
      font-weight: 700;
    }
  }
}

// Risk Warnings Section
.risk-warnings {
  background: #fefce8;
  border: 1px solid #fde047;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #a16207;
    margin-bottom: 1rem;
  }

  .risk-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__item {
      display: flex;
      align-items: flex-start;
      color: #a16207;
    }

    &__icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #eab308;
      margin-right: 0.5rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }
  }
}

// Mobile Responsive Adjustments
@media (max-width: 768px) {
  .results-step {
    padding: 1rem;
  }

  .metric-card {
    padding: 1rem;

    .metric-content {
      gap: 0.75rem;
    }

    .metric-icon {
      width: 2rem;
      height: 2rem;
    }

    .metric-value {
      font-size: 1.125rem;
    }
  }

  .loan-details {
    padding: 1rem;

    .loan-grid {
      gap: 1rem;
    }
  }

  .planning-section {
    padding: 1rem;

    .table-controls {
      flex-direction: column;
      align-items: stretch;

      .export-button {
        justify-content: center;
      }
    }
  }

  .health-assessment {
    padding: 1rem;

    .assessment-grid {
      gap: 1rem;
    }

    .metric-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  .risk-warnings {
    padding: 1rem;
  }
}
</style>
