import { Cliente, Conta, Agencia } from '../types/data';

export const fetchClientes = async (): Promise<Cliente[]> => {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes');
    const csvData = await response.text();
    return parseCSVtoClientes(csvData);
};

export const fetchContas = async (): Promise<Conta[]> => {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas');
    const csvData = await response.text();
    return parseCSVtoContas(csvData);
};

export const fetchAgencias = async (): Promise<Agencia[]> => {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias');
    const csvData = await response.text();
    return parseCSVtoAgencias(csvData);
};

// Funções auxiliares para parsear CSV
function parseCSVtoClientes(csv: string): Cliente[] {
    // 1. Normaliza quebras de linha e remove linhas vazias
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) return [];

    // 2. Extrai cabeçalhos (considerando formato CSV com aspas)
    const headers = lines[0].split('","')
        .map(header => header.replace(/^"|"$/g, '').trim());

    // 3. Processa cada linha de dados
    return lines.slice(1).map((line, index) => {
        try {
            // Remove aspas externas e divide corretamente
            const cleanLine = line.replace(/^"|"$/g, '');
            const values = cleanLine.split(/","/);

            // Debug: Verifique o alinhamento
            if (values.length !== headers.length) {
                console.warn(`Linha ${index + 1} tem ${values.length} colunas, esperado ${headers.length}`);
            }

            // Cria objeto mapeado
            const row: Record<string, string> = {};
            headers.forEach((header, i) => {
                row[header] = (values[i] || '').trim();
            });

            // Conversão segura para o tipo Cliente
            return {
                id: String(row.id || '').trim() || undefined,
                cpfCnpj: String(row.cpfCnpj || '').trim(),
                rg: String(row.rg || '').trim() || undefined,
                dataNascimento: row.dataNascimento ? new Date(row.dataNascimento.split(' ')[0]) : new Date(),
                nome: String(row.nome || '').trim(),
                nomeSocial: String(row.nomeSocial || '').trim() || undefined,
                email: String(row.email || '').trim().toLowerCase(),
                endereco: String(row.endereco || '').trim(),
                rendaAnual: parseFloat(String(row.rendaAnual).replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                patrimonio: parseFloat(String(row.patrimonio).replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                estadoCivil: parseEstadoCivil(row.estadoCivil),
                codigoAgencia: parseInt(String(row.codigoAgencia)) || 0
            } as Cliente;
        } catch (error) {
            console.error(`Erro na linha ${index + 2}:`, error);
            return null;
        }
    }).filter(Boolean) as Cliente[]; // Remove linhas com erro
}

function parseEstadoCivil(value: string): "Solteiro" | "Casado" | "Viúvo" | "Divorciado" {
    const cleanValue = String(value || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (cleanValue.includes('casado')) return 'Casado';
    if (cleanValue.includes('viuvo')) return 'Viúvo';
    if (cleanValue.includes('divorciado')) return 'Divorciado';
    return 'Solteiro';
}

function parseCSVtoContas(csv: string): Conta[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',');
        const obj: any = {};
        
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim();
        });

        return {
            id: obj.id,
            cpfCnpjCliente: obj.cpfCnpjCliente,
            tipo: obj.tipo === 'poupanca' ? 'poupanca' : 'corrente', // Garante o tipo correto
            saldo: parseFloat(obj.saldo),
            limiteCredito: parseFloat(obj.limiteCredito),
            creditoDisponivel: parseFloat(obj.creditoDisponivel)
        } as Conta;
    });
}

function parseCSVtoAgencias(csv: string): Agencia[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',');
        const obj: any = {};
        
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim();
        });

        return {
            id: obj.id,
            codigo: parseInt(obj.codigo),
            nome: obj.nome,
            endereco: obj.endereco
        } as Agencia;
    });
}