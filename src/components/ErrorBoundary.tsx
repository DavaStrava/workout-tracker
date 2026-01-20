import React, { Component, type ReactNode } from 'react';
import { Button } from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        background: 'linear-gradient(135deg, #1a1625 0%, #1e1b4b 100%)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            padding: '32px',
                            borderRadius: '24px',
                            background: 'rgba(30, 27, 50, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                            }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#fff',
                                marginBottom: '12px',
                            }}
                        >
                            Something went wrong
                        </h2>
                        <p
                            style={{
                                fontSize: '15px',
                                color: 'rgba(255, 255, 255, 0.6)',
                                marginBottom: '24px',
                                lineHeight: 1.5,
                            }}
                        >
                            We encountered an unexpected error. Please try again or refresh the page.
                        </p>
                        {this.state.error && import.meta.env.DEV && (
                            <details
                                style={{
                                    marginBottom: '24px',
                                    textAlign: 'left',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                }}
                            >
                                <summary
                                    style={{
                                        fontSize: '13px',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        cursor: 'pointer',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Error details (development only)
                                </summary>
                                <pre
                                    style={{
                                        fontSize: '12px',
                                        color: '#ef4444',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        margin: 0,
                                    }}
                                >
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Button variant="secondary" onClick={this.handleReset}>
                                Try Again
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
