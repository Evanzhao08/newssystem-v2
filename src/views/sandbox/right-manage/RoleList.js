import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

export default function RoleList () {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    console.log(currentRights.checked)
    setIsModalOpen(false)
    //同步datasource
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return { ...item, rights: currentRights }
        }
        return item
      })
    )
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights.checked,
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/rights?_embed=children`).then((res) => {
      console.log(res.data)
      setRightList(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
              type="primary"
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => {
                showModal()
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
            />
          </div>
        )
      },
    },
  ]

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }
  const onCheck = (checkedKeys, info) => {
    setCurrentRights(checkedKeys)
  }
  function confirmMethod (item) {
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
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}></Table>

      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Tree
          checkable
          // defaultExpandedKeys={['0-0-0', '0-0-1']}
          // defaultSelectedKeys={['0-0-0', '0-0-1']}
          checkedKeys={currentRights}
          onSelect={onSelect}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
