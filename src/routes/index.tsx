import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  ssr: false, // Disable SSR for this route
  component: IndexPage,
})

function IndexPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Brute Force Games</h1>
      <p className="text-gray-600 mb-4">Choose a game to play!</p>
      <Link to="/new-table" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Game Table
      </Link>
    </div>
  )
}
