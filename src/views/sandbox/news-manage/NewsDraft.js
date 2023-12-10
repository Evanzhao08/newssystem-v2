import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, notification } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  VerticalAlignTopOutlined
} from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

export default function NewsDraft (props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
      const list = res.data
      // list.forEach((el) => {
      //   if (el.children.length === 0) {
      //     el.children = ''
      //   }
      // })
      console.log("newsDraft", res.data)
      setDataSource(list)
    })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render (title, item) {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render (category) {
        return category.title
      },
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />

            <Button
              // type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            // disabled={item.pagepermisson === undefined}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        )
      },
    },
  ]


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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  function handleCheck (id) {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push(
        '/audit-manage/list'
      )
      notification.info({
        message: `通知`,
        description: `您可以到审核列表中产看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
