import React, { useState } from 'react';

interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
}

const FormularioMembro: React.FC = () => {

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const gerarId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const novoMembro: Membro = {
      id: id || gerarId(),
      nome,
      email,
      telefone,
      endereco,
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
  setId('');
  setNome('');
  setEmail('');
  setTelefone('');
  setEndereco('');
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
        <label>ID:
          <input
            type="text"
            value={id}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setId(val);
            }}
            placeholder="(gerado automaticamente se vazio)"
            style={{ marginLeft: '10px' }}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Nome:
          <input
            type="text"
            value={nome}
            onChange={e => {
              const val = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
              setNome(val);
            }}
            required
            style={{ marginLeft: '10px' }}
            pattern="[A-Za-zÀ-ÿ\s]+"
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Telefone:
          <input
            type="text"
            value={telefone}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setTelefone(val);
            }}
            required
            style={{ marginLeft: '10px' }}
            pattern="[0-9]+"
            inputMode="numeric"
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Endereço:
          <input
            type="text"
            value={endereco}
            onChange={e => {
              const val = e.target.value.replace(/[^A-Za-zÀ-ÿ0-9\s]/g, '');
              setEndereco(val);
            }}
            required
            style={{ marginLeft: '10px' }}
            pattern="[A-Za-zÀ-ÿ0-9\s]+"
          />
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
