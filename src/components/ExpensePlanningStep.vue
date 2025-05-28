<template>
  <div class="expense-planning-step">
    <div class="container">
      <h2 class="step-title">支出規劃</h2>
      <p class="step-description">規劃您的家庭支出項目</p>

      <!-- 新增支出項目 -->
      <div class="add-expense-form">
        <h3>新增支出項目</h3>
        <div class="form-grid">
          <div class="input-group">
            <label for="expenseName" class="label">支出項目名稱</label>
            <input
              id="expenseName"
              v-model="newExpense.name"
              type="text"
              class="input"
              placeholder="例如：房租、伙食費"
            />
          </div>

          <div class="input-group">
            <label for="expenseAmount" class="label">金額 (NT$)</label>
            <input
              id="expenseAmount"
              v-model.number="newExpense.amount"
              type="number"
              class="input"
              placeholder="25000"
              min="0"
            />
          </div>

          <div class="input-group">
            <label for="expenseCategory" class="label">支出類別</label>
            <select id="expenseCategory" v-model="newExpense.category" class="select">
              <option value="husband">{{ store.incomeInfo.husband.name || "先生" }}個人支出</option>
              <option value="wife">{{ store.incomeInfo.wife.name || "太太" }}個人支出</option>
              <option value="shared">共同支出</option>
            </select>
          </div>

          <div class="input-group">
            <label for="expenseFrequency" class="label">支出頻率</label>
            <select id="expenseFrequency" v-model="newExpense.frequency" class="select">
              <option value="monthly">每月</option>
              <option value="quarterly">每季</option>
              <option value="yearly">每年</option>
            </select>
          </div>

          <div v-if="newExpense.frequency !== 'monthly'" class="input-group">
            <label for="expenseMonth" class="label">發生月份</label>
            <select id="expenseMonth" v-model.number="newExpense.month" class="select">
              <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
            </select>
          </div>

          <div class="input-group">
            <label for="expenseDescription" class="label">備註</label>
            <input
              id="expenseDescription"
              v-model="newExpense.description"
              type="text"
              class="input"
              placeholder="支出說明（選填）"
            />
          </div>
        </div>

        <button @click="addExpense" class="btn btn-primary add-btn">➕ 新增支出項目</button>
      </div>

      <!-- 支出項目列表 -->
      <div class="expenses-list">
        <h3>支出項目列表</h3>

        <div v-if="store.expenseItems.length === 0" class="no-expenses">
          <p>尚無支出項目，請新增您的第一個支出項目</p>
        </div>

        <div v-else class="expense-cards">
          <div
            v-for="expense in store.expenseItems"
            :key="expense.id"
            class="expense-card"
            :class="`category-${expense.category}`"
          >
            <div class="expense-header">
              <h4 class="expense-name">{{ expense.name }}</h4>
              <button @click="removeExpense(expense.id)" class="remove-btn">❌</button>
            </div>

            <div class="expense-details">
              <div class="detail-item">
                <span class="detail-label">金額：</span>
                <span class="detail-value">NT$ {{ formatNumber(expense.amount) }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">類別：</span>
                <span class="detail-value">
                  {{ getCategoryName(expense.category) }}
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">頻率：</span>
                <span class="detail-value">
                  {{ getFrequencyName(expense.frequency) }}
                  <span v-if="expense.month && expense.frequency !== 'monthly'">
                    ({{ expense.month }}月)
                  </span>
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">年度總額：</span>
                <span class="detail-value">NT$ {{ formatNumber(getAnnualAmount(expense)) }}</span>
              </div>

              <div v-if="expense.description" class="detail-item">
                <span class="detail-label">備註：</span>
                <span class="detail-value">{{ expense.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支出摘要 -->
      <div class="expense-summary">
        <h3>支出摘要</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label"
              >{{ store.incomeInfo.husband.name || "先生" }}個人支出：</span
            >
            <span class="summary-value"
              >NT$ {{ formatNumber(store.expensesByCategory.husband) }}</span
            >
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ store.incomeInfo.wife.name || "太太" }}個人支出：</span>
            <span class="summary-value">NT$ {{ formatNumber(store.expensesByCategory.wife) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">共同支出：</span>
            <span class="summary-value"
              >NT$ {{ formatNumber(store.expensesByCategory.shared) }}</span
            >
          </div>
          <div class="summary-item total">
            <span class="summary-label">年度總支出：</span>
            <span class="summary-value">NT$ {{ formatNumber(store.totalAnnualExpenses) }}</span>
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
import { ref } from "vue";
import { useBudgetPlanStore } from "../stores/budgetPlan";
import type { ExpenseItem } from "../stores/budgetPlan";

const store = useBudgetPlanStore();

const newExpense = ref({
  name: "",
  amount: 0,
  category: "shared" as "husband" | "wife" | "shared",
  frequency: "monthly" as "monthly" | "quarterly" | "yearly",
  month: 1,
  description: "",
});

function addExpense() {
  if (!newExpense.value.name || newExpense.value.amount <= 0) {
    alert("請填寫完整的支出資訊");
    return;
  }

  const expenseData: Omit<ExpenseItem, "id"> = {
    name: newExpense.value.name,
    amount: newExpense.value.amount,
    category: newExpense.value.category,
    frequency: newExpense.value.frequency,
    description: newExpense.value.description,
  };

  if (newExpense.value.frequency !== "monthly") {
    expenseData.month = newExpense.value.month;
  }

  store.addExpenseItem(expenseData);

  // 重置表單
  newExpense.value = {
    name: "",
    amount: 0,
    category: "shared",
    frequency: "monthly",
    month: 1,
    description: "",
  };
}

function removeExpense(id: string) {
  if (confirm("確定要刪除這個支出項目嗎？")) {
    store.removeExpenseItem(id);
  }
}

function getCategoryName(category: string): string {
  const names = {
    husband: store.incomeInfo.husband.name || "先生",
    wife: store.incomeInfo.wife.name || "太太",
    shared: "共同支出",
  };
  return names[category as keyof typeof names] || category;
}

function getFrequencyName(frequency: string): string {
  const names = {
    monthly: "每月",
    quarterly: "每季",
    yearly: "每年",
  };
  return names[frequency as keyof typeof names] || frequency;
}

function getAnnualAmount(expense: ExpenseItem): number {
  switch (expense.frequency) {
    case "monthly":
      return expense.amount * 12;
    case "quarterly":
      return expense.amount * 4;
    case "yearly":
      return expense.amount;
    default:
      return expense.amount;
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}
</script>

<style scoped lang="scss">
.expense-planning-step {
  padding: 2rem 0;
  min-height: 70vh;

  .container {
    max-width: 1200px;
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

  .add-expense-form {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #374151;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .add-btn {
      width: 100%;

      @media (min-width: 768px) {
        width: auto;
      }
    }
  }

  .expenses-list {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #374151;
    }

    .no-expenses {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 2px dashed #e5e7eb;
    }

    .expense-cards {
      display: grid;
      gap: 1rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .expense-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    &.category-husband {
      border-left: 4px solid #3b82f6;
    }

    &.category-wife {
      border-left: 4px solid #ec4899;
    }

    &.category-shared {
      border-left: 4px solid #10b981;
    }

    .expense-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .expense-name {
        font-weight: 600;
        color: #374151;
        margin: 0;
      }

      .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;

        &:hover {
          background-color: #fee2e2;
        }
      }
    }

    .expense-details {
      .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;

        .detail-label {
          color: #6b7280;
        }

        .detail-value {
          color: #374151;
          font-weight: 500;
        }
      }
    }
  }

  .expense-summary {
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
      color: #dc2626;
      font-weight: 600;
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
