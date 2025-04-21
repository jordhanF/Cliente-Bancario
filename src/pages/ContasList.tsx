import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchContas } from '../services/api';
import { Conta } from '../types/data';
import {LoadingSpinner} from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

export default function ContasList() {
    const [contas, setContas] = useState<Conta[]>([]);
    const [filteredContas, setFilteredContas] = useState<Conta[]>([]);
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
                const data = await fetchContas();
                setContas(data);
                setFilteredContas(data);
            } catch (err) {
                console.error("Erro ao carregar contas:", err);
                setError("Falha ao carregar contas. Tente recarregar a página.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (term: string) => {
        if (!term.trim()) {
            setFilteredContas(contas);
            setCurrentPage(1);
            return;
        }

        const searchTerm = term.toLowerCase();
        const filtered = contas.filter(conta => {
            const cpfCnpj = conta.cpfCnpjCliente?.toLowerCase() || '';
            const tipo = conta.tipo?.toLowerCase() || '';
            return cpfCnpj.includes(searchTerm) || tipo.includes(searchTerm);
        });

        setFilteredContas(filtered);
        setCurrentPage(1);
    };

    // Calcular contas para a página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredContas.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="contas-list-container">
            <h1>Lista de Contas Bancárias</h1>
            
            <div className="search-container">
                <SearchBar onSearch={handleSearch} />
            </div>
            
            {filteredContas.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhuma conta encontrada</p>
                </div>
            ) : (
                <>
                    <div className="contas-grid">
                        {currentItems.map(conta => (
                            <div 
                                key={`conta-${conta.id}`}
                                className="conta-card" 
                                onClick={() => navigate(`/conta/${conta.id}`)}
                            >
                                <h3>Conta {conta.tipo === 'corrente' ? 'Corrente' : 'Poupança'}</h3>
                                <p><strong>Cliente:</strong> {conta.cpfCnpjCliente}</p>
                                <p><strong>Saldo:</strong> R$ {conta.saldo.toFixed(2)}</p>
                                <p><strong>Limite:</strong> R$ {conta.limiteCredito.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pagination-container">
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={filteredContas.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}