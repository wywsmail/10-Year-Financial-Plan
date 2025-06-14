<template>
  <div class="budget-results-step">
    <div class="container">
      <h2 class="step-title">
        {{ store.familyInfo.familyName }} {{ store.familyInfo.budgetYear }}年度預算表
      </h2>

      <!-- 預算概覽 -->
      <div class="budget-overview">
        <div class="overview-cards">
          <div class="overview-card income">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <h3>年度總收入</h3>
              <p class="amount">NT$ {{ formatNumber(store.budgetSummary.totalAnnualIncome) }}</p>
            </div>
          </div>

          <div class="overview-card expense">
            <div class="card-icon">💸</div>
            <div class="card-content">
              <h3>年度總支出</h3>
              <p class="amount">NT$ {{ formatNumber(store.budgetSummary.totalAnnualExpenses) }}</p>
            </div>
          </div>

          <div class="overview-card balance" :class="balanceClass">
            <div class="card-icon">{{ balanceIcon }}</div>
            <div class="card-content">
              <h3>年度結餘</h3>
              <p class="amount">NT$ {{ formatNumber(store.budgetSummary.netAnnualIncome) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 月度收支表 -->
      <div class="monthly-breakdown">
        <h3>月度收支明細表</h3>
        <div class="table-container">
          <table class="breakdown-table">
            <thead>
              <tr>
                <th>月份</th>
                <th>{{ store.incomeInfo.husband.name }}收入</th>
                <th>{{ store.incomeInfo.wife.name }}收入</th>
                <th>總收入</th>
                <th>{{ store.incomeInfo.husband.name }}支出</th>
                <th>{{ store.incomeInfo.wife.name }}支出</th>
                <th>共同支出</th>
                <th>總支出</th>
                <th>{{ store.incomeInfo.husband.name }}餘額</th>
                <th>{{ store.incomeInfo.wife.name }}餘額</th>
                <th>當月結餘</th>
                <th>累積結餘</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="month in store.budgetSummary.monthlyBreakdown"
                :key="month.month"
                :class="{ negative: month.netIncome < 0 }"
              >
                <td class="month-cell">{{ month.month }}月</td>
                <td>NT$ {{ formatNumber(month.income.husbandIncome) }}</td>
                <td>NT$ {{ formatNumber(month.income.wifeIncome) }}</td>
                <td class="income-cell">NT$ {{ formatNumber(month.income.totalIncome) }}</td>
                <td class="expense-cell">NT$ {{ formatNumber(month.expenses.husbandExpenses) }}</td>
                <td class="expense-cell">NT$ {{ formatNumber(month.expenses.wifeExpenses) }}</td>
                <td class="expense-cell shared">NT$ {{ formatNumber(month.expenses.sharedExpenses) }}</td>
                <td class="expense-cell total">NT$ {{ formatNumber(month.expenses.totalExpenses) }}</td>
                <td class="balance-cell husband" :class="{ negative: getHusbandBalance(month) < 0 }">
                  NT$ {{ formatNumber(getHusbandBalance(month)) }}
                </td>
                <td class="balance-cell wife" :class="{ negative: getWifeBalance(month) < 0 }">
                  NT$ {{ formatNumber(getWifeBalance(month)) }}
                </td>
                <td class="balance-cell" :class="{ negative: month.netIncome < 0 }">
                  NT$ {{ formatNumber(month.netIncome) }}
                </td>
                <td class="cumulative-cell" :class="{ negative: month.cumulativeBalance < 0 }">
                  NT$ {{ formatNumber(month.cumulativeBalance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 支出分類統計 -->
      <div class="expense-breakdown">
        <h3>支出分類統計</h3>
        <div class="expense-charts">
          <div class="expense-summary-cards">
            <div class="expense-card husband">
              <h4>{{ store.incomeInfo.husband.name }}個人支出</h4>
              <p class="expense-amount">
                NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.husband) }}
              </p>
              <p class="expense-percentage">
                {{
                  getPercentage(
                    store.budgetSummary.expensesByCategory.husband,
                    store.budgetSummary.totalAnnualExpenses
                  )
                }}%
              </p>
            </div>

            <div class="expense-card wife">
              <h4>{{ store.incomeInfo.wife.name }}個人支出</h4>
              <p class="expense-amount">
                NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.wife) }}
              </p>
              <p class="expense-percentage">
                {{
                  getPercentage(
                    store.budgetSummary.expensesByCategory.wife,
                    store.budgetSummary.totalAnnualExpenses
                  )
                }}%
              </p>
            </div>

            <div class="expense-card shared">
              <h4>共同支出</h4>
              <p class="expense-amount">
                NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.shared) }}
              </p>
              <p class="expense-percentage">
                {{
                  getPercentage(
                    store.budgetSummary.expensesByCategory.shared,
                    store.budgetSummary.totalAnnualExpenses
                  )
                }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 財務建議 -->
      <div class="financial-advice">
        <h3>財務建議</h3>
        <div class="advice-cards">
          <div
            v-for="advice in financialAdvice"
            :key="advice.type"
            class="advice-card"
            :class="advice.type"
          >
            <div class="advice-icon">{{ advice.icon }}</div>
            <div class="advice-content">
              <h4>{{ advice.title }}</h4>
              <p>{{ advice.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 個人可支出餘額總結 -->
      <div class="personal-balance-summary">
        <h3>個人可支出餘額總結</h3>
        <div class="balance-summary-cards">
          <div class="balance-card husband">
            <div class="balance-header">
              <h4>{{ store.incomeInfo.husband.name }}全年可支出餘額</h4>
            </div>
            <div class="balance-content">
              <p class="balance-amount" :class="{ negative: getAnnualHusbandBalance() < 0 }">
                NT$ {{ formatNumber(getAnnualHusbandBalance()) }}
              </p>
              <p class="balance-monthly">
                每月平均：NT$ {{ formatNumber(getAnnualHusbandBalance() / 12) }}
              </p>
              <div class="balance-breakdown">
                <div class="breakdown-item">
                  <span>年收入：</span>
                  <span>NT$ {{ formatNumber(getAnnualHusbandIncome()) }}</span>
                </div>
                <div class="breakdown-item">
                  <span>個人支出：</span>
                  <span>NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.husband) }}</span>
                </div>
                <div class="breakdown-item">
                  <span>共同支出分攤：</span>
                  <span>NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.shared / 2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="balance-card wife">
            <div class="balance-header">
              <h4>{{ store.incomeInfo.wife.name }}全年可支出餘額</h4>
            </div>
            <div class="balance-content">
              <p class="balance-amount" :class="{ negative: getAnnualWifeBalance() < 0 }">
                NT$ {{ formatNumber(getAnnualWifeBalance()) }}
              </p>
              <p class="balance-monthly">
                每月平均：NT$ {{ formatNumber(getAnnualWifeBalance() / 12) }}
              </p>
              <div class="balance-breakdown">
                <div class="breakdown-item">
                  <span>年收入：</span>
                  <span>NT$ {{ formatNumber(getAnnualWifeIncome()) }}</span>
                </div>
                <div class="breakdown-item">
                  <span>個人支出：</span>
                  <span>NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.wife) }}</span>
                </div>
                <div class="breakdown-item">
                  <span>共同支出分攤：</span>
                  <span>NT$ {{ formatNumber(store.budgetSummary.expensesByCategory.shared / 2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <div class="nav-left">
          <button @click="store.prevStep()" class="btn btn-secondary">上一步</button>
          <button @click="store.resetBudget()" class="btn btn-outline">重新規劃</button>
        </div>
        <div class="nav-center">
          <button @click="exportData()" class="btn btn-success">📥 匯出資料</button>
          <button @click="triggerImport()" class="btn btn-info">📤 匯入資料</button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="importData"
            style="display: none"
          />
        </div>
        <div class="nav-right">
          <button @click="printBudget()" class="btn btn-primary">🖨️ 列印預算表</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useBudgetPlanStore, type MonthlyBudget } from "../stores/budgetPlan";

const store = useBudgetPlanStore();
const fileInput = ref<HTMLInputElement>();

const balanceClass = computed(() => {
  const balance = store.budgetSummary.netAnnualIncome;
  if (balance > 0) return "positive";
  if (balance < 0) return "negative";
  return "neutral";
});

const balanceIcon = computed(() => {
  const balance = store.budgetSummary.netAnnualIncome;
  if (balance > 0) return "📈";
  if (balance < 0) return "📉";
  return "⚖️";
});

const financialAdvice = computed(() => {
  const advice = [];
  const balance = store.budgetSummary.netAnnualIncome;
  const totalIncome = store.budgetSummary.totalAnnualIncome;
  const savingsRate = (balance / totalIncome) * 100;

  if (balance > 0) {
    if (savingsRate >= 20) {
      advice.push({
        type: "excellent",
        icon: "🎉",
        title: "財務狀況優秀",
        message: `您的儲蓄率達到 ${savingsRate.toFixed(
          1
        )}%，這是非常好的表現！建議將部分結餘投資於穩健的理財商品。`,
      });
    } else if (savingsRate >= 10) {
      advice.push({
        type: "good",
        icon: "👍",
        title: "財務狀況良好",
        message: `您的儲蓄率為 ${savingsRate.toFixed(
          1
        )}%，建議逐步提高到 20% 以上，為未來做更好的準備。`,
      });
    } else {
      advice.push({
        type: "warning",
        icon: "⚠️",
        title: "建議增加儲蓄",
        message: `您的儲蓄率僅 ${savingsRate.toFixed(1)}%，建議檢視支出項目，嘗試增加儲蓄比例。`,
      });
    }
  } else {
    advice.push({
      type: "danger",
      icon: "🚨",
      title: "支出超過收入",
      message: "您的年度支出超過收入，請立即檢視並調整支出項目，或考慮增加收入來源。",
    });
  }

  // 緊急備用金建議
  const monthlyExpenses = store.budgetSummary.totalAnnualExpenses / 12;
  const emergencyFund = monthlyExpenses * 6;
  advice.push({
    type: "info",
    icon: "🛡️",
    title: "緊急備用金",
    message: `建議準備 ${formatNumber(emergencyFund)} 元作為緊急備用金（6個月生活費）。`,
  });

  return advice;
});

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function getPercentage(amount: number, total: number): string {
  if (total === 0) return "0";
  return ((amount / total) * 100).toFixed(1);
}

function printBudget() {
  window.print();
}

// 匯出資料為 JSON 檔案
function exportData() {
  try {
    const data = store.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${store.familyInfo.familyName}_${store.familyInfo.budgetYear}年度預算.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 顯示成功訊息
    alert("✅ 資料匯出成功！");
  } catch (error) {
    console.error("匯出失敗:", error);
    alert("❌ 匯出失敗，請稍後再試。");
  }
}

// 觸發檔案選擇
function triggerImport() {
  fileInput.value?.click();
}

// 匯入資料
function importData(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (file.type !== "application/json") {
    alert("❌ 請選擇 JSON 檔案格式。");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);

      // 驗證資料格式
      if (!data.familyInfo || !data.incomeInfo || !data.expenseItems) {
        alert("❌ 檔案格式不正確，請選擇有效的預算資料檔案。");
        return;
      }

      // 確認是否要覆蓋現有資料
      const confirmed = confirm(
        `⚠️ 匯入資料將會覆蓋現有的預算設定，是否確定要繼續？\n\n匯入檔案：${
          data.familyInfo?.familyName || "未知"
        } ${data.familyInfo?.budgetYear || ""}年度預算`
      );

      if (confirmed) {
        store.importData(data);
        alert("✅ 資料匯入成功！");

        // 重新整理頁面以確保資料同步
        window.location.reload();
      }
    } catch (error) {
      console.error("匯入失敗:", error);
      alert("❌ 檔案格式錯誤，無法解析 JSON 資料。");
    } finally {
      // 清空檔案輸入框
      target.value = "";
    }
  };

  reader.readAsText(file);
}

