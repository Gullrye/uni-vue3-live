<template>
  <view>
    <view
      v-if="showLoading"
      class="position-fixed top-0 bottom-0 left-0 right-0 bg-light flex align-center justify-center"
      style="z-index: 100"
    >
      <text class="text-muted font">加载中...</text>
    </view>

    <view class="flex align-center justify-center" style="height: 350rpx">
      <text style="font-size: 50rpx">YOU-LOGO</text>
    </view>
    <view class="px-3">
      <input
        type="text"
        v-model="form.username"
        class="bg-light px-3 mb-3 font"
        placeholder="请输入用户名"
        style="height: 100rpx"
      />
      <input
        type="text"
        v-model="form.password"
        class="bg-light px-3 mb-3 font"
        placeholder="请输入密码"
        style="height: 100rpx"
      />
      <input
        v-if="type !== 'login'"
        type="text"
        v-model="form.repassword"
        class="bg-light px-3 mb-3 font"
        placeholder="请输入确认密码"
        style="height: 100rpx"
      />
    </view>

    <view class="p-3 flex align-center justify-center">
      <view
        class="bg-main rounded p-3 flex align-center justify-center flex-1"
        hover-class="bg-main-hover"
        @click="submit"
      >
        <text class="text-white font-md">{{
          type === 'login' ? '登 录' : '注 册'
        }}</text>
      </view>
    </view>

    <view class="flex align-center justify-center">
      <text class="text-light-muted font p-2" @click="changeType">{{
        type === 'login' ? '注册账号' : '去登录'
      }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import http from '@/utils/request'
import { ref, reactive, onMounted } from 'vue'
import { useSocketStore } from '@/stores/useSocketStore'

const socketStore = useSocketStore()

const form = reactive({
  username: '',
  password: '',
  repassword: ''
})
const showLoading = ref(true)
onMounted(() => {
  let token = uni.getStorageSync('token')
  if (token) {
    uni.switchTab({
      url: '../index/index'
    })
  } else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 800
    })
    showLoading.value = false
  }
})

const type = ref<'login' | 'reg'>('login')
const changeType = () => {
  type.value = type.value === 'login' ? 'reg' : 'login'
  Object.assign(form, {
    username: '',
    password: '',
    repassword: ''
  })
}

const submit = () => {
  let msg = type.value === 'login' ? '登录' : '注册'
  http.post<UserInfo>(`/${type.value}`, form, { loading: true }).then((res) => {
    uni.showToast({
      title: `${msg}成功`,
      icon: 'success'
    })
    if (type.value === 'reg') {
      changeType()
    } else {
      socketStore.login(res)
      uni.switchTab({
        url: '../index/index'
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
