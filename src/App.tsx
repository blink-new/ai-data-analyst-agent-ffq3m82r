import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Dashboard } from './components/Dashboard'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) return <LoadingScreen />
  if (!user) return <div className="flex items-center justify-center min-h-screen">Please sign in</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard user={user} />
    </div>
  )
}

export default App