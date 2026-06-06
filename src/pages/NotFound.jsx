import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Page Not Found</h2>
        <p style={{ marginBottom: '1.5rem' }}>We couldn't find the page you're looking for.</p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Go to Login
          </button>

          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', cursor: 'pointer', background: '#fff' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
