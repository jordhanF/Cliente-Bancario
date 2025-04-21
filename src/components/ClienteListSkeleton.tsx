// components/ClienteListSkeleton.tsx
export function ClienteListSkeleton() {
  return (
    <div className="cliente-list-skeleton">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="cliente-card-skeleton">
          <div className="skeleton-line name"></div>
          <div className="skeleton-line cpf"></div>
          <div className="skeleton-line email"></div>
        </div>
      ))}
    </div>
  );
}