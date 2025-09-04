// src/membros/MembroService.ts

import { Membro } from '../membros/membro';
import { BaseServico } from '../compartilhado/BaseServico';
import { IRepositorio } from '../repositorios/IRepositorio';

export class MembroService extends BaseServico<Membro> {
  // Adicione a injeção de dependência no construtor
  constructor(repositorio: IRepositorio<Membro>) {
    super(repositorio);
  }

  // Métodos específicos de MembroService podem ser adicionados aqui
}