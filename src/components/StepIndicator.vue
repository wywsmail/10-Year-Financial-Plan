<template>
  <div
    class="step-indicator"
    :class="{ 'step-disabled': step.number > current }"
    @click="$emit('click')"
  >
    <!-- 步驟圓圈 -->
    <div class="step-circle" :class="stepClasses">
      <span v-if="step.number < current" class="step-icon-check">
        <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span v-else class="step-number">{{ step.number }}</span>
    </div>

    <!-- 步驟標題 -->
    <span class="step-title" :class="titleClasses">
      {{ step.title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Step {
  number: number;
  title: string;
  route: string;
}

interface Props {
  step: Step;
  current: number;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const stepClasses = computed(() => {
  if (props.step.number < props.current) {
    return "step-completed";
  } else if (props.step.number === props.current) {
    return "step-current";
  } else {
    return "step-pending";
  }
});

const titleClasses = computed(() => {
  if (props.step.number <= props.current) {
    return "title-active";
  } else {
    return "title-inactive";
  }
});
</script>

<style lang="scss" scoped>
.step-indicator {
  display: flex;
  align-items: center;
  cursor: pointer;

  &.step-disabled {
    pointer-events: none;
  }

  &:hover .step-circle.step-pending {
    border-color: #9ca3af;
  }

  &:hover .step-title.title-inactive {
    color: #374151;
  }
}

.step-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.2s ease;

  &.step-completed,
  &.step-current {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  &.step-pending {
    background: white;
    border-color: #d1d5db;
    color: #6b7280;
  }
}

.step-icon-check {
  color: white;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.step-number {
  font-size: 0.875rem;
  font-weight: 500;
}

.step-title {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &.title-active {
    color: #3b82f6;
  }

  &.title-inactive {
    color: #6b7280;
  }
}
</style>
