import React,{ useState, useEffect, useMemo, useCallback } from 'react';
import styles from './LivroComEmprestimo.module.css';
import type { Livro } from '../models/livros';
import type { Membro } from '../models/membros';
import type { Emprestimo } from '../models/emprestimos';
import FormularioEmprestimo from './FormularioEmprestimo';
import FormularioLivro from './FormularioLivro';
import FormularioMembro from './FormularioMembro';

const API_BASE_URL = 'http://localhost:3000';

const LivroComEmprestimo: React.FC = () => {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [membros, setMembros] = useState<Membro[]>([]);
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
    const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
    const [membroId, setMembroId] = useState('');
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [devolvingId, setDevolvingId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [livrosRes, membrosRes, emprestimosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/livros`),
                fetch(`${API_BASE_URL}/membros`),
                fetch(`${API_BASE_URL}/emprestimos`),
            ]);

            const livrosData: Livro[] = await livrosRes.json();
            const membrosData: Membro[] = await membrosRes.json();
            const emprestimosData: Emprestimo[] = await emprestimosRes.json();

            setLivros(livrosData);
            setMembros(membrosData.filter(m => m.ativo));
            setEmprestimos(emprestimosData);
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            alert('Falha ao carregar os dados. Verifique a conexão com a API.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const livrosFiltradosEOrdenados = useMemo(() => {
        const termoLower = termoBusca.toLowerCase();
        return livros
            .filter(livro =>
                livro.titulo.toLowerCase().includes(termoLower) ||
                livro.autor.toLowerCase().includes(termoLower)
            )
            .sort((a, b) => a.titulo.localeCompare(b.titulo));
    }, [livros, termoBusca]);

    const membroMap = useMemo(() => new Map(membros.map(m => [m.id, m.nome])), [membros]);

    const getEmprestimoAtivo = useCallback(
        (livroId: string) => emprestimos.find(e => e.livroId === livroId && !e.dataDevolucao),
        [emprestimos]
    );

    const getMembroNome = useCallback(
        (id: string) => membroMap.get(id) || 'Membro não encontrado',
        [membroMap]
    );

    const handleEmprestar = async () => {
        if (!livroSelecionado || !membroId) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/emprestimos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ livroId: livroSelecionado.id, membroId }),
            });
            if (!response.ok) throw new Error('Erro ao registrar empréstimo');

            alert('Empréstimo realizado com sucesso!');
            setLivroSelecionado(null);
            setMembroId('');
            await fetchData();
        } catch (error) {
            console.error(error);
            alert('Erro ao realizar o empréstimo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDevolver = async (emprestimoId: string) => {
        setDevolvingId(emprestimoId);
        try {
            const response = await fetch(`${API_BASE_URL}/emprestimos/${emprestimoId}/devolver`, { method: 'PUT' });
            if (!response.ok) throw new Error('Erro ao devolver o livro');

            alert('Livro devolvido com sucesso!');
            await fetchData();
        } catch (error) {
            console.error(error);
            alert('Erro ao devolver o livro.');
        } finally {
            setDevolvingId(null);
        }
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.formsContainer}>
                <FormularioMembro onCadastroSucesso={fetchData} />
                <FormularioLivro onAdicionarLivro={fetchData} />
                <FormularioEmprestimo onEmprestimoSucesso={fetchData} />
            </div>

            <hr style={{ margin: '40px 0' }} />

            <h2>Lista de Livros</h2>
            <input
                type="text"
                placeholder="Filtrar por título ou autor..."
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                className={styles.searchInput}
            />
            <ul className={styles.list}>
                {livrosFiltradosEOrdenados.map(livro => {
                    const emprestimoAtivo = getEmprestimoAtivo(livro.id);
                    const statusColor = livro.disponivel ? 'green' : 'red';

                    return (
                        <li key={livro.id} className={styles.listItem}>
                            <span>
                                <strong>{livro.titulo}</strong> por {livro.autor} ({livro.anoPublicacao})
                            </span>
                            <span className={styles.status} style={{ color: statusColor }}>
                                {livro.disponivel ? 'Disponível' : 'Emprestado'}
                            </span>

                            {emprestimoAtivo ? (
                                <>
                                    <span>para: <strong>{getMembroNome(emprestimoAtivo.membroId)}</strong></span>
                                    <button
                                        className={styles.buttonDevolver}
                                        onClick={() => handleDevolver(emprestimoAtivo.id)}
                                        disabled={devolvingId === emprestimoAtivo.id}
                                    >
                                        {devolvingId === emprestimoAtivo.id ? 'Devolvendo...' : 'Devolver'}
                                    </button>
                                </>
                            ) : (
                                <button className={styles.button} onClick={() => setLivroSelecionado(livro)}>
                                    Emprestar
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {livroSelecionado && (
                <div className={styles.modal}>
                    <h3>Emprestar: {livroSelecionado.titulo}</h3>
                    <label>
                        Membro:
                        <select value={membroId} onChange={e => setMembroId(e.target.value)} style={{ marginLeft: '10px' }}>
                            <option value="">Selecione...</option>
                            {membros.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </select>
                    </label>
                    <div className={styles.modalActions}>
                        <button onClick={handleEmprestar} disabled={isSubmitting || !membroId} className={styles.buttonConfirmar}>
                            {isSubmitting ? 'Confirmando...' : 'Confirmar Empréstimo'}
                        </button>
                        <button onClick={() => setLivroSelecionado(null)} className={styles.buttonCancelar}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LivroComEmprestimo;