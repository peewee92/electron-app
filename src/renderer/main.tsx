import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@renderer/router'
import { ConfigProvider } from 'antd'
// 全局样式
import '@renderer/common/styles/frame.less'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <ConfigProvider>
        <RouterProvider router={globalRouters} />
    </ConfigProvider>
)
