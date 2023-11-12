import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
export default function RightList () {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      const list = res.data
      list.forEach(el => {
        if (el.children.length === 0) {
          el.children = ""
        }
      })
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="#f50">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />

          <Popover content={<div style={{ textAlign: 'center' }} >
            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
          </div>} title="配置项" trigger="click" >
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    }
  ]
  function switchMethod (item) {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, { pagepermisson: item.pagepermisson })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, { pagepermisson: item.pagepermisson })
    }
  }

  const confirmMethod = (item) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk () {
        deleteMethod(item)
      },
      onCancel () {
        console.log('Cancel')
      },
    })
  }
  //删除
  const deleteMethod = (item) => {
    console.log(item)
    //当前页面同步状态+后端同步
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      console.log('list=>', list)
      setDataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }
  return <div><Table dataSource={dataSource} columns={columns} pagination={{
    pageSize: 5
  }} /></div>
}
