<template>
  <div class="personal-info-step">
    <div class="step-header">
      <h2>個人基本資訊</h2>
      <p>請填入您的基本資訊以開始財務規劃</p>
    </div>

    <div class="form-container">
      <form @submit.prevent>
        <div class="form-row">
          <div class="form-group">
            <label for="age">目前年齡</label>
            <input
              id="age"
              v-model.number="localPersonalInfo.age"
              type="number"
              min="18"
              max="70"
              placeholder="30"
            />
            <span class="unit">歲</span>
          </div>

          <div class="form-group">
            <label for="retirementAge">預計退休年齡</label>
            <input
              id="retirementAge"
              v-model.number="localPersonalInfo.retirementAge"
              type="number"
              min="50"
              max="80"
              placeholder="65"
            />
            <span class="unit">歲</span>
          </div>
        </div>

        <div class="form-group">
          <label for="currentSavings">目前存款</label>
          <input
            id="currentSavings"
            v-model.number="localPersonalInfo.currentSavings"
            type="number"
            min="0"
            placeholder="500000"
          />
          <span class="unit">元</span>
        </div>

        <div class="form-group">
          <label for="monthlyIncome">月收入</label>
          <input
            id="monthlyIncome"
            v-model.number="localPersonalInfo.monthlyIncome"
            type="number"
            min="0"
            placeholder="80000"
          />
          <span class="unit">元</span>
        </div>

        <div class="form-group">
          <label for="jobStability">工作穩定性</label>
          <select id="jobStability" v-model="localPersonalInfo.jobStability">
            <option value="high">穩定（公務員、教師等）</option>
            <option value="medium">一般（上班族）</option>
            <option value="low">不穩定（自由業、創業等）</option>
          </select>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useFinancialPlanStore } from "../stores/financialPlan";

const store = useFinancialPlanStore();

const localPersonalInfo = ref({
  age: store.personalInfo.age,
  retirementAge: store.personalInfo.retirementAge,
  currentSavings: store.personalInfo.currentSavings,
  monthlyIncome: store.personalInfo.monthlyIncome,
  jobStability: store.personalInfo.jobStability,
});

watch(
  localPersonalInfo,
  (newValue) => {
    store.updatePersonalInfo(newValue);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.personal-info-step {
  padding: 2rem 0;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 1.125rem;
    color: #4b5563;
    margin: 0;
  }
}

.form-container {
  max-width: 48rem;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  position: relative;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  .unit {
    position: absolute;
    right: 0.75rem;
    top: 2.125rem;
    font-size: 0.875rem;
    color: #6b7280;
    pointer-events: none;
  }
}
</style>
