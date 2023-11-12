import React, { useEffect, useRef, useState } from 'react'
import { Button, Table, Form, Modal, Switch } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/sandbox/user-manage/UserForm'

const { confirm } = Modal
export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const addForm = useRef(null)
  const [form] = Form.useForm()
  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then((res) => {
      const list = res.data
      setDataSource(list)
    })
  }, [])
  useEffect(() => {
    axios.get(' http://localhost:5000/roles').then((res) => {
      const list = res.data
      console.log('roleList', list)
      setRoleList(list)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/regions').then((res) => {
      const list = res.data
      setRegionList(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            //  onChange={() => switchMethod(item)}
          ></Switch>
        )
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
              disabled={item.default}
              onClick={() => confirmMethod(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
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
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
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
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId)
      list[0].children = list[0].children.filter((data) => data.id !== item.id)
      console.log('list=>', list)
      setDataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  const onCreate = (values) => {
    console.log('Received values of form: ', values)
    setIsOpen(false)
    axios
      .post(`http://localhost:5000/users`, {
        ...values,
        roleState: true,
        default: false,
      })
      .then((res) => {
        console.log(res.data)
        setDataSource([
          ...dataSource,
          {
            ...res.data,
            role: roleList.filter((item) => item.id === values.roleId)[0],
          },
        ])
      })
  }

  return (
    <div>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />

      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsOpen(false)
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              onCreate(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })

          // addForm.current
          //   .validateFields()
          //   .then((value) => {
          //     console.log(value)
          //   })
          //   .catch((err) => {
          //     console.log(err)
          //   })
        }}>
        <UserForm
          roleList={roleList}
          regionList={regionList}
          form={form}
          ref={addForm}></UserForm>
      </Modal>
    </div>
  )
}
