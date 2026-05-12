import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { member } = useAuth()

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-white via-yellow-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-3 animate-fade-in">
            Welcome to Digital Library
          </h1>
          <p className="text-xl text-gray-700 animate-fade-in-delay">
            Hello, <span className="font-semibold text-yellow-600">{member?.name}</span>! 
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Total Books</h3>
              <p className="text-4xl font-bold text-yellow-600">1,245</p>
              <p className="text-sm text-gray-600 mt-2">In our collection</p>
            </div>
          </div>

          <div className="group">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="text-5xl mb-4">✋</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Books Issued</h3>
              <p className="text-4xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600 mt-2">Currently with you</p>
            </div>
          </div>

          <div className="group">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Due Soon</h3>
              <p className="text-4xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600 mt-2">Pending returns</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-yellow-200 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Library Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group flex items-start gap-4 p-6 rounded-xl hover:bg-yellow-50 transition-colors duration-300">
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Browse Books</h3>
                <p className="text-gray-600 mt-1">Explore our vast collection of books across various categories</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-6 rounded-xl hover:bg-yellow-50 transition-colors duration-300">
              <div className="text-4xl">📖</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Issue Books</h3>
                <p className="text-gray-600 mt-1">Request and issue books from the library easily</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-6 rounded-xl hover:bg-yellow-50 transition-colors duration-300">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Track Transactions</h3>
                <p className="text-gray-600 mt-1">Monitor your borrowing history and fines</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-6 rounded-xl hover:bg-yellow-50 transition-colors duration-300">
              <div className="text-4xl">🔔</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">Get Notifications</h3>
                <p className="text-gray-600 mt-1">Receive reminders for due dates and new arrivals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
