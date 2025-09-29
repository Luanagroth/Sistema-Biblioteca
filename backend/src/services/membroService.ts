import { Membro } from '../membros/membro.js';
import { BaseServico } from '../compartilhado/BaseServico.js';
import { IRepositorio } from '../repositorios/IRepositorio.js';

export class MembroService extends BaseServico<Membro> {
    constructor(repositorio: IRepositorio<Membro>) {
        super(repositorio);
    }

    // Este método específico já estava correto e vai continuar funcionando
    async buscarPorCpf(cpf: string): Promise<Membro[]> {
        return this.buscarPor('cpf' as keyof Membro, cpf);
    }
}