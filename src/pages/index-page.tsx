import { Link } from '@tanstack/react-router'


export const IndexPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Brute Force Games</h1>
      <p className="text-gray-600 mb-4">Start a lobby to play with your friends!</p>
      <Link to="/new-lobby" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Lobby
      </Link>
    </div>
  )
}
