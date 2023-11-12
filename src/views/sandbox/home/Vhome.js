import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default function Vhome () {
  const ajax = () => {
    axios.get("http://localhost:5000/categories").then(res => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <Button type="primary" onClick={ajax}>Button</Button>
    </div>
  )
}
