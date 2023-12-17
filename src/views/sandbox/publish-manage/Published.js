import { Button } from 'antd'
import NewsPublish from '../../../components/sandbox/publish-manage/NewsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Published() {
  // 2 === 已发布
  const { dataSource, handleSunset } = usePublish(2)
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button danger onClick={() => handleSunset(id)}>
            下线
          </Button>
        )}></NewsPublish>
    </div>
  )
}
