import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientes, fetchContas, fetchAgencias } from '../services/api';
import { Cliente, Conta, Agencia } from '../types/data';
import {LoadingSpinner} from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Importando estilos
import '../styles/global.css';
import '../styles/LoadingSpinner.css';

// Funções auxiliares (mantidas exatamente como estavam)
const cleanCpfCnpj = (str: string | undefined | null): string => {
    if (!str) return '';
    return str.replace(/\D/g, '');
};

const formatCpfCnpj = (value: string | undefined | null): string => {
    const cleanValue = cleanCpfCnpj(value);
    if (!cleanValue) return 'Não informado';
    
    if (cleanValue.length === 11) {
        return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (cleanValue.length === 14) {
        return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cleanValue;
};

const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'Não informada';
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        return isNaN(dateObj.getTime()) ? 'Data inválida' : 
            dateObj.toLocaleDateString('pt-BR');
    } catch {
        return 'Data inválida';
    }
};

const formatCurrency = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null) return 'R$ 0,00';
    
    const numValue = typeof value === 'string' ? 
        parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0 : 
        value;
    
    return numValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

export default function ClienteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [contas, setContas] = useState<Conta[]>([]);
    const [agencia, setAgencia] = useState<Agencia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [clientesData, contasData, agenciasData] = await Promise.all([
                    fetchClientes(),
                    fetchContas(),
                    fetchAgencias()
                ]);

                if (!isMounted) return;

                const foundCliente = clientesData.find(c => c.id === id);
                if (!foundCliente) {
                    navigate('/', { replace: true });
                    return;
                }

                const clienteContas = contasData.filter(c => {
                    const clienteDoc = cleanCpfCnpj(foundCliente.cpfCnpj);
                    const contaDoc = cleanCpfCnpj(c.cpfCnpjCliente);
                    return contaDoc && clienteDoc && contaDoc === clienteDoc;
                });

                setCliente({
                    ...foundCliente,
                    dataNascimento: new Date(foundCliente.dataNascimento)
                });
                setContas(clienteContas);
                setAgencia(agenciasData.find(a => a.codigo === foundCliente.codigoAgencia) || null);

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                if (isMounted) {
                    setError("Falha ao carregar dados. Por favor, tente recarregar a página.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
                <p>Carregando dados do cliente...</p>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage 
                message={error} 
                onRetry={() => window.location.reload()} 
            />
        );
    }

    if (!cliente) {
        return (
            <ErrorMessage 
                message="Cliente não encontrado" 
                onRetry={() => navigate('/')} 
            />
        );
    }

    return (
        <div className="cliente-detail-container">
            <button 
                onClick={() => navigate('/')} 
                className="back-button"
                aria-label="Voltar para lista de clientes"
            >
                &larr; Voltar
            </button>
            
            <header className="cliente-header">
                <h1>{cliente.nome}</h1>
                {cliente.nomeSocial && (
                    <h2 className="nome-social">({cliente.nomeSocial})</h2>
                )}
            </header>
            
            <section className="cliente-info-section" aria-labelledby="info-pessoais">
                <h2 id="info-pessoais">Informações Pessoais</h2>
                <div className="info-grid">
                    <InfoItem label="CPF/CNPJ" value={formatCpfCnpj(cliente.cpfCnpj)} />
                    <InfoItem label="RG" value={cliente.rg || 'Não informado'} />
                    <InfoItem label="Data de Nascimento" value={formatDate(cliente.dataNascimento)} />
                    <InfoItem label="Email" value={cliente.email} />
                    <InfoItem label="Endereço" value={cliente.endereco} />
                    <InfoItem label="Renda Anual" value={formatCurrency(cliente.rendaAnual)} />
                    <InfoItem label="Patrimônio" value={formatCurrency(cliente.patrimonio)} />
                    <InfoItem label="Estado Civil" value={cliente.estadoCivil} />
                    <InfoItem label="Código Agência" value={cliente.codigoAgencia.toString()} />
                </div>
            </section>

            <section className="contas-section" aria-labelledby="contas-bancarias">
                <h2 id="contas-bancarias">Contas Bancárias</h2>
                {contas.length > 0 ? (
                    <div className="contas-grid">
                        {contas.map(conta => (
                            <ContaCard key={conta.id} conta={conta} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Nenhuma conta encontrada para este cliente.</p>
                        <small>
                            Verifique se o CPF/CNPJ ({formatCpfCnpj(cliente.cpfCnpj)}) está correto na aba de contas
                        </small>
                    </div>
                )}
            </section>

            {agencia && (
                <section className="agencia-section" aria-labelledby="agencia-info">
                    <h2 id="agencia-info">Agência</h2>
                    <div className="agencia-card">
                        <h3>{agencia.nome}</h3>
                        <div className="agencia-info-grid">
                            <InfoItem label="Código" value={agencia.codigo.toString()} />
                            <InfoItem label="Endereço" value={agencia.endereco} />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

// Componentes auxiliares (mantidos exatamente como estavam)
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}:</span>
            <span className="info-value">{value}</span>
        </div>
    );
}

function ContaCard({ conta }: { conta: Conta }) {
    return (
        <article className="conta-card">
            <h3>Conta {conta.tipo === 'corrente' ? 'Corrente' : 'Poupança'}</h3>
            <div className="conta-info-grid">
                <InfoItem label="Saldo" value={formatCurrency(conta.saldo)} />
                <InfoItem label="Limite" value={formatCurrency(conta.limiteCredito)} />
                <InfoItem label="Crédito Disponível" value={formatCurrency(conta.creditoDisponivel)} />
            </div>
        </article>
    );
}