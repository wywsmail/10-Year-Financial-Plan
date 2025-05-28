<template>
  <div class="expenses-step">
    <!-- 標題 -->
    <div class="step-header">
      <h2 class="step-title">支出規劃設定</h2>
      <p class="step-description">詳細規劃您的每月支出與特殊支出項目</p>
    </div>

    <div class="expenses-container">
      <!-- 每月固定支出 -->
      <section class="expenses-section">
        <h3 class="section-title">每月固定支出</h3>

        <div class="expenses-grid">
          <div
            v-for="(amount, category) in localMonthlyExpenses"
            :key="category"
            class="expense-item"
          >
            <label :for="category" class="expense-label">
              {{ getCategoryName(category) }}
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">NT$</span>
              <input
                :id="category"
                v-model.number="localMonthlyExpenses[category as keyof MonthlyExpenses]"
                type="number"
                min="0"
                step="100"
                class="form-input with-prefix"
              />
            </div>
            <p class="expense-description">{{ getCategoryDescription(category) }}</p>
          </div>
        </div>

        <!-- 每月支出總計 -->
        <div class="total-summary">
          <div class="total-content">
            <span class="total-label">每月支出總計：</span>
            <span class="total-amount">{{ formatCurrency(totalMonthlyExpenses) }}</span>
          </div>
        </div>
      </section>

      <!-- 收支平衡分析 -->
      <section class="balance-section">
        <div class="balance-card">
          <h3 class="balance-title">收支平衡分析</h3>
          <div class="balance-grid">
            <div class="balance-item">
              <div class="balance-amount balance-amount--income">
                {{ formatCurrency(personalInfo.monthlyIncome) }}
              </div>
              <div class="balance-label">月收入</div>
            </div>
            <div class="balance-item">
              <div class="balance-amount balance-amount--expense">
                {{ formatCurrency(totalExpensesWithLoan) }}
              </div>
              <div class="balance-label">月支出總計（含房貸）</div>
            </div>
            <div class="balance-item">
              <div
                class="balance-amount"
                :class="
                  monthlySavingsCapacity >= 0
                    ? 'balance-amount--positive'
                    : 'balance-amount--negative'
                "
              >
                {{ formatCurrency(monthlySavingsCapacity) }}
              </div>
              <div class="balance-label">月儲蓄能力</div>
            </div>
          </div>

          <!-- 儲蓄率提醒 -->
          <div class="savings-alert">
            <div v-if="savingsRate < 10" class="alert alert--error">
              <p>⚠️ 儲蓄率過低（{{ savingsRate.toFixed(1) }}%），建議調整支出結構或增加收入</p>
            </div>
            <div v-else-if="savingsRate < 20" class="alert alert--warning">
              <p>⚠️ 儲蓄率偏低（{{ savingsRate.toFixed(1) }}%），建議提高至 20% 以上</p>
            </div>
            <div v-else class="alert alert--success">
              <p>✅ 儲蓄率良好（{{ savingsRate.toFixed(1) }}%），有助於達成長期財務目標</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 特殊支出規劃 -->
      <section class="special-expenses-section">
        <div class="special-expenses-header">
          <h3 class="section-title">特殊支出規劃</h3>
          <button @click="showAddExpenseModal = true" class="btn btn--primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            新增支出項目
          </button>
        </div>

        <!-- 支出項目列表 -->
        <div v-if="expenseCategories.length > 0" class="expenses-list">
          <div v-for="expense in expenseCategories" :key="expense.id" class="expense-card">
            <div class="expense-card-content">
              <div class="expense-info">
                <h4 class="expense-title">{{ expense.name }}</h4>
                <p class="expense-description">{{ expense.description }}</p>
                <div class="expense-details">
                  <span>金額：{{ formatCurrency(expense.amount) }}</span>
                  <span>週期：{{ getPeriodName(expense.period) }}</span>
                  <span>期間：{{ expense.startYear }}年 - {{ expense.endYear || "持續" }}年</span>
                </div>
              </div>
              <button @click="removeExpenseCategory(expense.id)" class="btn-delete">
                <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 class="empty-title">尚未新增特殊支出</h3>
          <p class="empty-description">點擊上方按鈕新增如結婚、子女教育、旅遊等特殊支出</p>
        </div>
      </section>

      <!-- 支出建議 -->
      <section class="suggestions-section">
        <div class="suggestions-card">
          <h3 class="suggestions-title">支出規劃建議</h3>
          <div class="suggestions-grid">
            <div>
              <h4 class="suggestion-subtitle">理想支出比例：</h4>
              <ul class="suggestion-list">
                <li>• 住房支出：≤ 30%</li>
                <li>• 生活支出：25-35%</li>
                <li>• 儲蓄投資：≥ 20%</li>
                <li>• 保險保障：5-10%</li>
              </ul>
            </div>
            <div>
              <h4 class="suggestion-subtitle">您的支出比例：</h4>
              <ul class="suggestion-list">
                <li>• 住房支出：{{ housingRatio.toFixed(1) }}%</li>
                <li>• 生活支出：{{ livingRatio.toFixed(1) }}%</li>
                <li>• 儲蓄能力：{{ savingsRate.toFixed(1) }}%</li>
                <li>• 保險支出：{{ insuranceRatio.toFixed(1) }}%</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 新增支出項目彈窗 -->
    <div v-if="showAddExpenseModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">新增特殊支出項目</h3>

        <form @submit.prevent="addNewExpense" class="modal-form">
          <div class="form-group">
            <label class="form-label">支出名稱</label>
            <input
              v-model="newExpense.name"
              type="text"
              required
              class="form-input"
              placeholder="例：結婚費用、子女教育金"
            />
          </div>

          <div class="form-group">
            <label class="form-label">金額</label>
            <div class="input-with-prefix">
              <span class="input-prefix">NT$</span>
              <input
                v-model.number="newExpense.amount"
                type="number"
                required
                min="0"
                class="form-input with-prefix"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">支出週期</label>
            <select v-model="newExpense.period" class="form-select">
              <option value="monthly">每月</option>
              <option value="quarterly">每季</option>
              <option value="yearly">每年</option>
              <option value="one-time">一次性</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">開始年份</label>
              <input
                v-model.number="newExpense.startYear"
                type="number"
                required
                :min="new Date().getFullYear()"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">結束年份（選填）</label>
              <input
                v-model.number="newExpense.endYear"
                type="number"
                :min="newExpense.startYear"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">說明（選填）</label>
            <textarea
              v-model="newExpense.description"
              rows="2"
              class="form-textarea"
              placeholder="詳細說明..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="cancelAddExpense" class="btn btn--secondary">取消</button>
            <button type="submit" class="btn btn--primary">新增</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useFinancialPlanStore } from "../stores/financialPlan";
