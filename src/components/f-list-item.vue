<template>
  <view
    class="p-3 flex align-center"
    hover-class="bg-light"
    @click="onItemClick"
  >
    <text class="iconfont mr-3" :class="icon"></text>
    <text class="font-md">{{ title }}</text>
    <view class="ml-auto">
      <slot></slot>
      <text v-if="showRight" class="text-muted font ml-2">👉</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  showRight: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['click'])
const onItemClick = () => {
  emits('click')
}
</script>

<style scoped></style>
