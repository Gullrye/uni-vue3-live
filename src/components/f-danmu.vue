<template>
  <view class="box">
    <scroll-view
      scroll-y="true"
      style="width: 520rpx; height: 300rpx"
      scroll-with-animation
      class="pl-3"
      :scroll-into-view="scrollInToView"
    >
      <view
        :id="'danmu' + item.id"
        v-for="item in list"
        :key="item.id"
        class="rounded p-2 mb-2"
        style="background-color: rgba(255, 255, 255, 0.125)"
      >
        <!-- <text class="font-md m-1 text-danger">{{ item.name }}：</text>
        <text class="font-md m-1 text-white">
          {{ item.content }}
        </text> -->
        <rich-text :nodes="richNodes(item)"></rich-text>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
interface DanMu {
  name: string
  id: number
  content: string
}

const scrollInToView = ref('')
const list = reactive<DanMu[]>([
  {
    id: 1,
    name: 'xxx',
    content: '床前明月光疑是地上霜举头拿毛巾'
  },
  {
    id: 2,
    name: '大家卡夫斯基的',
    content: '嘻嘻嘻嘻嘻ixxx的'
  },
  {
    id: 3,
    name: 'i偶尔啊',
    content: '哦哦哦哦哦哦😭'
  }
])

const send = (data: DanMu) => {
  list.push(data)
  toBottom()
}
const toBottom = () => {
  setTimeout(() => {
    let len = list.length
    if (len > 0 && list[len - 1]) {
      scrollInToView.value = `danmu${list[len - 1].id}`
    }
  }, 300)
}
defineExpose({ send })

const richNodes = (item: any) => {
  return [
    {
      children: [
        {
          type: 'text',
          attrs: {
            style: 'color: #ff0000;'
          },
          text: item.name + '：'
        },
        {
          type: 'text',
          attrs: {
            style: 'color: #fff;'
          },
          text: item.content
        }
      ]
    }
  ]
}
</script>

<style scoped>
.box {
  position: fixed;
  bottom: 120rpx;
  left: 0;
  right: 0;
}
</style>
