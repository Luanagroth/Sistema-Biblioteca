export interface Emprestimo {
  id: string;
  livroId: string;
  membroId: string;
  dataEmprestimo: Date;
  dataDevolucao?: Date;
}
