/**
 * Error page component that displays a generic or specific error message based on the 'error' query parameter.
 * If no 'error' parameter is provided, it shows a default error message.
 * Includes buttons to navigate home or reload the page.
 *
 * @returns {JSX.Element} The rendered error page.
 */
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Error: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const errorParam = searchParams.get('error')
  const errorMessage = errorParam ? decodeURIComponent(errorParam) : 'Something went wrong. Please try again.'

  const handleGoHome = () => {
    navigate('/')
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <main
      id="error-wrapper"
      style={{
        padding: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <section style={{ marginBottom: '2rem', maxWidth: '600px' }}>
        <h1 style={{ color: 'var(--risk-high)', marginBottom: '1rem' }}>Error</h1>
        <p style={{ color: '#6c757d', lineHeight: '1.5', fontSize: '1.1rem' }}>
          {errorMessage}
        </p>
      </section>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="main-button"
          onClick={handleGoHome}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          Go Home
        </button>
        <button
          className="main-button"
          onClick={handleReload}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          Reload Page
        </button>
      </div>
    </main>
  )
}

export default Error