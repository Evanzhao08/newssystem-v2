import React, { useState } from 'react'
import { Avatar, Layout, Button, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
const { Header } = Layout
// const {
//   token: { colorBgContainer },
// } = theme.useToken()




export default withRouter(function TopHeader (props) {
  const [collapsed, setCollapsed] = useState(false)

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: roleName
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ]
  const handleMenuClick = (e) => {
    if (e.key === '2') {
      localStorage.removeItem("token")
      props.history.replace("/login")
    }
  }
  return (
    <Header
      style={{
        padding: 0,
        background: '#FFF',
      }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick
          }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
) 