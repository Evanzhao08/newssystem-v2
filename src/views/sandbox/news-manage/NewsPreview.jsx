import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Descriptions, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import axios from 'axios'

const NewsPreview = (props) => {
  const [newsInfo, setNewsInfo] = useState(null)
  // const [author, createTime, region, publishState, star, view] = newsInfo
  const auditMapping = ['未审核', '审核中', '已通过', '未通过']
  const publishMapping = ['未发布', '待发布', '已上线', '已下线']
  const items = [
    {
      key: '1',
      label: '创建者',
      children: newsInfo?.author,
    },
    {
      key: '2',
      label: '创建时间',
      children: moment(newsInfo?.createTime).format('YYYY-MM-DD HH:MM:SS'),
    },
    {
      key: '3',
      label: '发布时间',
      children: newsInfo?.publishTime
        ? moment(newsInfo?.publishTime).format('YYYY-MM-DD HH:MM:SS')
        : '-',
    },
    {
      key: '4',
      label: '区域',
      children: newsInfo?.region,
    },
    {
      key: '5',
      label: '审核状态',
      contentStyle: { color: 'red' },
      children: auditMapping[newsInfo?.auditState],
    },
    {
      key: '6',
      label: '发布状态',
      contentStyle: { color: 'red' },
      children: publishMapping[newsInfo?.publishState],
    },
    {
      key: '7',
      label: '访问数量',
      children: newsInfo?.view,
    },
    {
      key: '8',
      label: '点赞数量',
      children: newsInfo?.star,
    },
    {
      key: '9',
      label: '评论数量',
      children: '1000',
    },
    {
      key: '10',
      //  label: 'Config Info',
      // span: 3,

      children: (
        <div
          dangerouslySetInnerHTML={{ __html: newsInfo?.content }}
          style={{ border: '1px solid gray', width: '100%' }}></div>
      ),
    },
  ]
  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo(res.data)
        console.log('newsInfo', res.data)
      })
  }, [props.match.params.id])
  return (
    newsInfo && (
      <Descriptions
        extra={
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => props.history.goBack()}
          />
        }
        title={newsInfo?.title}
        items={items}
      />
    )
  )
}
export default NewsPreview
