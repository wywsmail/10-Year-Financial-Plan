import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

// localStorage 鍵名
const STORAGE_KEYS = {
  FAMILY_INFO: "budget_family_info",
  INCOME_INFO: "budget_income_info",
  EXPENSE_ITEMS: "budget_expense_items",
  CURRENT_STEP: "budget_current_step",
} as const;

// localStorage 工具函數
const saveToStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("保存到 localStorage 失敗:", error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error("從 localStorage 載入失敗:", error);
    return defaultValue;
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("從 localStorage 移除失敗:", error);
  }
};

// 定義數據類型
export interface FamilyInfo {
  familyName: string;
  budgetYear: number;
}

export interface IncomeInfo {
  husband: {
    name: string;
    monthlyIncome: number;
    bonusAmount: number;
    bonusMonth: number; // 1-12
    sbBonusAmount: number; // SB獎金
    sbBonusMonth: number; // SB獎金發放月份 1-12
  };
  wife: {
    name: string;
    monthlyIncome: number;
    bonusAmount: number;
    bonusMonth: number; // 1-12
  };
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: "husband" | "wife" | "shared";
  frequency: "monthly" | "quarterly" | "yearly";
  month?: number; // 指定月份 (1-12)，用於季度和年度支出
  description?: string;
}

export interface MonthlyBudget {
  month: number;
  income: {
    husbandIncome: number;
    wifeIncome: number;
    totalIncome: number;
  };
  expenses: {
    husbandExpenses: number;
    wifeExpenses: number;
    sharedExpenses: number;
    totalExpenses: number;
  };
  netIncome: number;
  cumulativeBalance: number;
}

export interface BudgetSummary {
  totalAnnualIncome: number;
  totalAnnualExpenses: number;
  netAnnualIncome: number;
  monthlyBreakdown: MonthlyBudget[];
  expensesByCategory: {
    husband: number;
    wife: number;
    shared: number;
  };
}

export interface ImportData {
  familyInfo?: FamilyInfo;
  incomeInfo?: IncomeInfo;
  expenseItems?: ExpenseItem[];
  currentStep?: number;
}

