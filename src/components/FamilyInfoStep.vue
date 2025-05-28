<template>
  <div class="family-info-step">
    <div class="container">
      <h2 class="step-title">家庭基本資訊</h2>
      <p class="step-description">請填寫您的家庭基本資訊</p>

      <!-- 存儲狀態指示器 -->
      <div class="storage-status">
        <span class="status-icon">💾</span>
        <span class="status-text">資料會自動保存到瀏覽器本機儲存</span>
      </div>

      <div class="form-grid">
        <div class="input-group">
          <label for="familyName" class="label">家庭名稱</label>
          <input
            id="familyName"
            v-model="localFamilyInfo.familyName"
            type="text"
            class="input"
            placeholder="例如：張家"
            @input="updateInfo"
          />
        </div>

        <div class="input-group">
          <label for="budgetYear" class="label">預算年度</label>
          <input
            id="budgetYear"
            v-model.number="localFamilyInfo.budgetYear"
            type="number"
            class="input"
            :min="new Date().getFullYear()"
            :max="new Date().getFullYear() + 5"
            @input="updateInfo"
          />
        </div>
      </div>

      <div class="navigation">
        <button @click="store.nextStep()" class="btn btn-primary">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBudgetPlanStore } from "../stores/budgetPlan";
import type { FamilyInfo } from "../stores/budgetPlan";

const store = useBudgetPlanStore();

const localFamilyInfo = ref<FamilyInfo>({
  familyName: "",
  budgetYear: new Date().getFullYear(),
});

function updateInfo() {
  store.updateFamilyInfo(localFamilyInfo.value);
}

onMounted(() => {
  localFamilyInfo.value = { ...store.familyInfo };
});
</script>

<style scoped lang="scss">
.family-info-step {
  padding: 2rem 0;
  min-height: 70vh;
  display: flex;
  align-items: center;

  .container {
    max-width: 600px;
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

  .storage-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding: 0.75rem 1rem;
    background-color: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 0.5rem;
    color: #0369a1;
    font-size: 0.9rem;

    .status-icon {
      font-size: 1rem;
    }

    .status-text {
      font-weight: 500;
    }
  }

  .form-grid {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .input {
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

  .navigation {
    display: flex;
    justify-content: flex-end;
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
