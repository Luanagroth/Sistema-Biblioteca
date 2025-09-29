import React, { useState, type FormEvent, type ChangeEvent, type FocusEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Membro } from '../models/membros';

interface FormularioMembroProps {
  onCadastroSucesso: (membro: Membro) => void;
}

const FormularioMembro: React.FC<FormularioMembroProps> = ({ onCadastroSucesso }) => {
  const estadoInicial: Membro = {
    id: '',
    nome: '',
    email: '',
    telefone: '',
    ativo: true,
    cpf: '',
  };

  const [formData, setFormData] = useState<Partial<Membro>>(estadoInicial);
  const [enviando, setEnviando] = useState(false);

  const buscarMembroPorCpf = async (cpf: string) => {
    if (cpf.length !== 11) {
      setFormData(estadoInicial);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/membros/cpf/${cpf}`);
      if (response.ok) {
        const membroEncontrado: Membro = await response.json();
        setFormData(membroEncontrado);
      } else if (response.status === 404) {
        setFormData({ ...estadoInicial, cpf });
      } else {
        throw new Error('Erro na busca por CPF.');
      }
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      alert('Erro ao verificar CPF. Tente novamente.');
      setFormData(estadoInicial);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'cpf') {
      const rawCpf = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, cpf: rawCpf }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.name === 'cpf') {
      const rawCpf = e.target.value.replace(/\D/g, '');
      buscarMembroPorCpf(rawCpf);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    const isUpdating = !!formData.id;
    const membroParaEnviar: Membro = isUpdating
      ? (formData as Membro)
      : { ...(formData as Membro), id: uuidv4() };

    const url = isUpdating
      ? `http://localhost:3000/membros/${formData.id}`
      : 'http://localhost:3000/membros';
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membroParaEnviar),
      });

      if (!response.ok) {
        // tenta extrair a mensagem do backend
        const erroData = await response.json().catch(() => null);
        throw new Error(
          erroData?.message || `Erro ao ${isUpdating ? 'atualizar' : 'cadastrar'} membro`
        );
      }

      // pega o JSON ou usa o que enviamos
      const membroSalvo: Membro = await response.json().catch(() => membroParaEnviar);

      alert(`Membro ${isUpdating ? 'atualizado' : 'cadastrado'} com sucesso!`);
      setFormData(estadoInicial);
      onCadastroSucesso(membroSalvo);

    } catch (error) {
      console.error(error);
      alert(`Erro ao ${isUpdating ? 'atualizar' : 'cadastrar'} membro. Verifique o console.`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">
        {formData.id ? 'Atualizar Membro' : 'Cadastrar Membro'}
      </h2>

      <div className="form-group">
        <label>CPF:</label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          maxLength={11}
          placeholder="Somente números"
        />
      </div>

      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={formData.nome || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Telefone:</label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="checkbox-group">
        <label>
          Ativo:
          <input
            type="checkbox"
            name="ativo"
            checked={!!formData.ativo}
            onChange={handleChange}
          />
        </label>
      </div>

      <button type="submit" disabled={enviando} className="form-button">
        {enviando ? 'Enviando...' : (formData.id ? 'Atualizar' : 'Cadastrar')}
      </button>
    </form>
  );
};

export default FormularioMembro;
