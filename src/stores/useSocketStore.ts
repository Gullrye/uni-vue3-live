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
        S.on('connect', (res) => {
          this.socket = S
          console.log('socket连接成功')
          S.on('comment', (e) => {
            console.log('ggggggggggggg')
          })
        })
        // 监听失败
        S.on('error', () => {
          this.socket = null
          console.log('连接失败')
        })
        // 监听断开
        S.on('disconnect', () => {
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
      }
    }
  }
)
