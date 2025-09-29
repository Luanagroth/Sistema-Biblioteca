import { Livro } from '../livros/livro.js';
import { BaseServico } from '../compartilhado/BaseServico.js';
import { IRepositorio } from '../repositorios/IRepositorio.js';

export class LivroService extends BaseServico<Livro> {
    constructor(repositorio: IRepositorio<Livro>) {
        super(repositorio);
    }
    // Métodos específicos de LivroService podem ser adicionados aqui no futuro
}