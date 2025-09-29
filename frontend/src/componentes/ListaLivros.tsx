import React, { useState, useEffect } from 'react';

interface Livro {
    id: string;
    titulo: string;
    autor: string;
    anoPublicacao: number;
    genero: string;
    disponivel: boolean;
}

interface Emprestimo {
    id: string;
    livroId: string;
    membroId: string;
    dataEmprestimo: string;
    dataDevolucao?: string;
}

const ListaLivros: React.FC = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [livrosRes, emprestimosRes] = await Promise.all([
                fetch('http://localhost:3000/livros'),
                fetch('http://localhost:3000/emprestimos'),
            ]);
            const livrosData: Livro[] = await livrosRes.json();
            const emprestimosData: Emprestimo[] = await emprestimosRes.json();

            setLivros(livrosData);
            setEmprestimos(emprestimosData);
        } catch (error) {
            console.error('Erro ao buscar dados', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDevolver = async (emprestimoId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/emprestimos/${emprestimoId}/devolver`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('A resposta da API não foi bem-sucedida');

            alert('Livro devolvido com sucesso!');
            await fetchData(); // atualiza a lista
        } catch (error) {
            console.error('Erro ao devolver livro:', error);
            alert('Erro ao devolver o livro.');
        }
    };

    const livrosFiltradosEOrdenados = livros
        .filter(livro =>
            livro.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
            livro.autor.toLowerCase().includes(termoBusca.toLowerCase())
        )
        .sort((a, b) => a.titulo.localeCompare(b.titulo));

    const getEmprestimoAtivo = (livroId: string) => {
        return emprestimos.find(e => e.livroId === livroId && !e.dataDevolucao);
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div style={{ margin: '20px' }}>
            <h2>Lista de Livros</h2>
            <input
                type="text"
                placeholder="Filtrar por título ou autor..."
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
            />
            <ul>
                {livrosFiltradosEOrdenados.map(livro => {
                    const emprestimoAtivo = getEmprestimoAtivo(livro.id);
                    return (
                        <li key={livro.id} style={{ marginBottom: '10px' }}>
                            <strong>{livro.titulo}</strong> por {livro.autor} ({livro.anoPublicacao})
                            <span style={{ marginLeft: '10px', color: livro.disponivel ? 'green' : 'red' }}>
                                {livro.disponivel ? 'Disponível' : 'Emprestado'}
                            </span>
                            {emprestimoAtivo && (
                                <>
                                    <span style={{ marginLeft: '10px' }}>
                                        (Empréstimo em {new Date(emprestimoAtivo.dataEmprestimo).toLocaleDateString('pt-BR')})
                                    </span>
                                    <button
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => handleDevolver(emprestimoAtivo.id)}
                                    >
                                        Devolver
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ListaLivros;
