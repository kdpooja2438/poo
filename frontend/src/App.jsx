import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:8080'

function App() {
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Backend responded with status ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setRooms(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="app">
      <h1>Hotel Management — Rooms</h1>

      {loading && <p>Loading rooms from backend...</p>}
      {error && <p className="error">Could not reach backend: {error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.roomNumber}</td>
                <td>{room.type}</td>
                <td>{room.available ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default App
