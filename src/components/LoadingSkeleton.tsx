export function LoadingSkeleton() {
    return (
        <div className="skeleton-container">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="skeleton-card" />
            ))}
        </div>
    );
}