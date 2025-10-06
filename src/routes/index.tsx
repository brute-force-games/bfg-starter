import { createFileRoute } from '@tanstack/react-router'
import { IndexPage } from '~/pages/index-page'


export const Route = createFileRoute('/')({
  ssr: false,
  component: IndexPage,
})
