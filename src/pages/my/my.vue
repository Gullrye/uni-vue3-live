<template>
  <view>
    <view v-if="!userInfo" class="flex align-center">
      <view
        class="flex align-center justify-center"
        style="width: 180rpx; height: 180rpx"
      >
        <image
          src="/static/gift/4.png"
          class="rounded-circle"
          style="width: 105rpx; height: 105rpx"
        ></image>
      </view>
      <view class="flex flex-column">
        <text class="font-md">未登录</text>
        <text class="font text-muted">登录体验更多功能</text>
      </view>
      <view class="ml-auto mr-3">
        <view
          class="border border-main rounded flex align-center justify-center p-2"
          hover-class="bg-light"
          @click="openLogin"
        >
          <text class="text-main font">立即登录</text>
        </view>
      </view>
    </view>

    <view v-else class="flex align-center">
      <view
        class="flex align-center justify-center"
        style="width: 180rpx; height: 180rpx"
      >
        <image
          :src="userInfo.avatar || '/static/gift/4.png'"
          class="rounded-circle"
          style="width: 105rpx; height: 105rpx"
        ></image>
      </view>
      <view class="flex flex-column">
        <text class="font-md">{{ userInfo.username }}</text>
      </view>
      <view class="ml-auto mr-3">
        <view
          class="border border-main rounded flex align-center justify-center p-2"
          hover-class="bg-light"
        >
          <text class="text-main font">编辑资料</text>
        </view>
      </view>
    </view>

    <view class="f-divider"></view>
    <FListItem
      icon="iconfaxian"
      title="我的金币"
      :showRight="false"
      @click="useAuthJump({ url: '/pages/coin/coin' })"
    ></FListItem>
    <FListItem icon="iconfaxian" title="我的直播">
      <text class="text-muted font">666</text>
    </FListItem>
    <FListItem
      icon="iconfaxian"
      title="退出登录"
      :showRight="false"
      @click="logout"
    >
    </FListItem>
  </view>
</template>

<script setup lang="ts">
import { useSocketStore } from '@/stores/useSocketStore'
import { onNavigationBarButtonTap, onShow } from '@dcloudio/uni-app'
import { useAuthJump } from '@/hooks/useAuthJump'
import FListItem from '@/components/f-list-item.vue'

const socketStore = useSocketStore()
const userInfo = socketStore.userInfo

const openLogin = () => {
  uni.navigateTo({
    url: '../login/login'
  })
}
const logout = () => {
  socketStore.logout()
  setTimeout(() => {
    uni.navigateTo({
      url: '../login/login'
    })
  }, 1000)
}

onNavigationBarButtonTap(() => {
  console.log('onNavigationBarButtonTap')
  useAuthJump({ url: '/pages/index/index' })
})

onShow(() => {
  socketStore.getUserInfo()
})
</script>

<style lang="scss" scoped></style>