import type { MonthlyExpenses, ExpenseCategory } from "../stores/financialPlan";

const store = useFinancialPlanStore();

// 本地狀態
const localMonthlyExpenses = ref<MonthlyExpenses>({ ...store.monthlyExpenses });
const showAddExpenseModal = ref(false);
const newExpense = ref<Omit<ExpenseCategory, "id">>({
  name: "",
  amount: 0,
  period: "monthly",
  startYear: new Date().getFullYear(),
  endYear: undefined,
  description: "",
});

// 計算屬性
const personalInfo = computed(() => store.personalInfo);
const monthlyLoanPayment = computed(() => store.monthlyLoanPayment);
const expenseCategories = computed(() => store.expenseCategories);
const totalMonthlyExpenses = computed(() => {
  return Object.values(localMonthlyExpenses.value).reduce((sum, expense) => sum + expense, 0);
});
const totalExpensesWithLoan = computed(() => totalMonthlyExpenses.value + monthlyLoanPayment.value);
const monthlySavingsCapacity = computed(
  () => personalInfo.value.monthlyIncome - totalExpensesWithLoan.value
);
const savingsRate = computed(
  () => (monthlySavingsCapacity.value / personalInfo.value.monthlyIncome) * 100
);
const housingRatio = computed(
  () =>
    ((localMonthlyExpenses.value.housing + monthlyLoanPayment.value) /
      personalInfo.value.monthlyIncome) *
    100
);
const livingRatio = computed(() => {
  const livingExpenses =
    totalMonthlyExpenses.value -
    localMonthlyExpenses.value.housing -
    localMonthlyExpenses.value.insurance;
  return (livingExpenses / personalInfo.value.monthlyIncome) * 100;
});
const insuranceRatio = computed(
  () => (localMonthlyExpenses.value.insurance / personalInfo.value.monthlyIncome) * 100
);

