import { useEffect, useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function Loans() {
  const [activeLoans, setActiveLoans] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active') // 'active' or 'history'

  useEffect(() => {
    fetchLoans()
  }, [tab])

  const fetchLoans = async () => {
    setLoading(true)
    try {
      if (tab === 'active') {
        const { data } = await api.get('/transactions/my-active')
        setActiveLoans(data.transactions || [])
      } else {
        const { data } = await api.get('/transactions')
        setAllTransactions(data.transactions || [])
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch loans')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (transactionId) => {
    try {
      await api.post(`/transactions/return/${transactionId}`)
      toast.success('Book returned successfully!')
      fetchLoans()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book')
    }
  }

  const isOverdue = (dueDate) => new Date(dueDate) < new Date()
  const daysUntilDue = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  }

  const loans = tab === 'active' ? activeLoans : allTransactions

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-white via-yellow-50 to-white pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-2">
            📖 Issue & Return
          </h1>
          <p className="text-gray-600">Manage your book loans</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              tab === 'active'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-yellow-200 hover:border-yellow-400'
            }`}
          >
            Active Loans ({activeLoans.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              tab === 'history'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-yellow-200 hover:border-yellow-400'
            }`}
          >
            History
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Loading loans...</p>
            </div>
          </div>
        )}

        {/* Loans List */}
        {!loading && loans.length > 0 ? (
          <div className="space-y-4">
            {loans.map((loan) => {
              const overdue = tab === 'active' && isOverdue(loan.dueDate)
              const daysLeft = tab === 'active' ? daysUntilDue(loan.dueDate) : null

              return (
                <div
                  key={loan._id}
                  className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
                    overdue ? 'border-red-400 bg-red-50' : 'border-yellow-100 hover:border-yellow-400'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Book Title */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Book</p>
                      <p className="font-semibold text-gray-800">{loan.bookId?.title || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">by {loan.bookId?.author || 'Unknown'}</p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                      {tab === 'active' && (
                        <p className={`text-sm font-bold mt-1 ${overdue ? 'text-red-600' : 'text-green-600'}`}>
                          {overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </p>
                      )}
                    </div>

                    {/* Fine */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fine</p>
                      <p className={`font-bold text-lg ${loan.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{loan.fine || '0'}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      {tab === 'active' && !loan.returnDate && (
                        <button
                          onClick={() => handleReturn(loan._id)}
                          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                          ↩️ Return
                        </button>
                      )}
                      {loan.returnDate && (
                        <div className="text-sm">
                          <p className="text-gray-600">Returned</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(loan.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-semibold">
              {tab === 'active' ? 'No active loans' : 'No transaction history'}
            </p>
            <p className="text-gray-500 mt-2">
              {tab === 'active' ? 'Visit Books to issue new books' : 'Your borrowed books will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
