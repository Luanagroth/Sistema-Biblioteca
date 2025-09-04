import React, { useState, useEffect } from 'react';


interface Livro {
  id: string;
  titulo: string;
  autor: string;
  anoPublicacao: number;
  genero: string;
  disponivel: boolean;
}

interface Membro {
  id: string;
  nome: string;
  ativo: boolean;
}

interface Emprestimo {
  id: string;
  livroId: string;
  membroId: string;
  dataEmprestimo: string;
  dataDevolucao?: string;
}

const LivroComEmprestimo: React.FC = () => {

  const [livros, setLivros] = useState<Livro[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [membroId, setMembroId] = useState('');
  const [loading, setLoading] = useState(true);
  const [emprestando, setEmprestando] = useState(false);
  const [devolvendo, setDevolvendo] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [livrosRes, membrosRes, emprestimosRes] = await Promise.all([
          fetch('http://localhost:3000/livros'),
          fetch('http://localhost:3000/membros'),
          fetch('http://localhost:3000/emprestimos'),
        ]);
        const livrosData: Livro[] = await livrosRes.json();
        const membrosData: Membro[] = await membrosRes.json();
        const emprestimosData: Emprestimo[] = await emprestimosRes.json();
        setLivros(livrosData);
        setMembros(membrosData.filter(m => m.ativo));
        setEmprestimos(emprestimosData);
      } catch (error) {
        console.error('Erro ao buscar dados', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const atualizarDados = async () => {
    setLoading(true);
    try {
      const [livrosRes, emprestimosRes] = await Promise.all([
        fetch('http://localhost:3000/livros'),
        fetch('http://localhost:3000/emprestimos'),
      ]);
      setLivros(await livrosRes.json());
      setEmprestimos(await emprestimosRes.json());
    } catch (error) {
      console.error('Erro ao atualizar dados', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmprestar = async () => {
    if (!livroSelecionado || !membroId) return;
    setEmprestando(true);
    try {
      const response = await fetch('http://localhost:3000/emprestimos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livroId: livroSelecionado.id, membroId }),
      });
      if (!response.ok) throw new Error('Erro ao emprestar livro');
      alert('Empréstimo realizado com sucesso!');
      setLivroSelecionado(null);
      setMembroId('');
      await atualizarDados();
    } catch (error) {
      alert('Erro ao emprestar livro. Verifique o console.');
      console.error(error);
    } finally {
      setEmprestando(false);
    }
  };

  const handleDevolver = async (emprestimoId: string) => {
    setDevolvendo(emprestimoId);
    try {
      const response = await fetch(`http://localhost:3000/emprestimos/${emprestimoId}/devolver`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Erro ao devolver livro');
      alert('Livro devolvido com sucesso!');
      await atualizarDados();
    } catch (error) {
      alert('Erro ao devolver livro. Verifique o console.');
      console.error(error);
    } finally {
      setDevolvendo(null);
    }
  };

  if (loading) return <div>Carregando...</div>;


  // Helper para encontrar empréstimo ativo do livro
  const getEmprestimoAtivo = (livroId: string): Emprestimo | undefined => {
    return emprestimos.find(e => e.livroId === livroId && !e.dataDevolucao);
  };

  // Helper para mostrar data de devolução (se houver)
  const getDataDevolucao = (livroId: string): string | null => {
    const emp = emprestimos.find(e => e.livroId === livroId && e.dataDevolucao);
    return emp ? new Date(emp.dataDevolucao!).toLocaleDateString('pt-BR') : null;
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Livros</h2>
      <ul>
        {livros.map(livro => {
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
                    <b>Emprestado em:</b> {new Date(emprestimoAtivo.dataEmprestimo).toLocaleDateString('pt-BR')}
                  </span>
                  <button
                    style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleDevolver(emprestimoAtivo.id)}
                    disabled={devolvendo === emprestimoAtivo.id}
                  >
                    {devolvendo === emprestimoAtivo.id ? 'Devolvendo...' : 'Devolver'}
                  </button>
                </>
              )}
              {getDataDevolucao(livro.id) && (
                <span style={{ marginLeft: '10px', color: '#007bff' }}>
                  <b>Devolvido em:</b> {getDataDevolucao(livro.id)}
                </span>
              )}
              {livro.disponivel && (
                <button style={{ marginLeft: '10px' }} onClick={() => setLivroSelecionado(livro)}>
                  Emprestar
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {livroSelecionado && (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '20px', maxWidth: '400px', margin: '0 auto' }}>
          <h3>Emprestar: {livroSelecionado.titulo}</h3>
          <label>Membro:
            <select value={membroId} onChange={e => setMembroId(e.target.value)} style={{ marginLeft: '10px' }}>
              <option value="">Selecione...</option>
              {membros.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </label>
          <br /><br />
          <button onClick={handleEmprestar} disabled={emprestando || !membroId} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Confirmar Empréstimo
          </button>
          <button onClick={() => setLivroSelecionado(null)} style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default LivroComEmprestimo;
