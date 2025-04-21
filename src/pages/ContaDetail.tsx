import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContas, fetchClientes } from '../services/api';
import { Conta, Cliente } from '../types/data';
import {LoadingSpinner} from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {BackButton} from '../components/BackButton';

export default function ContaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conta, setConta] = useState<Conta | null>(null);
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca todas as contas (já que não temos fetchConta específico)
                const contas = await fetchContas();
                const contaEncontrada = contas.find(c => c.id === id);
                
                if (!contaEncontrada) {
                    throw new Error('Conta não encontrada');
                }
                
                setConta(contaEncontrada);
                
                // Busca o cliente associado
                const clientes = await fetchClientes();
                const clienteEncontrado = clientes.find(cli => 
                    cli.cpfCnpj === contaEncontrada.cpfCnpjCliente
                );
                
                setCliente(clienteEncontrado || null);
                
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
    if (!conta) return <ErrorMessage message="Conta não encontrada" onRetry={() => navigate('/contas')} />;

    return (
        <div className="conta-detail-container">
            <BackButton />
            
            <header className="conta-header">
                <h1>Conta {conta.tipo === 'corrente' ? 'Corrente' : 'Poupança'}</h1>
                <p className="conta-id">Nº {conta.id}</p>
            </header>
            
            <section className="conta-info-section">
                <h2>Informações Bancárias</h2>
                <div className="info-grid">
                    <InfoItem label="Saldo" value={`R$ ${conta.saldo.toFixed(2)}`} />
                    <InfoItem label="Limite de Crédito" value={`R$ ${conta.limiteCredito.toFixed(2)}`} />
                    <InfoItem label="Crédito Disponível" value={`R$ ${conta.creditoDisponivel.toFixed(2)}`} />
                </div>
            </section>

            {cliente && (
                <section className="cliente-info-section">
                    <h2>Titular da Conta</h2>
                    <div className="info-grid">
                        <InfoItem label="Nome" value={cliente.nome} />
                        <InfoItem label="CPF/CNPJ" value={cliente.cpfCnpj} />
                        <InfoItem label="Agência" value={cliente.codigoAgencia.toString()} />
                    </div>
                </section>
            )}
        </div>
    );
}

// Componente auxiliar para exibir itens de informação
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}:</span>
            <span className="info-value">{value}</span>
        </div>
    );
}