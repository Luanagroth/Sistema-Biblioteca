// src/servicos/livroService.ts

import { Livro } from '../livros/livro';
import { BaseServico } from '../compartilhado/BaseServico';
import { IRepositorio } from '../repositorios/IRepositorio';

export class LivroService extends BaseServico<Livro> {
  // Adicione a injeção de dependência no construtor
  constructor(repositorio: IRepositorio<Livro>) {
    super(repositorio);
  }

  // Métodos específicos de LivroService podem ser adicionados aqui
}