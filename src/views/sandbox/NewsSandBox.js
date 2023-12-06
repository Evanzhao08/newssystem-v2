import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NProgress from 'nprogress'
import { Layout } from 'antd'
import 'nprogress/nprogress.css'
import './NewsSandBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'

const { Content } = Layout

export default function NewsSandBox() {
  NProgress.start()

  useEffect(() => {
    NProgress.done()
  })

  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#FFFFFF',
            overflow: 'auto',
          }}>
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
