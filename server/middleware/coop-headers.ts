export default defineEventHandler((event) => {
  // 设置 Cross-Origin-Opener-Policy 为 same-origin-allow-popups
  // 这样可以允许使用 window.open 打开新窗口，同时保持安全性
  event.node.res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  
  // 同时设置 Cross-Origin-Embedder-Policy 为 require-corp（可选，如果需要）
  // 如果不需要，可以注释掉这一行
  // event.node.res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
})

