// Pasta 'compartilhado': contém classes e utilitários genéricos reutilizáveis por todo o projeto, como serviços base e interfaces comuns.
// OCP: Esta classe é aberta para extensão, pois pode ser herdada por outros serviços.
// LSP: Serviços que herdam de BaseServico podem ser usados no lugar da classe base sem quebrar o funcionamento.
import { IRepositorio } from '../repositorios/IRepositorio';

export abstract class BaseServico<T extends { id: string }> {
  protected repositorio: IRepositorio<T>;

  constructor(repositorio: IRepositorio<T>) {
    this.repositorio = repositorio;
  }

  async adicionar(item: T): Promise<void> {
    await this.repositorio.adicionar(item);
  }

  async buscarPorId(id: string): Promise<T | undefined> {
    return await this.repositorio.buscarPorId(id);
  }

  async listar(): Promise<T[]> {
    return await this.repositorio.listar();
  }

  async atualizar(id: string, itemAtualizado: Partial<T>): Promise<boolean> {
    return await this.repositorio.atualizar(id, itemAtualizado);
  }

  async remover(id: string): Promise<boolean> {
    return await this.repositorio.remover(id);
  }
}
