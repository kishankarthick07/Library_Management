import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Admin() {
  const { isAdmin } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    totalCopies: '',
    availableCopies: '',
    description: '',
  })

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/books')
      setBooks(data.books || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, formData)
        toast.success('Book updated successfully!')
      } else {
        await api.post('/books', formData)
        toast.success('Book added successfully!')
      }
      setFormData({
        title: '',
        author: '',
        category: '',
        isbn: '',
        totalCopies: '',
        availableCopies: '',
        description: '',
      })
      setEditingId(null)
      setShowForm(false)
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book')
    }
  }

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description,
    })
    setEditingId(book._id)
    setShowForm(true)
  }

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return
    try {
      await api.delete(`/books/${bookId}`)
      toast.success('Book deleted successfully!')
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book')
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-white via-yellow-50 to-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-2">
              ⚙️ Admin Panel
            </h1>
            <p className="text-gray-600">Manage books and library operations</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              if (showForm) {
                setFormData({
                  title: '',
                  author: '',
                  category: '',
                  isbn: '',
                  totalCopies: '',
                  availableCopies: '',
                  description: '',
                })
              }
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {showForm ? '✕ Close' : '+ Add Book'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-yellow-200 mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Copies *</label>
                <input
                  type="number"
                  required
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Copies *</label>
                <input
                  type="number"
                  required
                  value={formData.availableCopies}
                  onChange={(e) => setFormData({ ...formData, availableCopies: e.target.value })}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {editingId ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      title: '',
                      author: '',
                      category: '',
                      isbn: '',
                      totalCopies: '',
                      availableCopies: '',
                      description: '',
                    })
                  }}
                  className="flex-1 py-3 rounded-xl bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Loading books...</p>
            </div>
          </div>
        )}

        {/* Books Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-b-2 border-yellow-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ISBN</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Copies</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Available</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="border-b border-yellow-100 hover:bg-yellow-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{book.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{book.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">{book.isbn}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-center text-gray-800">
                      {book.totalCopies}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          book.availableCopies > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors duration-200 inline-block"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors duration-200 inline-block"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 font-semibold">No books yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
