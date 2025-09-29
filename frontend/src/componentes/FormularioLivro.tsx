import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Livro, NovoLivro } from '../models/livros';

interface FormularioLivroProps {
  onAdicionarLivro: (livro: Livro) => void;
}

const FormularioLivro: React.FC<FormularioLivroProps> = ({ onAdicionarLivro }) => {
  const [formData, setFormData] = useState<NovoLivro>({
    titulo: '',
    autor: '',
    anoPublicacao: 0,
    genero: '',
    disponivel: true,
  });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'anoPublicacao') {
      setFormData(prev => ({ ...prev, [name]: Number(value.replace(/\D/g, '')) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const livroComId = { ...formData, id: uuidv4() };
      const response = await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livroComId),
      });
      if (!response.ok) throw new Error('Erro ao adicionar livro');

      const livroAdicionado: Livro = await response.json();
      onAdicionarLivro(livroAdicionado); // Atualiza lista no pai
      alert('Livro adicionado com sucesso!');
      setFormData({ titulo: '', autor: '', anoPublicacao: 0, genero: '', disponivel: true });
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar livro. Verifique o console.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Adicionar Novo Livro</h2>
      <div className="form-group">
        <label>Título:</label>
        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Autor:</label>
        <input type="text" name="autor" value={formData.autor} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Ano:</label>
        <input type="text" name="anoPublicacao" value={formData.anoPublicacao} onChange={handleChange} required maxLength={4} />
      </div>
      <div className="form-group">
        <label>Gênero:</label>
        <input type="text" name="genero" value={formData.genero} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={enviando} className="form-button">
        {enviando ? 'Enviando...' : 'Adicionar'}
      </button>
    </form>
  );
};

export default FormularioLivro;
