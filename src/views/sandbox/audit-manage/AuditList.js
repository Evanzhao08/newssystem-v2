import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
const { confirm } = Modal
const colorList = ['', 'orange', 'green', 'red']
const auditList = ['草稿箱', "审核中", "已通过", "未通过"]
export default function AuditList () {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
      console.log(res.data)
    })
  }, [username])
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
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId)
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      console.log('list=>', list)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },

    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger>发布</Button>
          </div>
        )
      },
    },
  ]
  return <div> <Table
    dataSource={dataSource}
    columns={columns}
    pagination={{
      pageSize: 5,
    }}
    rowKey={item => item.id}
  /></div>
}
