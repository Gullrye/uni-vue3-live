import { useSocketStore } from '@/stores/useSocketStore'

export const useAuthJump = (options: UniApp.NavigateToOptions) => {
  const socketStore = useSocketStore()

  if (!socketStore.token) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return uni.navigateTo({
      url: '/pages/login/login'
    })
  }
  // uni.switchTab(options)
  uni.navigateTo(options)
}
