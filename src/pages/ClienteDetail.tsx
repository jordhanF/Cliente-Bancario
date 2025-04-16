import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientes, fetchContas, fetchAgencias } from '../services/api';
import { Cliente, Conta, Agencia } from '../types/data';

export default function ClienteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [contas, setContas] = useState<Conta[]>([]);
    const [agencia, setAgencia] = useState<Agencia | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Buscar cliente
                const clientesData = await fetchClientes();
                const foundCliente = clientesData.find(c => c.id === id);
                if (!foundCliente) {
                    navigate('/');
                    return;
                }
                setCliente(foundCliente);

                // Buscar contas do cliente
                const contasData = await fetchContas();
                const clienteContas = contasData.filter(c => c.cpfCnpjCliente === foundCliente.cpfCnpj);
                setContas(clienteContas);

                // Buscar agência do cliente
                const agenciasData = await fetchAgencias();
                const clienteAgencia = agenciasData.find(a => a.codigo === foundCliente.codigoAgencia);
                setAgencia(clienteAgencia || null);

                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    if (loading) return <div>Carregando...</div>;
    if (!cliente) return <div>Cliente não encontrado</div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/')}>Voltar</button>
            
            <h1>{cliente.nome}</h1>
            <div className="cliente-info">
                <h2>Informações Pessoais</h2>
                <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
                <p>Data de Nascimento: {cliente.dataNascimento.toLocaleDateString()}</p>
                <p>Email: {cliente.email}</p>
                <p>Endereço: {cliente.endereco}</p>
                <p>Renda Anual: R$ {cliente.rendaAnual.toLocaleString()}</p>
                <p>Patrimônio: R$ {cliente.patrimonio.toLocaleString()}</p>
                <p>Estado Civil: {cliente.estadoCivil}</p>
            </div>

            <div className="contas-section">
                <h2>Contas Bancárias</h2>
                {contas.length > 0 ? (
                    <div className="contas-grid">
                        {contas.map(conta => (
                            <div key={conta.id} className="conta-card">
                                <h3>Conta {conta.tipo === 'corrente' ? 'Corrente' : 'Poupança'}</h3>
                                <p>Saldo: R$ {conta.saldo.toLocaleString()}</p>
                                <p>Limite de Crédito: R$ {conta.limiteCredito.toLocaleString()}</p>
                                <p>Crédito Disponível: R$ {conta.creditoDisponivel.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhuma conta encontrada para este cliente.</p>
                )}
            </div>

            {agencia && (
                <div className="agencia-section">
                    <h2>Agência</h2>
                    <div className="agencia-card">
                        <h3>{agencia.nome}</h3>
                        <p>Código: {agencia.codigo}</p>
                        <p>Endereço: {agencia.endereco}</p>
                    </div>
                </div>
            )}
        </div>
    );
}