import React from 'react';
import { createHashRouter, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@renderer/pages/login'
import Home from '@renderer/pages/home'

// 全局路由
export const globalRouters = createHashRouter([
    // 对精确匹配"/login"，跳转Login页面
    {
        path: '/login',
        element: <Login />
    },
    // 精确匹配"/home"，跳转Home页面
    {
        path: '/home',
        element: <Home />
    },
    // 如果URL没有"#路由"，跳转Login页面
    {
        path: '/',
        element: <Login />
    },
    // 未匹配，，跳转Login页面
    {
        path: '*',
        element: <Navigate to="/login" />
    }
])