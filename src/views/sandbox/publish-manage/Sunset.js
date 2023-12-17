import NewsPublish from '../../../components/sandbox/publish-manage/NewsPublish'
import usePublish from '../../../hooks/usePublish'
import { Button } from 'antd'

export default function Sunset() {
  // 2 === 已发布
  const { dataSource, handleDelete } = usePublish(3)
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button danger onClick={() => handleDelete(id)}>
            删除
          </Button>
        )}></NewsPublish>
    </div>
  )
}
