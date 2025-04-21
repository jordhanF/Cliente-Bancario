import { Cliente, Conta, Agencia } from '../types/data';

// Configurações
const API_BASE_URL = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=';
const REQUEST_TIMEOUT = 10000; // 10 segundos
const CACHE_KEY = 'bankDataCache_v1';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos

// Utilitários
const cleanString = (str: string | undefined | null): string => {
    if (!str) return '';
    return str.trim();
};

const cleanCpfCnpj = (str: string | undefined | null): string => {
    return cleanString(str).replace(/\D/g, '');
};

const parseMoney = (value: string | undefined | null): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
};

const parseDate = (dateStr: string | undefined | null): Date => {
    if (!dateStr) return new Date();
    
    // Tenta formatos conhecidos
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
    }

    const brMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (brMatch) {
        return new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`);
    }

    // Fallback para o parser nativo
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
};

const parseEstadoCivil = (value: string | undefined | null): "Solteiro" | "Casado" | "Viúvo" | "Divorciado" => {
    const cleanValue = cleanString(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (cleanValue.includes('casado')) return 'Casado';
    if (cleanValue.includes('viuvo')) return 'Viúvo';
    if (cleanValue.includes('divorciado')) return 'Divorciado';
    return 'Solteiro';
};

// Cache helper
const getCachedData = <T,>(key: string): T | null => {
    try {
        const cached = localStorage.getItem(`${CACHE_KEY}_${key}`);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) return null;
        
        return data;
    } catch {
        return null;
    }
};

const setCachedData = <T,>(key: string, data: T): void => {
    try {
        localStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
};

// Fetch wrapper com timeout e tratamento de erros
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

// API Services
export const fetchClientes = async (useCache = true): Promise<Cliente[]> => {
    try {
        // Tentar obter do cache
        if (useCache) {
            const cached = getCachedData<Cliente[]>('clientes');
            if (cached) return cached;
        }

        const response = await fetchWithTimeout(`${API_BASE_URL}clientes`);
        const csvData = await response.text();
        const parsedData = parseCSVtoClientes(csvData);
        
        setCachedData('clientes', parsedData);
        return parsedData;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw new Error('Não foi possível carregar os dados dos clientes');
    }
};

export const fetchContas = async (useCache = true): Promise<Conta[]> => {
    try {
        if (useCache) {
            const cached = getCachedData<Conta[]>('contas');
            if (cached) return cached;
        }

        const response = await fetchWithTimeout(`${API_BASE_URL}contas`);
        const csvData = await response.text();
        const parsedData = parseCSVtoContas(csvData);
        
        setCachedData('contas', parsedData);
        return parsedData;
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        throw new Error('Não foi possível carregar os dados das contas');
    }
};

export const fetchAgencias = async (useCache = true): Promise<Agencia[]> => {
    try {
        if (useCache) {
            const cached = getCachedData<Agencia[]>('agencias');
            if (cached) return cached;
        }

        const response = await fetchWithTimeout(`${API_BASE_URL}agencias`);
        const csvData = await response.text();
        const parsedData = parseCSVtoAgencias(csvData);
        
        setCachedData('agencias', parsedData);
        return parsedData;
    } catch (error) {
        console.error('Erro ao buscar agências:', error);
        throw new Error('Não foi possível carregar os dados das agências');
    }
};

export const clearCache = (): void => {
    localStorage.removeItem(`${CACHE_KEY}_clientes`);
    localStorage.removeItem(`${CACHE_KEY}_contas`);
    localStorage.removeItem(`${CACHE_KEY}_agencias`);
};

// Parsers CSV
function parseCSVtoClientes(csv: string): Cliente[] {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.warn('CSV de clientes vazio ou sem dados');
        return [];
    }

    const headers = lines[0].split('","')
        .map(header => header.replace(/^"|"$/g, '').trim());

    return lines.slice(1).map((line, index) => {
        try {
            const cleanLine = line.replace(/^"|"$/g, '');
            const values = cleanLine.split(/","/);

            if (values.length !== headers.length) {
                console.warn(`Linha ${index + 2} de clientes tem ${values.length} colunas, esperado ${headers.length}`);
            }

            const row: Record<string, string> = {};
            headers.forEach((header, i) => {
                row[header] = values[i]?.trim() || '';
            });

            const cliente: Cliente = {
                id: cleanString(row.id),
                cpfCnpj: cleanCpfCnpj(row.cpfCnpj),
                rg: cleanString(row.rg) || undefined,
                dataNascimento: parseDate(row.dataNascimento),
                nome: cleanString(row.nome),
                nomeSocial: cleanString(row.nomeSocial) || undefined,
                email: cleanString(row.email).toLowerCase(),
                endereco: cleanString(row.endereco),
                rendaAnual: parseMoney(row.rendaAnual),
                patrimonio: parseMoney(row.patrimonio),
                estadoCivil: parseEstadoCivil(row.estadoCivil),
                codigoAgencia: parseInt(cleanString(row.codigoAgencia)) || 0
            };

            if (!cliente.id || !cliente.cpfCnpj || !cliente.nome) {
                console.warn(`Cliente inválido na linha ${index + 2}`, cliente);
                return null;
            }

            return cliente;
        } catch (error) {
            console.error(`Erro ao parsear cliente na linha ${index + 2}:`, error);
            return null;
        }
    }).filter(Boolean) as Cliente[];
}

function parseCSVtoContas(csv: string): Conta[] {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.warn('CSV de contas vazio ou sem dados');
        return [];
    }

    const headers = lines[0].split('","')
        .map(header => header.replace(/^"|"$/g, '').trim());

    return lines.slice(1).map((line, index) => {
        try {
            const cleanLine = line.replace(/^"|"$/g, '');
            const values = cleanLine.split(/","/);

            if (values.length !== headers.length) {
                console.warn(`Linha ${index + 2} de contas tem ${values.length} colunas, esperado ${headers.length}`);
            }

            const row: Record<string, string> = {};
            headers.forEach((header, i) => {
                row[header] = values[i]?.trim() || '';
            });

            const conta: Conta = {
                id: cleanString(row.id),
                cpfCnpjCliente: cleanCpfCnpj(row.cpfCnpjCliente),
                tipo: cleanString(row.tipo) === 'poupanca' ? 'poupanca' : 'corrente',
                saldo: parseMoney(row.saldo),
                limiteCredito: parseMoney(row.limiteCredito),
                creditoDisponivel: parseMoney(row.creditoDisponivel)
            };

            if (!conta.id || !conta.cpfCnpjCliente) {
                console.warn(`Conta inválida na linha ${index + 2}`, conta);
                return null;
            }

            return conta;
        } catch (error) {
            console.error(`Erro ao parsear conta na linha ${index + 2}:`, error);
            return null;
        }
    }).filter(Boolean) as Conta[];
}

function parseCSVtoAgencias(csv: string): Agencia[] {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.warn('CSV de agências vazio ou sem dados');
        return [];
    }

    const headers = lines[0].split('","')
        .map(header => header.replace(/^"|"$/g, '').trim());

    return lines.slice(1).map((line, index) => {
        try {
            const cleanLine = line.replace(/^"|"$/g, '');
            const values = cleanLine.split(/","/);

            if (values.length !== headers.length) {
                console.warn(`Linha ${index + 2} de agências tem ${values.length} colunas, esperado ${headers.length}`);
            }

            const row: Record<string, string> = {};
            headers.forEach((header, i) => {
                row[header] = values[i]?.trim() || '';
            });

            const agencia: Agencia = {
                id: cleanString(row.id),
                codigo: parseInt(cleanString(row.codigo)) || 0,
                nome: cleanString(row.nome),
                endereco: cleanString(row.endereco)
            };

            if (!agencia.id || !agencia.codigo) {
                console.warn(`Agência inválida na linha ${index + 2}`, agencia);
                return null;
            }

            return agencia;
        } catch (error) {
            console.error(`Erro ao parsear agência na linha ${index + 2}:`, error);
            return null;
        }
    }).filter(Boolean) as Agencia[];
}