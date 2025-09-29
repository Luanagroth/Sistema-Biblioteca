import React, { useState, useEffect, useMemo, useCallback, type FormEvent } from 'react';
import styles from './FormularioEmprestimo.module.css';
import type { Membro } from '../models/membros';
import type { Livro } from '../models/livros';

const API_BASE_URL = 'http://localhost:3000';

interface FormularioEmprestimoProps {
    onEmprestimoSucesso: () => void; // Prop para notificar o componente pai
}


const FormularioEmprestimo: React.FC<FormularioEmprestimoProps> = ({ onEmprestimoSucesso }) => {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [livros, setLivros] = useState<Livro[]>([]);
    const [membroId, setMembroId] = useState('');
    const [livroId, setLivroId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [membrosRes, livrosRes] = await Promise.all([
                fetch(`${API_BASE_URL}/membros`),
                fetch(`${API_BASE_URL}/livros`),
            ]);
            const membrosData: Membro[] = await membrosRes.json();
            const livrosData: Livro[] = await livrosRes.json();
            
            setMembros(membrosData.filter(m => m.ativo));
            setLivros(livrosData.filter(l => l.disponivel));
        } catch (error) {
            console.error('Erro ao buscar membros ou livros', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const dataPrevistaDevolucao = useMemo(() => {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 20);
        return hoje.toISOString().split('T')[0];
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!membroId || !livroId) {
            alert('Selecione um membro e um livro!');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/emprestimos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ membroId, livroId }),
            });
            if (!response.ok) throw new Error('Erro ao registrar empréstimo');
            
            alert('Empréstimo realizado com sucesso!');
            setMembroId('');
            setLivroId('');
            onEmprestimoSucesso(); // Avisa o componente pai para recarregar todos os dados
        } catch (error) {
            console.error(error);
            alert('Erro ao registrar empréstimo. Verifique o console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Carregando dados...</div>;

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2>Registrar Empréstimo</h2>
            <div className={styles.formGroup}>
                <label>Membro:</label>
                <select value={membroId} onChange={e => setMembroId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {membros.map(m => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Livro:</label>
                <select value={livroId} onChange={e => setLivroId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {livros.map(l => (
                        <option key={l.id} value={l.id}>{l.titulo} ({l.autor})</option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Data prevista de devolução:</label>
                <input type="date" value={dataPrevistaDevolucao} readOnly />
            </div>
            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar Empréstimo'}
            </button>
        </form>
    );
    
};


export default FormularioEmprestimo;