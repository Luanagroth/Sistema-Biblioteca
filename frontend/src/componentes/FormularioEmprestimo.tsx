import React, { useState, useEffect } from 'react';

interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
}

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  anoPublicacao: number;
  genero: string;
  disponivel: boolean;
}

const FormularioEmprestimo: React.FC = () => {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [membroId, setMembroId] = useState('');
  const [livroId, setLivroId] = useState('');
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membrosRes = await fetch('http://localhost:3000/membros');
        const livrosRes = await fetch('http://localhost:3000/livros');
        const membrosData: Membro[] = await membrosRes.json();
        const livrosData: Livro[] = await livrosRes.json();
        setMembros(membrosData.filter(m => m.ativo));
        setLivros(livrosData.filter(l => l.disponivel));
      } catch (error) {
        console.error('Erro ao buscar membros ou livros', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Calcula a data de devolução (20 dias após hoje)
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 20);
    setDataDevolucao(hoje.toISOString().split('T')[0]);
  }, [livroId, membroId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membroId || !livroId) {
      alert('Selecione um membro e um livro!');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/emprestimos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membroId, livroId }),
      });
      if (!response.ok) throw new Error('Erro ao registrar empréstimo');
      alert('Empréstimo realizado com sucesso!');
      setMembroId('');
      setLivroId('');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar empréstimo. Verifique o console.');
    }
  };

  if (loading) return <div>Carregando dados...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registrar Empréstimo</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Membro:
          <select value={membroId} onChange={e => setMembroId(e.target.value)} required style={{ marginLeft: '10px' }}>
            <option value="">Selecione...</option>
            {membros.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Livro:
          <select value={livroId} onChange={e => setLivroId(e.target.value)} required style={{ marginLeft: '10px' }}>
            <option value="">Selecione...</option>
            {livros.map(l => (
              <option key={l.id} value={l.id}>{l.titulo} ({l.autor})</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Data prevista de devolução:
          <input type="date" value={dataDevolucao} readOnly style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Registrar Empréstimo</button>
    </form>
  );
};

export default FormularioEmprestimo;
