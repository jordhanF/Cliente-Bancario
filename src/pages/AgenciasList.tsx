import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAgencias } from '../services/api';
import { Agencia } from '../types/data';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

export default function AgenciasList() {
    const [agencias, setAgencias] = useState<Agencia[]>([]);
    const [filteredAgencias, setFilteredAgencias] = useState<Agencia[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAgencias();
                setAgencias(data);
                setFilteredAgencias(data);
            } catch (err) {
                console.error("Erro ao carregar agências:", err);
                setError("Falha ao carregar agências. Tente recarregar a página.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (term: string) => {
        if (!term.trim()) {
            setFilteredAgencias(agencias);
            setCurrentPage(1);
            return;
        }

        const searchTerm = term.toLowerCase();
        const filtered = agencias.filter(agencia => {
            const nome = agencia.nome?.toLowerCase() || '';
            const endereco = agencia.endereco?.toLowerCase() || '';
            const codigo = agencia.codigo?.toString() || '';
            return nome.includes(searchTerm) || 
                   endereco.includes(searchTerm) || 
                   codigo.includes(searchTerm);
        });

        setFilteredAgencias(filtered);
        setCurrentPage(1);
    };

    // Calcular agências para a página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAgencias.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="agencias-list-container">
            <h1>Lista de Agências</h1>
            
            <div className="search-container">
                <SearchBar onSearch={handleSearch} />
            </div>
            
            {filteredAgencias.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhuma agência encontrada</p>
                </div>
            ) : (
                <>
                    <div className="agencias-grid">
                        {currentItems.map(agencia => (
                            <div 
                                key={`agencia-${agencia.id}`}
                                className="agencia-card" 
                                onClick={() => navigate(`/agencia/${agencia.id}`)}
                            >
                                <h3>{agencia.nome}</h3>
                                <p><strong>Código:</strong> {agencia.codigo}</p>
                                <p><strong>Endereço:</strong> {agencia.endereco}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pagination-container">
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={filteredAgencias.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}