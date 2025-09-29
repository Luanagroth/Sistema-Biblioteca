export interface IRepositorio<T> {
    adicionar(item: T): Promise<void>;
    listar(): Promise<T[]>;
    buscarPorId(id: string): Promise<T | undefined>;
    atualizar(id: string, itemAtualizado: Partial<T>): Promise<boolean>;
    remover(id: string): Promise<boolean>;
    buscarPor(campo: keyof T, valor: any): Promise<T[]>;
}