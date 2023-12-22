import React from 'react'
import { Avatar, Layout, Button, Dropdown } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout
function TopHeader(props) {
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: roleName,
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ]
  const handleMenuClick = (e) => {
    if (e.key === '2') {
      localStorage.removeItem('token')
      props.history.replace('/login')
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
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={props.changeCollapsed}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来
        </span>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
/**
 * mapStateToProps
 * mapDispatchToProps
 * connect(mapStateToProps,mapDispatchToProps)(被包装组件)
 */
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed',
    }
  },
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader))