// 計算先生的可支出餘額（收入 - 個人支出 - 共同支出的一半）
const getHusbandBalance = (month: MonthlyBudget) => {
  const sharedHalf = month.expenses.sharedExpenses / 2;
  return month.income.husbandIncome - month.expenses.husbandExpenses - sharedHalf;
};

// 計算太太的可支出餘額（收入 - 個人支出 - 共同支出的一半）
const getWifeBalance = (month: MonthlyBudget) => {
  const sharedHalf = month.expenses.sharedExpenses / 2;
  return month.income.wifeIncome - month.expenses.wifeExpenses - sharedHalf;
};

// 計算先生的年收入
const getAnnualHusbandIncome = () => {
  return store.budgetSummary.monthlyBreakdown.reduce(
    (total, month) => total + month.income.husbandIncome, 
    0
  );
};

// 計算太太的年收入
const getAnnualWifeIncome = () => {
  return store.budgetSummary.monthlyBreakdown.reduce(
    (total, month) => total + month.income.wifeIncome, 
    0
  );
};

// 計算先生的全年可支出餘額
const getAnnualHusbandBalance = () => {
  return getAnnualHusbandIncome() - 
         store.budgetSummary.expensesByCategory.husband - 
         (store.budgetSummary.expensesByCategory.shared / 2);
};

