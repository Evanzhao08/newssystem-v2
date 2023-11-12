import React, { forwardRef, useState } from 'react'
import { Input, Form, Select } from 'antd'

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false)
  return (
    <Form
      form={props.form}
      ref={ref}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        modifier: 'public',
      }}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: 'Please input the title of collection!',
                },
              ]
        }>
        <Select
          //defaultValue="lucy"
          // style={{
          //   width: 120,
          // }}
          //  onChange={handleChange}
          disabled={isDisabled}
          options={[
            ...props.regionList.map((item) => {
              return { value: item.value, label: item.title }
            }),
          ]}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}>
        <Select
          onChange={(value) => {
            if (1 === value) {
              props.form.setFieldsValue({
                region: '',
              })
              setIsDisabled(true)
            } else {
              setIsDisabled(false)
            }
          }}
          options={[
            ...props.roleList.map((item) => {
              return { value: item.id, label: item.roleName }
            }),
          ]}
        />
      </Form.Item>
    </Form>
  )
})

export default UserForm
