import React, { useRef, useState } from 'react'
import { Avatar, Card, Col, Row, List, Drawer } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import * as echarts from 'echarts'
import _ from 'lodash'
import { useEffect } from 'react'
import axios from 'axios'

const { Meta } = Card
export default function Vhome() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
      )
      .then((res) => {
        setViewList(res.data)
      })
  }, [])
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
      )
      .then((res) => {
        setStarList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title))
      setAllList(res.data)
    })
    return () => {
      window.resize = null
    }
  }, [])
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
        itemWidth: 15,
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {},
      series: [
        {
          name: '数量',
          type: 'bar',
          barMaxWidth: 60,
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize = () => {
      // console.log('onresize')
      myChart.resize()
    }
  }
  const renderPieView = (obj) => {
    //数据处理工作
    var currentList = allList.filter((item) => item.author === username)

    var groupObj = _.groupBy(currentList, (item) => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({ name: i, value: groupObj[i].length })
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart
    if (!myChart) {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }

    // 指定图表的配置项和数据
    var option
    option = {
      title: {
        text: '当前用户分类图示',
        subtext: '纯属虚构',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
        align: 'auto',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: list,
        },
      ],
    }

    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option)
    window.onresize = () => {
      // console.log('onresize')
      myChart.resize()
    }
  }
  const {
    role: { roleName },
    region,
    username,
  } = JSON.parse(localStorage.getItem('token'))
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多<BarChartOutlined />" bordered>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={showDrawer} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}>
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '20px' }}> {roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        onClose={onClose}
        afterOpenChange={renderPieView}
        open={open}>
        <div
          ref={pieRef}
          style={{
            width: '100%',
            height: '400px',
            marginTop: '30px',
          }}></div>
      </Drawer>

      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '400px',
          marginTop: '30px',
        }}></div>
    </div>
  )
}
