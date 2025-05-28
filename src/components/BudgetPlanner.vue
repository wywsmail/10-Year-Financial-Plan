<script setup lang="ts">
import { useBudgetPlanStore } from "../stores/budgetPlan";
import BudgetStepIndicator from "./BudgetStepIndicator.vue";
import FamilyInfoStep from "./FamilyInfoStep.vue";
import IncomeInfoStep from "./IncomeInfoStep.vue";
import ExpensePlanningStep from "./ExpensePlanningStep.vue";
import BudgetResultsStep from "./BudgetResultsStep.vue";

const store = useBudgetPlanStore();
</script>

<template>
  <div class="budget-planner">
    <header class="hero-section">
      <div class="container">
        <h1 class="hero-title">💰 家庭年度預算規劃表</h1>
        <p class="hero-subtitle">輕鬆管理您的家庭財務，規劃美好未來</p>
        <div class="hero-features">
          <div class="feature">
            <span class="feature-icon">👫</span>
            <span>夫妻雙收入管理</span>
          </div>
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span>月度收支分析</span>
          </div>
          <div class="feature">
            <span class="feature-icon">💡</span>
            <span>智能財務建議</span>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <BudgetStepIndicator />

        <div class="step-content">
          <FamilyInfoStep v-if="store.currentStep === 1" />
          <IncomeInfoStep v-if="store.currentStep === 2" />
          <ExpensePlanningStep v-if="store.currentStep === 3" />
          <BudgetResultsStep v-if="store.currentStep === 4" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.budget-planner {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0 2rem 0;
  text-align: center;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .hero-features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;

    .feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      backdrop-filter: blur(10px);

      .feature-icon {
        font-size: 1.5rem;
      }
    }
  }
}

.main-content {
  background: #f8fafc;
  min-height: 70vh;
  padding: 2rem 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .step-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
</style>
