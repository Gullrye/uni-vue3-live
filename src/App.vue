<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAuthJump } from './hooks/useAuthJump'
import { useSocketStore } from './stores/useSocketStore'

onLaunch(() => {
  console.log('App Launch')
  // nvue 使用基于 Weex 的原生渲染，引入图标库方式如下
  const domModule = uni.requireNativePlugin('dom')
  domModule.addRule('fontFace', {
    fontFamily: 'iconfont',
    src: "url('http://at.alicdn.com/t/font_1859985_7mxozsfdvib.ttf')"
  })

  uni.onTabBarMidButtonTap(() => {
    useAuthJump({ url: '/pages/create-live/create-live' })
    console.log('点击了中间按钮')
  })

  const socketStore = useSocketStore()
  socketStore.initUserInfo()
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style>
@import './common/free.css';
@import './common/common.css';
/* nvue 时，iconfont 只能用 unicode */
/* #ifndef APP-PLUS-NVUE */
@import './common/icon.css';
/* #endif */
</style>
