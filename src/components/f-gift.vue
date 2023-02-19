<template>
  <list
    :show-scrollbar="false"
    :bounce="false"
    style="width: 520rpx; height: 500rpx"
  >
    <cell
      class="flex align-center pt-3"
      v-for="(item, index) in gifts"
      :key="index"
      :ref="'cell' + item.id"
      insert-animation="default"
      delete-animation="default"
    >
      <view
        style="
          width: 325rpx;
          background-image: linear-gradient(to right, #bcabb1, #65aaf0);
        "
        class="flex rounded-circle"
      >
        <view class="p">
          <image
            :src="item.avatar || '/static/tabbar/min.png'"
            style="width: 70rpx; height: 70rpx"
            class="rounded-circle"
          ></image>
        </view>
        <view class="flex-1 flex flex-column justify-center">
          <text class="text-white font">{{ item.username }}</text>
          <text class="text-white font-sm">送{{ item.gift_name }}</text>
        </view>
        <view class="p">
          <image
            :src="item.gift_image"
            style="width: 70rpx; height: 70rpx"
            class="rounded-circle"
          ></image>
        </view>
      </view>
      <text class="text-warning font-lg ml-1">X {{ item.num }}</text>
    </cell>
  </list>
</template>

<script>
const dom = uni.requireNativePlugin('dom')

export default {
  data() {
    return {
      gifts: []
    }
  },
  methods: {
    send(gift) {
      this.gifts.push(gift)
      this.toBottom()
      this.autoHide()
    },
    toBottom() {
      this.$nextTick(() => {
        let index = this.gifts.length - 1
        let ref = 'cell' + this.gifts[index].id
        if (this.$refs[ref]) {
          dom.scrollToElement(this.$refs[ref][0], {})
        }
      })
    },
    autoHide() {
      if (this.gifts.length) {
        setTimeout(() => {
          this.gifts.shift()
        }, 5000)
      }
    }
  }
}
</script>

<style scoped></style>
