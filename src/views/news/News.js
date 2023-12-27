import axios from 'axios'
import React, { useEffect } from 'react'

export default function News() {
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      console.log(res.data)
    })
  }, [])
  return <div>News</div>
}