// 計算太太的全年可支出餘額
const getAnnualWifeBalance = () => {
  return getAnnualWifeIncome() - 
         store.budgetSummary.expensesByCategory.wife - 
         (store.budgetSummary.expensesByCategory.shared / 2);
};
</script>

<style scoped lang="scss">
.budget-results-step {
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
    margin-bottom: 2rem;
    color: #1f2937;
  }

  .budget-overview {
    margin-bottom: 2rem;

    .overview-cards {
      display: grid;
      gap: 1rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .overview-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &.income {
        border-left: 4px solid #10b981;
      }

      &.expense {
        border-left: 4px solid #f59e0b;
      }

      &.balance.positive {
        border-left: 4px solid #059669;
      }

      &.balance.negative {
        border-left: 4px solid #dc2626;
      }

      &.balance.neutral {
        border-left: 4px solid #6b7280;
      }

      .card-icon {
        font-size: 2rem;
      }

      .card-content {
        h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
      }
    }
  }

  .monthly-breakdown {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .breakdown-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1200px; // 增加最小寬度以容納更多欄位

      th,
      td {
        padding: 0.5rem 0.75rem; // 稍微減小 padding 以節省空間
        text-align: right;
        border-bottom: 1px solid #e5e7eb;
        font-size: 0.9rem; // 稍微減小字體
      }

      th {
        background-color: #f9fafb;
        font-weight: 600;
        color: #374151;
        text-align: center;
        font-size: 0.85rem; // 標題字體稍小
      }

      .month-cell {
        text-align: center;
        font-weight: 600;
      }

      .income-cell {
        color: #059669;
        font-weight: 600;
      }

      .expense-cell {
        color: #dc2626;
        font-weight: 600;
        
        &.shared {
          color: #0891b2; // 共同支出使用不同顏色
        }
        
        &.total {
          color: #dc2626;
          border-left: 2px solid #dc2626;
        }
      }

      .balance-cell {
        font-weight: 600;
        
        &.husband {
          color: #3b82f6;
        }
        
        &.wife {
          color: #ec4899;
        }

        &.negative {
          color: #dc2626;
        }
      }
      
      .cumulative-cell {
        font-weight: 600;

        &.negative {
          color: #dc2626;
        }
      }

      tr.negative {
        background-color: #fef2f2;
      }

      tr:hover {
        background-color: #f9fafb;
      }
    }
  }

  .expense-breakdown {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
    }

    .expense-summary-cards {
      display: grid;
      gap: 1rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .expense-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        text-align: center;

        &.husband {
          border-left: 4px solid #3b82f6;
        }

        &.wife {
          border-left: 4px solid #ec4899;
        }

        &.shared {
          border-left: 4px solid #10b981;
        }

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .expense-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: #dc2626;
          margin: 0 0 0.25rem 0;
        }

        .expense-percentage {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }
      }
    }
  }

  .financial-advice {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
    }

    .advice-cards {
      display: grid;
      gap: 1rem;
    }

    .advice-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;

      &.excellent {
        border-left: 4px solid #059669;
        background-color: #f0fdf4;
      }

      &.good {
        border-left: 4px solid #10b981;
        background-color: #f0fdf4;
      }

      &.warning {
        border-left: 4px solid #f59e0b;
        background-color: #fffbeb;
      }

      &.danger {
        border-left: 4px solid #dc2626;
        background-color: #fef2f2;
      }

      &.info {
        border-left: 4px solid #3b82f6;
        background-color: #eff6ff;
      }

      .advice-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .advice-content {
        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.5rem 0;
        }

        p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  }

  .personal-balance-summary {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
    }

    .balance-summary-cards {
      display: grid;
      gap: 1.5rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .balance-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        &.husband {
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
        }

        &.wife {
          border-left: 4px solid #ec4899;
          background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%);
        }

        .balance-header {
          margin-bottom: 1rem;

          h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            margin: 0;
          }
        }

        .balance-content {
          .balance-amount {
            font-size: 2rem;
            font-weight: 700;
            color: #059669;
            margin: 0 0 0.5rem 0;

            &.negative {
              color: #dc2626;
            }
          }

          .balance-monthly {
            font-size: 1rem;
            color: #6b7280;
            margin: 0 0 1rem 0;
            font-style: italic;
          }

          .balance-breakdown {
            border-top: 1px solid #e5e7eb;
            padding-top: 1rem;

            .breakdown-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.25rem 0;
              font-size: 0.9rem;

              &:not(:last-child) {
                border-bottom: 1px solid #f3f4f6;
              }

              span:first-child {
                color: #6b7280;
              }

              span:last-child {
                font-weight: 600;
                color: #374151;
              }
            }
          }
        }
      }
    }
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    @media (min-width: 768px) {
      flex-wrap: nowrap;
    }

    .nav-left,
    .nav-center,
    .nav-right {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .nav-center {
      @media (max-width: 767px) {
        order: 3;
        width: 100%;
        justify-content: center;
      }
    }
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

    &.btn-outline {
      background-color: transparent;
      color: #3b82f6;
      border: 2px solid #3b82f6;

      &:hover {
        background-color: #3b82f6;
        color: white;
      }
    }

    &.btn-success {
      background-color: #10b981;
      color: white;

      &:hover {
        background-color: #059669;
        transform: translateY(-1px);
      }
    }

    &.btn-info {
      background-color: #0ea5e9;
      color: white;

      &:hover {
        background-color: #0284c7;
        transform: translateY(-1px);
      }
    }
  }
}

// 打印樣式
@media print {
  .navigation {
    display: none !important;
  }

  .budget-results-step {
    padding: 0;

    .container {
      max-width: none;
      padding: 0;
    }
  }
}
</style>
