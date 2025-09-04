import React, { useState } from 'react';

const FormularioLivro: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    titulo: '',
    autor: '',
    anoPublicacao: '',
    genero: '',
    disponivel: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar livro');
      }

      alert('Livro adicionado com sucesso!');
      // Opcional: Limpar o formulário após o envio
      setFormData({
        id: '',
        titulo: '',
        autor: '',
        anoPublicacao: '',
        genero: '',
        disponivel: true,
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar livro. Verifique o console.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Adicionar Novo Livro</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Título:
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Autor:
          <input type="text" name="autor" value={formData.autor} onChange={handleChange} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Ano:
          <input type="number" name="anoPublicacao" value={formData.anoPublicacao} onChange={handleChange} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Gênero:
          <input type="text" name="genero" value={formData.genero} onChange={handleChange} required style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Adicionar</button>
    </form>
  );
};

export default FormularioLivro;
