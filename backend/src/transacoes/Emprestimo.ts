export interface Emprestimo {
    id: string;
    livroId: string;
    membroId: string;
    dataEmprestimo: string;
    dataDevolucao?: string; 
}