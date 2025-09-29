// frontend/src/models/membros.ts

export interface Membro {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    ativo: boolean;
    cpf: string; // <-- Adicione esta linha
}

export interface NovoMembro {
    nome: string;
    email: string;
    telefone: string;
    ativo: boolean;
    cpf: string; // <-- Adicione esta linha também, para consistência
}