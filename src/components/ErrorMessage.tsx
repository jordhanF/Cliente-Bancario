interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="error-container">
            <div className="error-icon">!</div>
            <p>{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    Tentar Novamente
                </button>
            )}
        </div>
    );
}