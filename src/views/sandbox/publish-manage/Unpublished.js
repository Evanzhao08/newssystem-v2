import { Button } from 'antd'
import NewsPublish from '../../../components/sandbox/publish-manage/NewsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Unpublished() {
  // 1=== 待发布
  const { dataSource, handlePublish } = usePublish(1)
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handlePublish(id)}>
            发布
          </Button>
        )}></NewsPublish>
    </div>
  )
}
