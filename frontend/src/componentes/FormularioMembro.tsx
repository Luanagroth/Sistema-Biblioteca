import React, { useState } from 'react';

interface Membro {
  id: string;
  nome: string;
  ativo: boolean;
}

const FormularioMembro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const gerarId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const novoMembro: Membro = {
      id: gerarId(),
      nome,
      ativo,
    };
    try {
      const response = await fetch('http://localhost:3000/membros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMembro),
      });
      if (!response.ok) throw new Error('Erro ao cadastrar membro');
      alert('Membro cadastrado com sucesso!');
      setNome('');
      setAtivo(true);
    } catch (error) {
      alert('Erro ao cadastrar membro. Verifique o console.');
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
      <h2>Cadastrar Membro</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Nome:
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Ativo:
          <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <button type="submit" disabled={enviando} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {enviando ? 'Enviando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default FormularioMembro;
