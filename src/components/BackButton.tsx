// components/BackButton.tsx
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Importando ícone do feather icons

export function BackButton() {""
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className="back-button"
      aria-label="Voltar para página anterior"
    >
      <FiArrowLeft className="back-button-icon" />
      <span className="back-button-text">Voltar</span>
    </button>
  );
}