// 監聽本地狀態變化，同步到 store
watch(
  localMonthlyExpenses,
  (newExpenses) => {
    store.updateMonthlyExpenses(newExpenses);
  },
  { deep: true }
);

// 監聽 store 變化，同步到本地狀態
watch(
  () => store.monthlyExpenses,
  (newExpenses) => {
    localMonthlyExpenses.value = { ...newExpenses };
  },
  { deep: true }
);

// 方法
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    housing: "房租/住房",
    food: "飲食支出",
    transportation: "交通費用",
    healthcare: "醫療保健",
    education: "教育學習",
    entertainment: "娛樂休閒",
    shopping: "購物消費",
    insurance: "保險費用",
    other: "其他支出",
  };
  return names[category] || category;
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    housing: "租金、管理費、水電費",
    food: "餐費、食材、外食",
    transportation: "交通卡、油費、停車費",
    healthcare: "醫療費、保健食品",
    education: "課程費用、書籍",
    entertainment: "電影、旅遊、娛樂",
    shopping: "服飾、日用品",
    insurance: "醫療險、意外險等",
    other: "雜項支出",
  };
  return descriptions[category] || "";
}

function getPeriodName(period: string): string {
  const names: Record<string, string> = {
    monthly: "每月",
    quarterly: "每季",
    yearly: "每年",
    "one-time": "一次性",
  };
  return names[period] || period;
}

function addNewExpense() {
  store.addExpenseCategory(newExpense.value);
  cancelAddExpense();
}

function cancelAddExpense() {
  showAddExpenseModal.value = false;
  newExpense.value = {
    name: "",
    amount: 0,
    period: "monthly",
    startYear: new Date().getFullYear(),
    endYear: undefined,
    description: "",
  };
}

function removeExpenseCategory(id: string) {
  store.removeExpenseCategory(id);
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

<style scoped lang="scss">
.expenses-step {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.step-header {
  margin-bottom: 2rem;
  text-align: center;
}

.step-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 1.125rem;
  color: #6b7280;
}

.expenses-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// 每月固定支出區塊
.expenses-section {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #3b82f6;
}

.expenses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.expense-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expense-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.expense-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.total-summary {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
}

.total-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.total-label {
  font-weight: 600;
  color: #374151;
  font-size: 1.125rem;
}

.total-amount {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.25rem;
}

// 收支平衡分析
.balance-section {
  margin: 2rem 0;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.balance-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.balance-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  &--income {
    color: #10b981;
  }

  &--expense {
    color: #f59e0b;
  }

  &--positive {
    color: #10b981;
  }

  &--negative {
    color: #ef4444;
  }
}

.balance-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.savings-alert {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &--error {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fef2f2;
  }

  &--warning {
    background: rgba(245, 158, 11, 0.2);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #fffbeb;
  }

  &--success {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #f0fdf4;
  }

  p {
    margin: 0;
  }
}

// 特殊支出規劃
.special-expenses-section {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.special-expenses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expense-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.expense-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.expense-info {
  flex: 1;
}

.expense-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.expense-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.expense-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
  }
}

.delete-icon {
  width: 1rem;
  height: 1rem;
}

// 空狀態
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.empty-description {
  font-size: 0.875rem;
}

// 支出建議
.suggestions-section {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.suggestions-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.suggestions-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
  text-align: center;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.suggestion-subtitle {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.75rem;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.25rem 0;
    color: #374151;
    font-size: 0.875rem;
  }
}

// 彈窗樣式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.form-select {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.form-textarea {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}
</style>
