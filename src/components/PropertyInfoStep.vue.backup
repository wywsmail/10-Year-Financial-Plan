<template>
  <div class="property-info-step">
    <!-- 標題 -->
    <div class="step-header">
      <h2 class="step-title">房屋資訊設定</h2>
      <p class="step-description">設定您理想的房屋條件與貸款方案</p>
    </div>

    <!-- 表單 -->
    <div class="form-container">
      <form @submit.prevent class="form-content">
        <!-- 房屋價格 -->
        <div class="form-group">
          <label for="propertyPrice" class="form-label"> 房屋總價 </label>
          <div class="input-with-prefix">
            <span class="input-prefix">NT$</span>
            <input
              id="propertyPrice"
              v-model.number="localPropertyInfo.propertyPrice"
              type="number"
              min="1000000"
              step="100000"
              class="form-input with-prefix"
              placeholder="30000000"
            />
          </div>
          <p class="form-hint">格式化金額：{{ formatCurrency(localPropertyInfo.propertyPrice) }}</p>
        </div>

        <!-- 地點 -->
        <div class="form-group">
          <label for="location" class="form-label"> 房屋地點 </label>
          <select id="location" v-model="localPropertyInfo.location" class="form-select">
            <option value="台北市內湖區">台北市內湖區</option>
            <option value="台北市信義區">台北市信義區</option>
            <option value="台北市松山區">台北市松山區</option>
            <option value="台北市中山區">台北市中山區</option>
            <option value="台北市大安區">台北市大安區</option>
            <option value="新北市板橋區">新北市板橋區</option>
            <option value="新北市新店區">新北市新店區</option>
            <option value="新北市中和區">新北市中和區</option>
          </select>
        </div>

        <!-- 頭期款比例 -->
        <div class="form-group">
          <label for="downPaymentRatio" class="form-label"> 頭期款比例 </label>
          <div class="input-with-suffix">
            <input
              id="downPaymentRatio"
              v-model.number="localPropertyInfo.downPaymentRatio"
              type="number"
              min="10"
              max="50"
              step="5"
              class="form-input"
              placeholder="20"
            />
            <span class="input-suffix">%</span>
          </div>
          <p class="form-hint">頭期款金額：{{ formatCurrency(downPayment) }}</p>
        </div>

        <!-- 貸款年限 -->
        <div class="form-group">
          <label for="loanYears" class="form-label"> 貸款年限 </label>
          <select id="loanYears" v-model.number="localPropertyInfo.loanYears" class="form-select">
            <option :value="20">20 年</option>
            <option :value="25">25 年</option>
            <option :value="30">30 年</option>
            <option :value="35">35 年</option>
            <option :value="40">40 年</option>
          </select>
        </div>

        <!-- 貸款利率 -->
        <div class="form-group">
          <label for="interestRate" class="form-label"> 貸款年利率 </label>
          <div class="input-with-suffix">
            <input
              id="interestRate"
              v-model.number="localPropertyInfo.interestRate"
              type="number"
              min="1"
              max="10"
              step="0.01"
              class="form-input"
              placeholder="2.1"
            />
            <span class="input-suffix">%</span>
          </div>
          <p class="form-hint">目前一般房貸利率約 1.8% - 2.5%</p>
        </div>

        <!-- 貸款試算結果 -->
        <div class="result-card result-card--primary">
          <h3 class="result-card__title">貸款試算結果</h3>
          <div class="result-grid">
            <div class="result-column">
              <div class="result-item">
                <span class="result-label">房屋總價：</span>
                <span class="result-value">{{
                  formatCurrency(localPropertyInfo.propertyPrice)
                }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">頭期款：</span>
                <span class="result-value">{{ formatCurrency(downPayment) }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">貸款金額：</span>
                <span class="result-value">{{ formatCurrency(loanAmount) }}</span>
              </div>
            </div>
            <div class="result-column">
              <div class="result-item">
                <span class="result-label">月付金：</span>
                <span class="result-value result-value--highlight">{{
                  formatCurrency(monthlyLoanPayment)
                }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">總利息：</span>
                <span class="result-value">{{ formatCurrency(totalInterest) }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">總還款額：</span>
                <span class="result-value">{{ formatCurrency(totalPayment) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 頭期款評估 -->
        <div class="evaluation-card">
          <h3 class="evaluation-card__title">頭期款評估</h3>
          <div class="evaluation-content">
            <div class="evaluation-item">
              <span class="evaluation-label">目前存款：</span>
              <span class="evaluation-value">{{
                formatCurrency(personalInfo.currentSavings)
              }}</span>
            </div>
            <div class="evaluation-item">
              <span class="evaluation-label">所需頭期款：</span>
              <span class="evaluation-value">{{ formatCurrency(downPayment) }}</span>
            </div>
            <hr class="evaluation-divider" />
            <div class="evaluation-item">
              <span class="evaluation-label">剩餘存款：</span>
              <span
                class="evaluation-value evaluation-value--large"
                :class="
                  remainingSavings >= 0
                    ? 'evaluation-value--positive'
                    : 'evaluation-value--negative'
                "
              >
                {{ formatCurrency(remainingSavings) }}
              </span>
            </div>

            <!-- 評估提醒 -->
            <div class="evaluation-alert">
              <div v-if="remainingSavings < 0" class="alert alert--error">
                <p>
                  ⚠️ 目前存款不足以支付頭期款，缺少 {{ formatCurrency(Math.abs(remainingSavings)) }}
                </p>
              </div>
              <div v-else-if="remainingSavings < 500000" class="alert alert--warning">
                <p>⚠️ 支付頭期款後剩餘存款較少，建議保留緊急預備金</p>
              </div>
              <div v-else class="alert alert--success">
                <p>✅ 頭期款充足，支付後仍有合理的緊急預備金</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 重要提醒 -->
        <div class="info-card info-card--blue">
          <div class="info-card__content">
            <svg class="info-icon" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="info-content">
              <h4 class="info-title">購屋重點提醒</h4>
              <div class="info-list">
                <ul>
                  <li>頭期款建議至少 20%，以獲得較佳貸款條件</li>
                  <li>月付金不應超過月收入的 1/3</li>
                  <li>保留 3-6 個月生活費作為緊急預備金</li>
                  <li>考慮裝潢、傢具、仲介費等額外支出</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useFinancialPlanStore } from "../stores/financialPlan";
import type { PropertyInfo } from "../stores/financialPlan";

const store = useFinancialPlanStore();

// 本地狀態
const localPropertyInfo = ref<PropertyInfo>({ ...store.propertyInfo });

// 計算屬性
const personalInfo = computed(() => store.personalInfo);
const downPayment = computed(
  () => localPropertyInfo.value.propertyPrice * (localPropertyInfo.value.downPaymentRatio / 100)
);
const loanAmount = computed(() => localPropertyInfo.value.propertyPrice - downPayment.value);
const remainingSavings = computed(() => personalInfo.value.currentSavings - downPayment.value);

const monthlyLoanPayment = computed(() => {
  const principal = loanAmount.value;
  const monthlyRate = localPropertyInfo.value.interestRate / 100 / 12;
  const numberOfPayments = localPropertyInfo.value.loanYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
});

const totalInterest = computed(() => {
  return monthlyLoanPayment.value * localPropertyInfo.value.loanYears * 12 - loanAmount.value;
});

const totalPayment = computed(() => {
  return localPropertyInfo.value.propertyPrice + totalInterest.value;
});

// 監聽本地狀態變化，同步到 store
watch(
  localPropertyInfo,
  (newInfo) => {
    store.updatePropertyInfo(newInfo);
  },
  { deep: true }
);

// 監聽 store 變化，同步到本地狀態
watch(
  () => store.propertyInfo,
  (newInfo) => {
    localPropertyInfo.value = { ...newInfo };
  },
  { deep: true }
);

// 格式化貨幣
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
.property-info-step {
  .step-header {
    text-align: center;
    margin-bottom: 2rem;

    .step-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .step-description {
      font-size: 1.125rem;
      color: #6b7280;
    }
  }

  .form-container {
    max-width: 42rem;
    margin: 0 auto;

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  // 表單樣式
  .form-group {
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input {
      display: block;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      font-size: 0.875rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &.with-prefix {
        padding-left: 3rem;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .form-select {
      display: block;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      font-size: 0.875rem;
      background-color: white;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1rem;
      padding-right: 2.5rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }

    .input-with-prefix {
      position: relative;

      .input-prefix {
        position: absolute;
        left: 0.75rem;
        top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        pointer-events: none;
      }
    }

    .input-with-suffix {
      position: relative;

      .input-suffix {
        position: absolute;
        right: 0.75rem;
        top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        pointer-events: none;
      }
    }

    .form-hint {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  }

  // 結果卡片
  .result-card {
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 1rem;

    &--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }

    &__title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .result-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .result-column {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .result-label {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.875rem;
      }

      .result-value {
        font-weight: 600;
        color: white;

        &--highlight {
          font-weight: 700;
          font-size: 1.125rem;
          color: #fbbf24;
        }
      }
    }
  }

  // 評估卡片
  .evaluation-card {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 1rem;

    &__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .evaluation-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .evaluation-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .evaluation-label {
        color: #374151;
        font-size: 0.875rem;
      }

      .evaluation-value {
        font-weight: 600;
        color: #1f2937;

        &--large {
          font-weight: 700;
          font-size: 1.125rem;
        }

        &--positive {
          color: #059669;
        }

        &--negative {
          color: #dc2626;
        }
      }
    }

    .evaluation-divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 0.5rem 0;
    }

    .evaluation-alert {
      margin-top: 1rem;

      .alert {
        padding: 0.75rem;
        border-radius: 0.375rem;
        border: 1px solid;

        &--error {
          background-color: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        &--warning {
          background-color: #fffbeb;
          border-color: #fed7aa;
          color: #d97706;
        }

        &--success {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
          color: #16a34a;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
        }
      }
    }
  }

  // 資訊卡片
  .info-card {
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px solid;
    margin-top: 1rem;

    &--blue {
      background-color: #eff6ff;
      border-color: #bfdbfe;
    }

    &__content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .info-icon {
      height: 1.25rem;
      width: 1.25rem;
      color: #60a5fa;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .info-content {
      flex: 1;

      .info-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 0.25rem;
      }

      .info-list {
        font-size: 0.875rem;
        color: #1d4ed8;

        ul {
          list-style-type: disc;
          list-style-position: inside;
          margin: 0;
          padding: 0;

          li {
            margin-bottom: 0.25rem;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }

  // 響應式設計
  @media (max-width: 768px) {
    .step-header {
      margin-bottom: 1.5rem;

      .step-title {
        font-size: 1.5rem;
      }

      .step-description {
        font-size: 1rem;
      }
    }

    .form-container {
      padding: 0 1rem;
    }

    .result-grid {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
