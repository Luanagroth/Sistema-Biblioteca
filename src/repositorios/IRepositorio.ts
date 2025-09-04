// src/repositorios/IRepositorio.ts

export interface IRepositorio<T extends { id: string }> {
  adicionar(item: T): Promise<void>;
  buscarPorId(id: string): Promise<T | undefined>;
  listar(): Promise<T[]>;
  atualizar(id: string, itemAtualizado: Partial<T>): Promise<boolean>;
  remover(id: string): Promise<boolean>;
}