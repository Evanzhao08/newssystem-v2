import { notification } from 'antd'

export default function useNotification({ message, description, placement }) {
  return notification.info({
    message: `通知`,
    description: `您已经删除了您的新闻`,
    placement: 'bottomRight',
  })
}
