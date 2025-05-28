<template>
  <div class="budget-step-indicator">
    <div class="steps-container">
      <div
        v-for="(step, index) in steps"
        :key="step.number"
        class="step-item"
        :class="getStepClass(step.number)"
        @click="handleStepClick(step.number)"
      >
        <!-- 步驟圓圈 -->
        <div class="step-circle">
          <span v-if="step.number < store.currentStep" class="step-check">✓</span>
          <span v-else class="step-number">{{ step.number }}</span>
        </div>

        <!-- 步驟標題 -->
        <div class="step-content">
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-description">{{ step.description }}</p>
        </div>

        <!-- 連接線 -->
        <div v-if="index < steps.length - 1" class="step-connector"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudgetPlanStore } from "../stores/budgetPlan";

const store = useBudgetPlanStore();

const steps = [
  {
    number: 1,
    title: "家庭基本資訊",
    description: "設定家庭名稱和預算年度",
  },
  {
    number: 2,
    title: "收入資訊",
    description: "填寫夫妻雙方收入詳情",
  },
  {
    number: 3,
    title: "支出規劃",
    description: "規劃各項支出項目",
  },
  {
    number: 4,
    title: "預算結果",
    description: "查看完整預算分析",
  },
];

function getStepClass(stepNumber: number) {
  if (stepNumber < store.currentStep) {
    return "completed";
  } else if (stepNumber === store.currentStep) {
    return "current";
  } else {
    return "pending";
  }
}

function handleStepClick(stepNumber: number) {
  if (stepNumber <= store.currentStep) {
    store.setStep(stepNumber);
  }
}
</script>

<style scoped lang="scss">
.budget-step-indicator {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }

  &.completed {
    .step-circle {
      background: #10b981;
      border-color: #10b981;
      color: white;
    }

    .step-title {
      color: #10b981;
    }

    .step-connector {
      background: #10b981;
    }
  }

  &.current {
    .step-circle {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    }

    .step-title {
      color: #3b82f6;
      font-weight: 600;
    }
  }

  &.pending {
    .step-circle {
      background: #f3f4f6;
      border-color: #d1d5db;
      color: #6b7280;
    }

    .step-title {
      color: #6b7280;
    }

    cursor: not-allowed;
  }

  &:hover:not(.pending) {
    transform: translateY(-2px);
  }
}

.step-circle {
  width: 3rem;
  height: 3rem;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .step-check {
    font-size: 1.2rem;
  }
}

.step-content {
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
    flex: 1;
  }
}

.step-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

.step-description {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}

.step-connector {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  right: 0;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  transform: translateY(-50%);
  z-index: -1;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }
}

// 最後一個步驟不顯示連接線
.step-item:last-child .step-connector {
  display: none;
}
</style>
