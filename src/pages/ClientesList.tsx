import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClientes } from '../services/api';
import { Cliente } from '../types/data';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

export default function ClientesList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    useEffect(() => {
    console.log("Dados dos clientes:", clientes);
}, [clientes]);

useEffect(() => {
    const loadData = async () => {
        try {
            setLoading(true);
            let data = await fetchClientes();

            // ADICIONE AQUI OS LOGS DE DEBUG (1)
            console.log('Dados brutos da API:', data);
            console.log('Clientes válidos:', data.filter(c => c.id && c.nome));
            console.log('Primeiro cliente:', data[0] && {
                id: data[0].id,
                nome: data[0].nome,
                cpfCnpj: data[0].cpfCnpj
            });

            data = data.filter(cliente => cliente?.id && cliente?.nome);
            setClientes(data);
            setFilteredClientes(data);

            // LOG APÓS FILTRAGEM (2)
            console.log('Dados após filtro:', data);
        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
}, []);

// Adicione também:
useEffect(() => {
    console.log("Estado atualizado - clientes:", clientes);
}, [clientes]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchClientes();
                setClientes(data);
                setFilteredClientes(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (term: string) => {
    if (!term.trim()) {
        setFilteredClientes(clientes);
        return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = clientes.filter(cliente => {
        // Verifica se os campos existem antes de acessá-los
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

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="container">
            <h1>Lista de Clientes</h1>
            <SearchBar onSearch={handleSearch} />
            
            <div className="clientes-grid">
                {currentItems.map(cliente => (
    <div 
        key={`cliente-${cliente.id || Math.random().toString(36).substr(2, 9)}`}
        className="cliente-card" 
        onClick={() => navigate(`/cliente/${cliente.id}`)}>
        <h3>{cliente.nome}</h3>
        <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
        <p>Email: {cliente.email}</p>
    </div>
))}
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalItems={filteredClientes.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}