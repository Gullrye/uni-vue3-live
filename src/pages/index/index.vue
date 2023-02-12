<template>
  <view>
    <swiper
      indicator-dots
      autoplay
      :interval="3000"
      :duration="200"
      style="width: 750rpx; height: 250rpx"
    >
      <swiper-item>
        <image
          src="../../static/demo/banner/1.jpg"
          alt=""
          style="width: 750rpx; height: 250rpx"
        />
      </swiper-item>
      <swiper-item>
        <image
          src="../../static/demo/banner/2.jpg"
          alt=""
          style="width: 750rpx; height: 250rpx"
        />
      </swiper-item>
    </swiper>

    <view class="list flex flex-wrap">
      <view
        class="list-item"
        v-for="item in list"
        :key="item.id"
        @click="openLive(item.id)"
      >
        <image
          class="rounded"
          :src="item.cover || '/static/demo/1.jpg'"
          mode="aspectFill"
          style="width: 365rpx; height: 365rpx"
        />
        <view class="coin-box rounded-circle px-2 flex align-center">
          <text class="iconfont iconbizhongguanli text-warning mr-1"></text>
          <text class="text-white font">{{ item.coin }}</text>
        </view>
        <view class="people-box rounded-circle px-2 flex align-center">
          <text class="font-sm text-white">人气：</text
          ><text class="text-white font-sm">{{ item.look_count }}</text>
        </view>

        <view class="title-box rounded-circle flex align-center">
          <text class="text-white font">{{ item.title }}</text>
        </view>

        <view class="status-box rounded-circle px-2 flex align-center">
          <text
            style="width: 20rpx; height: 20rpx"
            class="rounded-circle mr-1"
            :class="'bg-' + (item.status === 1 ? 'success' : 'danger')"
          ></text
          ><text class="text-white font-sm">{{ statusText(item.status) }}</text>
        </view>
      </view>
    </view>

    <view class="flex align-center justify-center py-3">
      <text class="font-md text-secondary">{{ loadText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import http from '@/utils/request'

interface ListItem {
  coin: number
  cover: string
  id: number
  key: string
  look_count: number
  status: 0 | 1 | 2 | 3
  title: string
  userId: number
  user_id: number
  created_time: string
  updated_time: string
}
type LoadText = '上拉加载更多' | '加载中' | '没有更多了'

const list = ref<ListItem[]>([])
const page = ref(1)
const loadText = ref<LoadText>('上拉加载更多')

const getList = () => {
  return http
    .get<ListItem[]>(`/live/list/${page.value}`)
    .then((res) => {
      list.value = page.value === 1 ? res : [...list.value, ...res]
      loadText.value = res.length < 10 ? '没有更多了' : '上拉加载更多'
    })
    .catch((err) => {
      if (page.value > 1) {
        page.value--
        loadText.value = '上拉加载更多'
      }
    })
}
const statusText = computed(() => {
  return (status: number) => {
    const map: Record<string, string> = {
      0: '未开始',
      1: '直播中',
      2: '暂停',
      3: '已结束'
    }
    return map[status]
  }
})
const openLive = (id: number) => {
  uni.navigateTo({ url: `../live/live?id=${id}` })
}

onMounted(() => {
  getList()
})
// 上拉刷新
onPullDownRefresh(() => {
  page.value = 1
  getList()
    .then((res) => {
      uni.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 1000
      })
      uni.stopPullDownRefresh()
    })
    .catch((err) => {
      uni.stopPullDownRefresh()
    })
})
// 下拉加载
onReachBottom(() => {
  if (loadText.value !== '上拉加载更多') {
    return
  }
  loadText.value = '加载中'
  page.value++
  getList()
})
</script>

<style lang="scss" scoped>
.list {
  .list-item {
    box-sizing: border-box;
    position: relative;
    width: 375rpx;
    height: 375rpx;
    padding: 5rpx;
    .coin-box {
      position: absolute;
      top: 15rpx;
      left: 15rpx;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .people-box {
      position: absolute;
      top: 15rpx;
      right: 15rpx;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .title-box {
      position: absolute;
      left: 15rpx;
      bottom: 15rpx;
    }
    .status-box {
      position: absolute;
      bottom: 15rpx;
      right: 15rpx;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
