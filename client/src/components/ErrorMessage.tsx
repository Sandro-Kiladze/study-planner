import React from 'react';

interface ErrorMessageProps {
  error: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  showRetry = true 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Something went wrong</h3>
        <p className="error-message">{errorMessage}</p>
        {showRetry && onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;