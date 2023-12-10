import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Table, Form, Modal, Switch } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/sandbox/user-manage/UserForm'

const { confirm } = Modal
export default function UserList () {
  const [dataSource, setDataSource] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdate, setIsUpdateOpen] = useState(false)

  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)

  const addForm = useRef(null)
  const [form] = Form.useForm()
  const [updateForm] = Form.useForm()

  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

  const roleObj = useMemo(() => {
    return {
      "1": "superadmin",
      "2": "admin",
      "3": "editer"
    }
  }, [])
  useEffect(() => {
    axios.get('/users?_expand=role').then((res) => {
      const list = res.data
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[roleId] === 'editer')
      ])
    })
  }, [roleId, region, username, roleObj])
  useEffect(() => {
    axios.get('/roles').then((res) => {
      const list = res.data
      console.log('roleList', list)
      setRoleList(list)
    })
  }, [])
  useEffect(() => {
    axios.get('/regions').then((res) => {
      const list = res.data
      setRegionList(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
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
              onClick={() => handleUpdate(item)}
            />
          </div>
        )
      },
    },
  ]

  const handleUpdate = (item) => {
    setTimeout(() => {
      setIsUpdateOpen(true)
      if (item.roleId === 1) {
        //禁用
        setIsUpdateDisabled(true)
      } else {
        //取消禁用
        setIsUpdateDisabled(false)
      }
      updateForm.setFieldsValue(item)
    }, 0)
    setCurrent(item)
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
    // console.log(item)
    // 当前页面同步状态 + 后端同步

    setDataSource(dataSource.filter((data) => data.id !== item.id))

    axios.delete(`/users/${item.id}`)
  }

  const onCreate = (values) => {
    axios
      .post(`/users`, {
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

  const updateFormOk = () => {
    updateForm.validateFields().then((values) => {
      setIsUpdateOpen(false)
      form.resetFields()
      //  onCreate(values)
      setDataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...values,
              role: roleList.filter((data) => data.id === values.roleId)[0],
            }
          }
          return item
        })
      )
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`, values)
    })
    // .catch((info) => {
    //   console.log('Validate Failed:', info)
    // })
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
              setIsOpen(false)
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

      <Modal
        open={isUpdate}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          updateFormOk()
        }}>
        <UserForm
          roleList={roleList}
          regionList={regionList}
          form={updateForm}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  )
}
