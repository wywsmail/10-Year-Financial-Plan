<template>
  <div class="income-info-step">
    <div class="container">
      <h2 class="step-title">收入資訊</h2>
      <p class="step-description">請填寫夫妻雙方的收入資訊</p>

      <div class="income-grid">
        <!-- 先生收入 -->
        <div class="income-card">
          <h3 class="card-title">👨 先生收入</h3>

          <div class="input-group">
            <label for="husbandName" class="label">姓名</label>
            <input
              id="husbandName"
              v-model="localIncomeInfo.husband.name"
              type="text"
              class="input"
              placeholder="先生姓名"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="husbandMonthly" class="label">月薪 (NT$)</label>
            <input
              id="husbandMonthly"
              v-model.number="localIncomeInfo.husband.monthlyIncome"
              type="number"
              class="input"
              placeholder="60000"
              min="0"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="husbandBonus" class="label">年終獎金 (NT$)</label>
            <input
              id="husbandBonus"
              v-model.number="localIncomeInfo.husband.bonusAmount"
              type="number"
              class="input"
              placeholder="100000"
              min="0"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="husbandBonusMonth" class="label">獎金發放月份</label>
            <select
              id="husbandBonusMonth"
              v-model.number="localIncomeInfo.husband.bonusMonth"
              class="select"
              @change="updateInfo"
            >
              <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
            </select>
          </div>

          <div class="input-group">
            <label for="husbandSbBonus" class="label">SB獎金 (NT$)</label>
            <input
              id="husbandSbBonus"
              v-model.number="localIncomeInfo.husband.sbBonusAmount"
              type="number"
              class="input"
              placeholder="50000"
              min="0"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="husbandSbBonusMonth" class="label">SB獎金發放月份</label>
            <select
              id="husbandSbBonusMonth"
              v-model.number="localIncomeInfo.husband.sbBonusMonth"
              class="select"
              @change="updateInfo"
            >
              <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
            </select>
          </div>
        </div>

        <!-- 太太收入 -->
        <div class="income-card">
          <h3 class="card-title">👩 太太收入</h3>

          <div class="input-group">
            <label for="wifeName" class="label">姓名</label>
            <input
              id="wifeName"
              v-model="localIncomeInfo.wife.name"
              type="text"
              class="input"
              placeholder="太太姓名"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="wifeMonthly" class="label">月薪 (NT$)</label>
            <input
              id="wifeMonthly"
              v-model.number="localIncomeInfo.wife.monthlyIncome"
              type="number"
              class="input"
              placeholder="50000"
              min="0"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="wifeBonus" class="label">年終獎金 (NT$)</label>
            <input
              id="wifeBonus"
              v-model.number="localIncomeInfo.wife.bonusAmount"
              type="number"
              class="input"
              placeholder="80000"
              min="0"
              @input="updateInfo"
            />
          </div>

          <div class="input-group">
            <label for="wifeBonusMonth" class="label">獎金發放月份</label>
            <select
              id="wifeBonusMonth"
              v-model.number="localIncomeInfo.wife.bonusMonth"
              class="select"
              @change="updateInfo"
            >
              <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 收入摘要 -->
      <div class="income-summary">
        <h3>收入摘要</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">先生年收入：</span>
            <span class="summary-value">NT$ {{ formatNumber(husbandAnnualIncome) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">太太年收入：</span>
            <span class="summary-value">NT$ {{ formatNumber(wifeAnnualIncome) }}</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">家庭總年收入：</span>
            <span class="summary-value">NT$ {{ formatNumber(totalAnnualIncome) }}</span>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button @click="store.prevStep()" class="btn btn-secondary">上一步</button>
        <button @click="store.nextStep()" class="btn btn-primary">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBudgetPlanStore } from "../stores/budgetPlan";
import type { IncomeInfo } from "../stores/budgetPlan";

const store = useBudgetPlanStore();

const localIncomeInfo = ref<IncomeInfo>({
  husband: {
    name: "",
    monthlyIncome: 0,
    bonusAmount: 0,
    bonusMonth: 6,
    sbBonusAmount: 0,
    sbBonusMonth: 3,
  },
  wife: {
    name: "",
    monthlyIncome: 0,
    bonusAmount: 0,
    bonusMonth: 12,
  },
});

const husbandAnnualIncome = computed(() => {
  return (
    localIncomeInfo.value.husband.monthlyIncome * 12 +
    localIncomeInfo.value.husband.bonusAmount +
    localIncomeInfo.value.husband.sbBonusAmount
  );
});

const wifeAnnualIncome = computed(() => {
  return localIncomeInfo.value.wife.monthlyIncome * 12 + localIncomeInfo.value.wife.bonusAmount;
});

const totalAnnualIncome = computed(() => {
  return husbandAnnualIncome.value + wifeAnnualIncome.value;
});

function updateInfo() {
  store.updateIncomeInfo(localIncomeInfo.value);
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

onMounted(() => {
  localIncomeInfo.value = { ...store.incomeInfo };
});
</script>

<style scoped lang="scss">
.income-info-step {
  padding: 2rem 0;
  min-height: 70vh;

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .step-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  .step-description {
    text-align: center;
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .income-grid {
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .income-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #374151;
      text-align: center;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .input,
  .select {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .income-summary {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
      text-align: center;
    }

    .summary-grid {
      display: grid;
      gap: 0.75rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;

      &.total {
        border-top: 2px solid #e2e8f0;
        padding-top: 1rem;
        margin-top: 0.5rem;
        font-weight: 600;
        font-size: 1.1rem;
      }
    }

    .summary-label {
      color: #6b7280;
    }

    .summary-value {
      color: #059669;
      font-weight: 600;
    }
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &.btn-primary {
      background-color: #3b82f6;
      color: white;

      &:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
      }
    }

    &.btn-secondary {
      background-color: #f3f4f6;
      color: #374151;

      &:hover {
        background-color: #e5e7eb;
      }
    }
  }
}
</style>
