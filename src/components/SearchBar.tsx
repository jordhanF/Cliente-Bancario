import { useState } from 'react';

interface SearchBarProps {
    onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    onSearch(searchTerm);
};

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Buscar por nome ou CPF/CNPJ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Buscar</button>
        </form>
    );
}