'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary to prevent entire page crashes from component errors.
 * Catches rendering errors and displays a user-friendly fallback UI.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    // TODO: Send to error tracking service (e.g., Sentry)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem',
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', margin: 0, maxWidth: '400px' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ddd',
              background: '#f5f5f5',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
