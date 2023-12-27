import React, { useEffect, useState } from 'react'

import { Layout, Menu } from 'antd'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SkypeOutlined,
  WifiOutlined,
  HddOutlined,
  UsbOutlined,
  DownloadOutlined,
  FileAddOutlined,
} from '@ant-design/icons'

import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

const iconList = {
  '/home': <DesktopOutlined />,
  '/user-manage': <FileOutlined />,
  '/user-manage/list': <FileOutlined />,
  '/right-manage': <PieChartOutlined />,
  '/right-manage/role/list': <PieChartOutlined />,
  '/right-manage/right/list': <FileOutlined />,
  '/news-manage': <TeamOutlined />,
  '/news-manage/add': <TeamOutlined />,
  '/news-manage/category': <UserOutlined />,
  '/news-manage/draft': <SkypeOutlined />,
  '/audit-manage': <WifiOutlined />,
  '/audit-manage/audit': <WifiOutlined />,
  '/audit-manage/list': <HddOutlined />,
  '/publish-manage': <UsbOutlined />,
  '/publish-manage/unpublished': <UsbOutlined />,
  '/publish-manage/published': <DownloadOutlined />,
  '/publish-manage/sunset': <FileAddOutlined />,
}

const { Sider } = Layout

const isToken = localStorage.getItem('token')
var useRights = {}
if (isToken) {
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))
  useRights = rights
}

const checkPagePermission = (item) => {
  return item.pagepermisson === 1 && useRights.includes(item.key)
}

function SideMenu(props) {
  const [meun, setMenu] = useState([])

  const renderSideMenu = (data) => {
    return data.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return getItem(
          item.title,
          item.key,
          iconList[item.key],
          item.children.map((item) => {
            return (
              checkPagePermission(item) &&
              getItem(item.title, item.key, iconList[item.key])
            )
          })
        )
      }
      return (
        checkPagePermission(item) &&
        getItem(item.title, item.key, iconList[item.key])
      )
    })
  }
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      const data = renderSideMenu(res.data)
      console.log(data)
      setMenu(data)
    })
  }, [setMenu])
  const onClick = (e) => {
    props.history.push(e.key)
  }

  const selectKeys = [props.location.pathname]
  const openKeys = ['/' + props.location.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="demo-logo-vertical">新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
            items={meun}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed,
})

export default connect(mapStateToProps)(withRouter(SideMenu))
