import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// 全局样式
import '@renderer/common/styles/frame.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
