import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClientes } from '../services/api';
import { Cliente } from '../types/data';

// Componentes importados corretamente
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import {ClienteListSkeleton} from '../components/ClienteListSkeleton';

// Importando estilos
import '../styles/global.css';
import '../styles/LoadingSpinner.css';
import '../styles/ClienteListSkeleton.css';

export default function ClientesList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
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
                const data = await fetchClientes();
                
                // Debug logs
                console.log('Dados carregados:', {
                    totalClientes: data.length,
                    clientesValidos: data.filter(c => c.id && c.nome).length,
                    primeiroCliente: data[0] ? {
                        id: data[0].id,
                        nome: data[0].nome,
                        cpfCnpj: data[0].cpfCnpj
                    } : null
                });

                const filteredData = data.filter(cliente => cliente?.id && cliente?.nome);
                setClientes(filteredData);
                setFilteredClientes(filteredData);

            } catch (err) {
                console.error("Erro ao carregar clientes:", err);
                setError("Falha ao carregar dados dos clientes. Tente recarregar a página.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (term: string) => {
        if (!term.trim()) {
            setFilteredClientes(clientes);
            setCurrentPage(1);
            return;
        }

        const searchTerm = term.toLowerCase();
        const filtered = clientes.filter(cliente => {
            const nome = cliente.nome?.toLowerCase() || '';
            const cpfCnpj = cliente.cpfCnpj?.toLowerCase() || '';
            return nome.includes(searchTerm) || cpfCnpj.includes(searchTerm);
        });

        setFilteredClientes(filtered);
        setCurrentPage(1);
    };

    // Calcular clientes para a página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return <ClienteListSkeleton />;
    }

    if (error) {
        return (
            <div className="error-container">
                <ErrorMessage 
                    message={error} 
                    onRetry={() => window.location.reload()} 
                />
            </div>
        );
    }

    return (
        <div className="clientes-list-container">
            <h1>Lista de Clientes</h1>
            
            <div className="search-container">
                <SearchBar onSearch={handleSearch} />
            </div>
            
            {filteredClientes.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhum cliente encontrado</p>
                </div>
            ) : (
                <>
                    <div className="clientes-grid">
                        {currentItems.map(cliente => (
                            <div 
                                key={`cliente-${cliente.id}`}
                                className="cliente-card" 
                                onClick={() => navigate(`/cliente/${cliente.id}`)}
                            >
                                <h3>{cliente.nome}</h3>
                                <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
                                <p>Email: {cliente.email}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pagination-container">
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={filteredClientes.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}