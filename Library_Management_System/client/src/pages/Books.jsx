import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [searchQuery, filterCategory])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      let url = '/books'
      if (searchQuery) {
        url = `/books/search?q=${encodeURIComponent(searchQuery)}`
      } else if (filterCategory) {
        url = `/books?category=${encodeURIComponent(filterCategory)}`
      }
      const { data } = await api.get(url)
      setBooks(data.books || [])
      
      // Extract unique categories
      const uniqueCategories = [...new Set((data.books || []).map(b => b.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleIssue = async (bookId) => {
    try {
      await api.post('/transactions/issue', {
        bookId,
        daysToIssue: 14,
      })
      toast.success('Book issued successfully!')
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book')
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-white via-yellow-50 to-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-2">
            📚 Browse Books
          </h1>
          <p className="text-gray-600">Discover and issue books from our collection</p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="group">
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Loading books...</p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-yellow-100 hover:border-yellow-400 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Book Header */}
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 h-32 flex flex-col justify-between">
                  <div className="text-4xl">📖</div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{book.title}</h3>
                </div>

                {/* Book Content */}
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-1">by <span className="font-semibold text-yellow-600">{book.author}</span></p>
                  <p className="text-xs text-gray-500 mb-3">Category: <span className="font-semibold">{book.category}</span></p>
                  <p className="text-xs text-gray-500 mb-4">ISBN: {book.isbn}</p>
                  
                  {book.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                  )}

                  {/* Availability */}
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm">
                      <span className="font-semibold text-yellow-600">{book.availableCopies}</span>
                      <span className="text-gray-600"> / {book.totalCopies} available</span>
                    </p>
                  </div>

                  {/* Issue Button */}
                  <button
                    onClick={() => handleIssue(book._id)}
                    disabled={book.availableCopies === 0}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 transform ${
                      book.availableCopies > 0
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 active:scale-95'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {book.availableCopies > 0 ? '✋ Issue Book' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-semibold">No books found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
