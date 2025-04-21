import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAgencias, fetchClientes } from '../services/api';
import { Agencia, Cliente } from '../types/data';
import {LoadingSpinner} from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {BackButton} from '../components/BackButton';

export default function AgenciaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agencia, setAgencia] = useState<Agencia | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Busca todas as agências
                const agencias = await fetchAgencias();
                const agenciaEncontrada = agencias.find(a => a.id === id);
                
                if (!agenciaEncontrada) {
                    throw new Error('Agência não encontrada');
                }
                
                setAgencia(agenciaEncontrada);
                
                // Busca clientes associados
                const todosClientes = await fetchClientes();
                const clientesDaAgencia = todosClientes.filter(cli => 
                    cli.codigoAgencia === agenciaEncontrada.codigo
                );
                
                setClientes(clientesDaAgencia);
                
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
    if (!agencia) return <ErrorMessage message="Agência não encontrada" onRetry={() => navigate('/agencias')} />;

    return (
        <div className="agencia-detail-container">
            <BackButton />
            
            <header className="agencia-header">
                <h1>{agencia.nome}</h1>
                <p className="agencia-codigo">Código: {agencia.codigo}</p>
            </header>
            
            <section className="agencia-info-section">
                <h2>Informações da Agência</h2>
                <div className="info-grid">
                    <InfoItem label="Endereço" value={agencia.endereco} />
                    <InfoItem label="Total de Clientes" value={clientes.length.toString()} />
                </div>
            </section>

            {clientes.length > 0 && (
                <section className="clientes-section">
                    <h2>Clientes desta Agência</h2>
                    <div className="clientes-grid">
                        {clientes.slice(0, 5).map(cliente => (
                            <div key={cliente.id} className="cliente-card">
                                <h3>{cliente.nome}</h3>
                                <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
                                <p>Email: {cliente.email}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

// Reutilizando o mesmo componente auxiliar
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}:</span>
            <span className="info-value">{value}</span>
        </div>
    );
}