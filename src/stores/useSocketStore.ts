import { defineStore } from 'pinia'
import io from '@hyoga/uni-socket.io'
import $C from '@/common/config'
import http from '@/utils/request'

interface State {
  socket: any
  userInfo: UserInfo | null
  token: string
}
interface Actions {
  closeSocket: () => void
  connectSocket: () => void
  login: (userInfo: UserInfo) => void
  initUserInfo: () => void
  getUserInfo: () => void
  logout: () => void
}

export const useSocketStore = defineStore<string, State, {}, Actions>(
  'socket',
  {
    state: () => {
      return {
        socket: null,
        userInfo: null,
        token: ''
      }
    },
    actions: {
      // 只 connect 一次
      connectSocket() {
        console.log('--------connectSocket--------')
        const S = io($C.socketUrl, {
          query: {},
          transports: ['websocket'],
          timeout: 5000
        })

        const onlineEvent = (e: any) => {
          uni.$emit('live', {
            type: 'online',
            data: e
          })
        }
        const commentEvent = (e: any) => {
          uni.$emit('live', {
            type: 'comment',
            data: e
          })
        }
        const giftEvent = (e: any) => {
          uni.$emit('live', {
            type: 'gift',
            data: e
          })
        }
        const removeListener = () => {
          if (S) {
            S.removeListener('online', onlineEvent)
            S.removeListener('comment', commentEvent)
            S.removeListener('gift', giftEvent)
          }
        }

        S.on('connect', () => {
          console.log('socket连接成功')
          this.socket = S
          // socket.io唯一链接id，可以监控这个id实现点对点通讯
          // 如金币不足无法送礼、直播间未开通等，socket 会通过这个 id 通知
          const { id } = S
          S.on(id, (e) => {
            console.log(e)
            let res = e.data
            if (res.action === 'error') {
              let msg = res.payload
              if (e.meta.notoast) {
                return
              }
              return uni.showToast({
                title: msg,
                icon: 'none'
              })
            }
          })

          S.on('online', onlineEvent)
          S.on('comment', commentEvent)
          S.on('gift', giftEvent)
        })
        // 监听失败
        S.on('error', () => {
          removeListener()
          this.socket = null
          console.log('连接失败')
        })
        // 监听断开
        S.on('disconnect', () => {
          removeListener()
          this.socket = null
          console.log('已断开')
        })
      },
      closeSocket() {
        if (this.socket) {
          this.socket.close()
        }
      },
      login(userInfo: UserInfo) {
        this.userInfo = userInfo
        this.token = userInfo.token
        uni.setStorageSync('userInfo', JSON.stringify(userInfo))
        uni.setStorageSync('token', userInfo.token)

        this.connectSocket()
      },
      initUserInfo() {
        let userInfo = uni.getStorageSync('userInfo')
        let token = uni.getStorageSync('token')
        if (userInfo && token) {
          this.userInfo = JSON.parse(userInfo)
          this.token = token
          this.connectSocket()
        }
      },
      getUserInfo() {
        http.get<UserInfo>('/user/info', { token: true }).then((res) => {
          console.log('getUserInfo', res)
          this.userInfo = res
          uni.setStorage({
            key: 'userInfo',
            data: JSON.stringify(res)
          })
        })
      },
      logout() {
        http.post(
          '/logout',
          {},
          {
            token: true,
            toast: false
          }
        )
        this.closeSocket()
        this.userInfo = null
        this.token = ''
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
      }
    }
  }
)
