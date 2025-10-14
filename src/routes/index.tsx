import { createFileRoute } from '@tanstack/react-router'
import { IndexPage } from '~/site-pages/index-page'


export const Route = createFileRoute('/')({
  ssr: false,
  component: IndexPage,
})
