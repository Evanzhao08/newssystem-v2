import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import ParticlesBg from 'particles-bg'

import './Login.css'
import axios from 'axios'
let config = {
  num: [4, 7],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  alpha: [0.6, 0],
  scale: [0.1, 0.4],
  position: 'all',
  color: ['random', '#ff0000'],
  cross: 'dead',
  // emitter: "follow",
  random: 15,
}

if (Math.random() > 0.85) {
  config = Object.assign(config, {
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath()
      ctx.rect(
        particle.p.x,
        particle.p.y,
        particle.radius * 2,
        particle.radius * 2
      )
      ctx.fillStyle = particle.color
      ctx.fill()
      ctx.closePath()
    },
  })
}

export default function Login(props) {
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
    axios
      .get(
        `http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        console.log('login', res.data)
        if (res.data.length === 0) {
          message.error('用户吗或密码不匹配')
        } else {
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          props.history.push('/')
        }
      })
  }
  return (
    <div
      style={{
        background: 'rgb(35,39,65,0.0)',
        height: '100vh',
        overflow: 'hidden',
      }}>
      <div className="formContainer">
        <div className="loginTitle">全球新闻发布管理系统</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ParticlesBg type="custom" config={config} bg={true} />
    </div>
  )
}
