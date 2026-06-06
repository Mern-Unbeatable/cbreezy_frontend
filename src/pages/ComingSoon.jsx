

import { useLocation } from 'react-router-dom'

const formatPageName = (pathSegment) => {
  if (!pathSegment) return 'This Page'
  return pathSegment
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const ComingSoon = () => {
  const { pathname } = useLocation()
  const lastSegment = pathname.split('/').filter(Boolean).pop() || ''
  const pageName = formatPageName(lastSegment)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Coming Soon</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>{pageName}</h2>
        <p style={{ marginBottom: '1.5rem' }}>This page is currently under development.</p>
      </div>
    </div>
  )
}

export default ComingSoon
