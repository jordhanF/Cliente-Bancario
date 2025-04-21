// components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loading-text">Carregando dados...</p>
    </div>
  );
}