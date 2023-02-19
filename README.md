# uni-vue3-live

## 疑难杂症

- nvue flex 布局默认为 column，vue flex 布局默认为 row
- uni-app 有新版本发布，请执行 `npx @dcloudio/uvm alpha` 更新，更新日志详见：`https://update.dcloud.net.cn/hbuilderx/changelog/3.7.1.20230210-alpha.html`
  - 记得执行更新，不然 app 端会有些问题，如图片尺寸不对
- `f-danmu.vue` 文件中，使用 `rich-text` 替代两个 `text` 使得用户名和用户评论能够在一行且自动换行
- "@hyoga/uni-socket.io": "1.0" 注意版本，版本 3 连接不成功

## 思路

- 发送礼物，触发 socket，获取到数据 data，通过 f-gift 组件中的 send 方法弹出送礼特效
- 整个 socket 的逻辑放在了 Pinia 中，页面使用 Pinia 中的 socket 进行 emit 等操作
- pinia 中通过 socket.on('comment', commentEvent) 监听 comment 事件，commentEvent 中通过 `uni.$emit('live', {type:'comment', data:e})` 触发 live 事件并传数据，live.nvue 中通过 `uni.$on('live'， handleLiveEvent)` 获取数据进行操作
