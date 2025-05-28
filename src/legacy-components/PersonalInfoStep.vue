<template>
  <div class="personal-info-step">
    <!-- 標題 -->
    <div class="step-header">
      <h2 class="step-title">個人基本資訊</h2>
      <p class="step-description">請填入您的基本資訊以開始財務規劃</p>
    </div>

    <!-- 表單 -->
    <div class="form-container">
      <form @submit.prevent class="form-content">
        <!-- 年齡 -->
        <div class="form-row">
          <div class="form-group">
            <label for="age" class="form-label"> 目前年齡 </label>
            <div class="input-with-suffix">
              <input
                id="age"
                v-model.number="localPersonalInfo.age"
                type="number"
                min="18"
                max="70"
                class="form-input"
                placeholder="30"
              />
              <span class="input-suffix">歲</span>
            </div>
          </div>

          <div class="form-group">
            <label for="retirementAge" class="form-label"> 預計退休年齡 </label>
            <div class="input-with-suffix">
              <input
                id="retirementAge"
                v-model.number="localPersonalInfo.retirementAge"
                type="number"
                min="50"
                max="80"
                class="form-input"
                placeholder="65"
              />
              <span class="input-suffix">歲</span>
            </div>
          </div>
        </div>

        <!-- 目前存款 -->
        <div class="form-group">
          <label for="currentSavings" class="form-label"> 目前存款總額 </label>
          <div class="input-with-prefix">
            <span class="input-prefix">NT$</span>
            <input
              id="currentSavings"
              v-model.number="localPersonalInfo.currentSavings"
              type="number"
              min="0"
              step="10000"
              class="form-input with-prefix"
              placeholder="1000000"
            />
          </div>
          <p class="form-hint">
            格式化金額：{{ formatCurrency(localPersonalInfo.currentSavings) }}
          </p>
        </div>

        <!-- 月收入 -->
        <div class="form-group">
          <label for="monthlyIncome" class="form-label"> 每月稅後收入 </label>
          <div class="input-with-prefix">
            <span class="input-prefix">NT$</span>
            <input
              id="monthlyIncome"
              v-model.number="localPersonalInfo.monthlyIncome"
              type="number"
              min="0"
              step="1000"
              class="form-input with-prefix"
              placeholder="80000"
            />
          </div>
          <p class="form-hint">
            年收入約：{{ formatCurrency(localPersonalInfo.monthlyIncome * 12) }}
          </p>
        </div>

        <!-- 薪資成長率 -->
        <div class="form-group">
          <label for="expectedSalaryGrowth" class="form-label"> 預期年薪資成長率 </label>
          <div class="input-with-suffix">
            <input
              id="expectedSalaryGrowth"
              v-model.number="localPersonalInfo.expectedSalaryGrowth"
              type="number"
              min="0"
              max="10"
              step="0.1"
              class="form-input"
              placeholder="3"
            />
            <span class="input-suffix">%</span>
          </div>
          <p class="form-hint">一般建議範圍：2% - 5%（考慮通膨與職涯發展）</p>
        </div>

        <!-- 工作穩定性 -->
        <div class="form-group">
          <label for="jobStability" class="form-label">工作穩定性</label>
          <select id="jobStability" v-model="localPersonalInfo.jobStability" class="form-input">
            <option value="high">穩定（公務員、教師等）</option>
            <option value="medium">一般（上班族）</option>
            <option value="low">不穩定（自由業、創業等）</option>
          </select>
          <p class="form-hint">工作穩定性會影響風險評估和資產配置建議</p>
        </div>

        <!-- 規劃期間資訊 -->
        <div class="info-card info-card--primary">
          <h3 class="info-card__title">規劃期間資訊</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">距離退休：</span>
              <span class="info-value">{{ yearsToRetirement }} 年</span>
            </div>
            <div class="info-item">
              <span class="info-label">規劃重點：</span>
              <span class="info-value">購屋 + 退休準備</span>
            </div>
          </div>
        </div>

        <!-- 重要提醒 -->
        <div class="warning-card">
          <div class="warning-card__content">
            <svg class="warning-icon" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="warning-content">
              <h4 class="warning-title">重要提醒</h4>
              <div class="warning-list">
                <ul>
                  <li>請確實填入稅後收入，以便準確計算</li>
                  <li>存款金額包含定存、活存、投資等可動用資金</li>
                  <li>薪資成長率建議保守估計，避免過度樂觀</li>
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
import type { PersonalInfo } from "../stores/financialPlan";

const store = useFinancialPlanStore();

// 本地狀態，用於雙向綁定
const localPersonalInfo = ref<PersonalInfo>({ ...store.personalInfo });

// 計算屬性
const yearsToRetirement = computed(() => {
  return localPersonalInfo.value.retirementAge - localPersonalInfo.value.age;
});

// 監聽本地狀態變化，同步到 store
watch(
  localPersonalInfo,
  (newInfo) => {
    store.updatePersonalInfo(newInfo);
  },
  { deep: true }
);

// 監聽 store 變化，同步到本地狀態
watch(
  () => store.personalInfo,
  (newInfo) => {
    localPersonalInfo.value = { ...newInfo };
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

<style scoped lang="scss">
.personal-info-step {
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
}

.step-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #6b7280;
  font-size: 1rem;
}

.form-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

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
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: #3b82f6;
  }

  &.with-prefix {
    padding-left: 3rem;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.input-with-prefix {
  position: relative;
}

.input-prefix {
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  z-index: 10;
}

.input-with-suffix {
  position: relative;
}

.input-suffix {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.info-card {
  border-radius: 0.5rem;
  padding: 1.5rem;

  &--primary {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
  }
}

.info-card__title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e3a8a;
  margin-bottom: 0.75rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-size: 0.875rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  gap: 0.25rem;
}

.info-label {
  color: #1d4ed8;
  font-weight: 500;
}

.info-value {
  color: #1e3a8a;
  font-weight: 600;
}

.warning-card {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  padding: 1rem;
}

.warning-card__content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.warning-icon {
  height: 1.25rem;
  width: 1.25rem;
  color: #f59e0b;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
  margin-bottom: 0.25rem;
}

.warning-list {
  font-size: 0.875rem;
  color: #b45309;

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

// 響應式設計
@media (max-width: 768px) {
  .personal-info-step {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .step-title {
    font-size: 1.5rem;
  }
}
</style>
