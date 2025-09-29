import { IRepositorio } from '../repositorios/IRepositorio.js';

// Adicionamos 'abstract' pois esta classe não deve ser instanciada diretamente
export abstract class BaseServico<T extends { id: string }> {
    constructor(protected repositorio: IRepositorio<T>) { }

    async adicionar(item: T): Promise<void> {
        return this.repositorio.adicionar(item);
    }

    async listar(): Promise<T[]> {
        return this.repositorio.listar();
    }

    async buscarPorId(id: string): Promise<T | undefined> {
        return this.repositorio.buscarPorId(id);
    }

    async atualizar(id: string, item: Partial<T>): Promise<boolean> {
        return this.repositorio.atualizar(id, item);
    }

    async remover(id: string): Promise<boolean> {
        return this.repositorio.remover(id);
    }

    // Método genérico de busca que já estava sendo usado pelo MembroService
    async buscarPor(campo: keyof T, valor: any): Promise<T[]> {
        return this.repositorio.buscarPor(campo, valor);
    }
}