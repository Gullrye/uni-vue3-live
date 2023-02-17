/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@hyoga/uni-socket.io' {
  interface Socket {
    on: (event: string, callback: (data: any) => void) => void
    emit: (event: string, data: any) => void
  }
  export default function io(url: string, options?: any): Socket
}

interface UserInfo {
  created_time: string
  id: number
  username: string
  avatar: string
  coin: number
  updated_time: string
  token: string
}
