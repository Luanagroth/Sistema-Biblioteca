// frontend/src/models/livros.ts

// Interface para um Livro completo, que já existe no sistema e tem um ID.
export interface Livro {
    id: string;
    titulo: string;
    autor: string;
    anoPublicacao: number;
    genero: string;
    disponivel: boolean;
}

// Tipo para um Novo Livro, que ainda não tem um ID.
// Usamos Omit<Livro, 'id'> para criar um novo tipo baseado em 'Livro', mas omitindo a propriedade 'id'.
// É uma forma limpa de não repetir código.
export type NovoLivro = Omit<Livro, 'id'>;