export const useBudgetPlanStore = defineStore("budgetPlan", () => {
  // 狀態 - 從 localStorage 載入或使用預設值
  const currentStep = ref(loadFromStorage(STORAGE_KEYS.CURRENT_STEP, 1));

  const familyInfo = ref<FamilyInfo>(
    loadFromStorage(STORAGE_KEYS.FAMILY_INFO, {
      familyName: "我們的家庭",
      budgetYear: new Date().getFullYear(),
    })
  );

  const incomeInfo = ref<IncomeInfo>(
    loadFromStorage(STORAGE_KEYS.INCOME_INFO, {
      husband: {
        name: "先生",
        monthlyIncome: 60000,
        bonusAmount: 100000,
        bonusMonth: 6, // 6月
        sbBonusAmount: 50000, // SB獎金預設值
        sbBonusMonth: 3, // 3月發放
      },
      wife: {
        name: "太太",
        monthlyIncome: 50000,
        bonusAmount: 80000,
        bonusMonth: 12, // 12月
      },
    })
  );

  const expenseItems = ref<ExpenseItem[]>(
    loadFromStorage(STORAGE_KEYS.EXPENSE_ITEMS, [
      // 預設一些常見支出項目
      {
        id: "1",
        name: "房租/房貸",
        amount: 25000,
        category: "shared",
        frequency: "monthly",
        description: "住房費用",
      },
      {
        id: "2",
        name: "伙食費",
        amount: 15000,
        category: "shared",
        frequency: "monthly",
        description: "家庭伙食",
      },
      {
        id: "3",
        name: "水電瓦斯",
        amount: 3000,
        category: "shared",
        frequency: "monthly",
        description: "公用事業費",
      },
    ])
  );

  // 計算屬性
  const totalAnnualIncome = computed(() => {
    const husbandTotal =
      incomeInfo.value.husband.monthlyIncome * 12 +
      incomeInfo.value.husband.bonusAmount +
      incomeInfo.value.husband.sbBonusAmount;
    const wifeTotal = incomeInfo.value.wife.monthlyIncome * 12 + incomeInfo.value.wife.bonusAmount;
    return husbandTotal + wifeTotal;
  });

  const totalAnnualExpenses = computed(() => {
    return expenseItems.value.reduce((total, item) => {
      let annualAmount = 0;
      switch (item.frequency) {
        case "monthly":
          annualAmount = item.amount * 12;
          break;
        case "quarterly":
          annualAmount = item.amount * 4;
          break;
        case "yearly":
          annualAmount = item.amount;
          break;
      }
      return total + annualAmount;
    }, 0);
  });

  const expensesByCategory = computed(() => {
    const categories = { husband: 0, wife: 0, shared: 0 };

    expenseItems.value.forEach((item) => {
      let annualAmount = 0;
      switch (item.frequency) {
        case "monthly":
          annualAmount = item.amount * 12;
          break;
        case "quarterly":
          annualAmount = item.amount * 4;
          break;
        case "yearly":
          annualAmount = item.amount;
          break;
      }
      categories[item.category] += annualAmount;
    });

    return categories;
  });

  const monthlyBreakdown = computed(() => {
    const breakdown: MonthlyBudget[] = [];
    let cumulativeBalance = 0;

    for (let month = 1; month <= 12; month++) {
      // 計算該月收入
      let husbandIncome = incomeInfo.value.husband.monthlyIncome;
      let wifeIncome = incomeInfo.value.wife.monthlyIncome;

      // 加上獎金（如果是該月份）
      if (incomeInfo.value.husband.bonusMonth === month) {
        husbandIncome += incomeInfo.value.husband.bonusAmount;
      }
      if (incomeInfo.value.husband.sbBonusMonth === month) {
        husbandIncome += incomeInfo.value.husband.sbBonusAmount;
      }
      if (incomeInfo.value.wife.bonusMonth === month) {
        wifeIncome += incomeInfo.value.wife.bonusAmount;
      }

      const totalIncome = husbandIncome + wifeIncome;

      // 計算該月支出
      let husbandExpenses = 0;
      let wifeExpenses = 0;
      let sharedExpenses = 0;

      expenseItems.value.forEach((item) => {
        let shouldInclude = false;
        const amount = item.amount;

        switch (item.frequency) {
          case "monthly":
            shouldInclude = true;
            break;
          case "quarterly":
            // 季度支出：3, 6, 9, 12月
            shouldInclude = month % 3 === 0;
            break;
          case "yearly":
            // 年度支出：在指定月份或12月
            shouldInclude = month === (item.month || 12);
            break;
        }

        if (shouldInclude) {
          switch (item.category) {
            case "husband":
              husbandExpenses += amount;
              break;
            case "wife":
              wifeExpenses += amount;
              break;
            case "shared":
              sharedExpenses += amount;
              break;
          }
        }
      });

      const totalExpenses = husbandExpenses + wifeExpenses + sharedExpenses;
      const netIncome = totalIncome - totalExpenses;
      cumulativeBalance += netIncome;

      breakdown.push({
        month,
        income: {
          husbandIncome,
          wifeIncome,
          totalIncome,
        },
        expenses: {
          husbandExpenses,
          wifeExpenses,
          sharedExpenses,
          totalExpenses,
        },
        netIncome,
        cumulativeBalance,
      });
    }

    return breakdown;
  });

  const budgetSummary = computed<BudgetSummary>(() => {
    return {
      totalAnnualIncome: totalAnnualIncome.value,
      totalAnnualExpenses: totalAnnualExpenses.value,
      netAnnualIncome: totalAnnualIncome.value - totalAnnualExpenses.value,
      monthlyBreakdown: monthlyBreakdown.value,
      expensesByCategory: expensesByCategory.value,
    };
  });

  // 方法
  function nextStep() {
    if (currentStep.value < 4) {
      currentStep.value++;
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }

  function setStep(step: number) {
    if (step >= 1 && step <= 4) {
      currentStep.value = step;
    }
  }

  function updateFamilyInfo(info: Partial<FamilyInfo>) {
    familyInfo.value = { ...familyInfo.value, ...info };
  }

  function updateIncomeInfo(info: Partial<IncomeInfo>) {
    incomeInfo.value = { ...incomeInfo.value, ...info };
  }

  function addExpenseItem(item: Omit<ExpenseItem, "id">) {
    const newItem: ExpenseItem = {
      ...item,
      id: Date.now().toString(),
    };
    expenseItems.value.push(newItem);
  }

  function removeExpenseItem(id: string) {
    const index = expenseItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      expenseItems.value.splice(index, 1);
    }
  }

  function updateExpenseItem(id: string, updates: Partial<ExpenseItem>) {
    const item = expenseItems.value.find((item) => item.id === id);
    if (item) {
      Object.assign(item, updates);
    }
  }

  function resetBudget() {
    // 清空 localStorage
    clearStorage();

    // 重設所有狀態為預設值
    currentStep.value = 1;
    familyInfo.value = {
      familyName: "我們的家庭",
      budgetYear: new Date().getFullYear(),
    };
    incomeInfo.value = {
      husband: {
        name: "先生",
        monthlyIncome: 60000,
        bonusAmount: 100000,
        bonusMonth: 6,
        sbBonusAmount: 50000,
        sbBonusMonth: 3,
      },
      wife: {
        name: "太太",
        monthlyIncome: 50000,
        bonusAmount: 80000,
        bonusMonth: 12,
      },
    };
    expenseItems.value = [
      {
        id: "1",
        name: "房租/房貸",
        amount: 25000,
        category: "shared",
        frequency: "monthly",
        description: "住房費用",
      },
      {
        id: "2",
        name: "伙食費",
        amount: 15000,
        category: "shared",
        frequency: "monthly",
        description: "家庭伙食",
      },
      {
        id: "3",
        name: "水電瓦斯",
        amount: 3000,
        category: "shared",
        frequency: "monthly",
        description: "公用事業費",
      },
    ];
  }

  // 清空所有 localStorage 資料
  function clearStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      removeFromStorage(key);
    });
  }

  // 匯出資料
  function exportData() {
    return {
      familyInfo: familyInfo.value,
      incomeInfo: incomeInfo.value,
      expenseItems: expenseItems.value,
      currentStep: currentStep.value,
      exportDate: new Date().toISOString(),
    };
  }

  // 匯入資料
  function importData(data: ImportData) {
    try {
      if (data.familyInfo) {
        familyInfo.value = data.familyInfo;
      }
      if (data.incomeInfo) {
        incomeInfo.value = data.incomeInfo;
      }
      if (data.expenseItems) {
        expenseItems.value = data.expenseItems;
      }
      if (data.currentStep) {
        currentStep.value = data.currentStep;
      }
    } catch (error) {
      console.error("匯入資料失敗:", error);
    }
  }

  // 監聽狀態變化並自動保存到 localStorage
  watch(
    currentStep,
    (newValue) => {
      saveToStorage(STORAGE_KEYS.CURRENT_STEP, newValue);
    },
    { deep: true }
  );

  watch(
    familyInfo,
    (newValue) => {
      saveToStorage(STORAGE_KEYS.FAMILY_INFO, newValue);
    },
    { deep: true }
  );

  watch(
    incomeInfo,
    (newValue) => {
      saveToStorage(STORAGE_KEYS.INCOME_INFO, newValue);
    },
    { deep: true }
  );

  watch(
    expenseItems,
    (newValue) => {
      saveToStorage(STORAGE_KEYS.EXPENSE_ITEMS, newValue);
    },
    { deep: true }
  );

  return {
    // 狀態
    currentStep,
    familyInfo,
    incomeInfo,
    expenseItems,

    // 計算屬性
    totalAnnualIncome,
    totalAnnualExpenses,
    expensesByCategory,
    monthlyBreakdown,
    budgetSummary,

    // 方法
    nextStep,
    prevStep,
    setStep,
    updateFamilyInfo,
    updateIncomeInfo,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem,
    resetBudget,
    clearStorage,
    exportData,
    importData,
  };
});
