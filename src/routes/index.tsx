import { createFileRoute } from '@tanstack/react-router'
import { IndexPage } from '~/site-pages/index-page'


const IndexRoute = () => {
  return <IndexPage />
}


export const Route = createFileRoute('/')({
  ssr: false,
  component: IndexRoute,
})
