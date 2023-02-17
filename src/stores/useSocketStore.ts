import { defineStore } from 'pinia'
import io from '@hyoga/uni-socket.io'
import $C from '@/common/config'

interface State {
  socket: any
}
interface Actions {
  closeSocket: () => void
  connectSocket: () => void
}

export const useSocketStore = defineStore<string, State, {}, Actions>(
  'socket',
  {
    state: () => {
      return {
        socket: null
      }
    },
    actions: {
      // 只 connect 一次
      connectSocket() {
        console.log('----------------')
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
      }
    }
  }
)
