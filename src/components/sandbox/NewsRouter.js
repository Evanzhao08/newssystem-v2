import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Vhome from '../../views/sandbox/home/Vhome'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'

const LocalRouterMap = {
  '/home': Vhome,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  '/news-manage/update/:id': NewsUpdate,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset,
}

export default function NewsRouter () {
  const [BackRouteList, setBackRoutelist] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children'),
    ]).then((res) => {
      setBackRoutelist([...res[0].data, ...res[1].data])
      //  console.log('用户列表 BackRouteList==>', [...res[0].data, ...res[1].data])
    })
  }, [])

  function checkRoute (item) {
    //
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'))
  const checkUserPermission = (item) => {
    // 当前登录用户的权限列表
    return rights.includes(item.key)
    // return true
  }

  return (
    <Switch>
      {BackRouteList.map((item) => {
        if (checkRoute(item) && checkUserPermission(item)) {
          return (
            <Route
              path={item.key}
              component={LocalRouterMap[item.key]}
              key={item.key}
              exact
            />
          )
        }
        return null
      })}
      <Redirect from="/" to="/home" exact />

      {BackRouteList.length > 0 && (
        <Route path="*" component={NoPermission} exact />
      )}
    </Switch>
  )
}
