import React, { useEffect, useState } from 'react'
import NewsEditor from '../../../components/sandbox/news-manage/NewsEditor'
import { Steps, Typography, Button, Select, Form, Input, message, notification, Flex } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './News.module.css'
import axios from 'axios'
const { Title } = Typography


export default function NewsAdd (props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [form] = Form.useForm()
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")

  const { region, username, roleId } = JSON.parse(localStorage.getItem("token"))
  const handleNext = () => {
    if (current === 0) {
      form.validateFields().then(res => {
        setFormInfo(res)
        // console.log('forms', res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content === "" || (content).trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1)
      }
      console.log(formInfo, (content).trim())
    }

  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": region ? region : '全球',
      "author": username,
      "roleId": roleId,
      "auditState": auditState, // 0 草稿箱 1  审核列表
      "publishState": 0, //未发布
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      //  "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中产看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }

  useEffect(() => {
    axios.get(`/categories`).then(res => {
      setCategoryList(res.data.map(item => {
        return { value: item.id, label: item.title }
      }))
    })
  }, [])

  return <div>
    <Flex vertical={false} style={{ marginBottom: '30px' }}>
      <Button
        shape="circle"
        icon={<ArrowLeftOutlined />}
        onClick={() => props.history.goBack()}
      />
      <Title level={5} style={{ width: '25%', margin: '5px 10px' }}>
        撰写新闻
      </Title>
    </Flex>
    <Steps
      current={current}
      items={[
        {
          title: '基本信息',
          description: "新闻标题,新闻分类",
        },
        {
          title: '新闻内容',
          description: "新闻主体内容　",
          // subTitle: 'Left 00:00:08',
        },
        {
          title: '新闻提交',
          description: '保存草稿或者提交审核',
        },
      ]}
    />

    <div style={{ marginTop: "50px" }}>
      <div className={current === 0 ? '' : style.active}>
        <Form form={form}
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Select
              //defaultValue="lucy"
              // onChange={handleChange}
              options={categoryList}
            />
          </Form.Item>
        </Form>
      </div>
      <div className={current === 1 ? '' : style.active}>
        <NewsEditor getContent={(value) => {
          setContent(value)
        }}></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.active}>33333</div>
    </div>

    <div style={{ marginTop: "50px" }}>
      {
        current === 2 && <span>
          <Button type='primary' onClick={() => { handleSave(0) }}>保存草稿箱</Button>
          <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
        </span>
      }
      {
        current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
      }

      {
        current > 0 && <Button onClick={handlePrevious}>上一步</Button>
      }
    </div>
  </div>
}
