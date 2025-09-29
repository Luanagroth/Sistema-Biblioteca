// backend/src/transacoes/EmprestimoService.ts

// Importações corrigidas e organizadas no topo
import { IRepositorio } from '../repositorios/IRepositorio.js';
import { Emprestimo } from './Emprestimo.js';
import { LivroService } from '../services/livroService.js';
import { MembroService } from '../services/membroService.js';
import { BaseServico } from '../compartilhado/BaseServico.js';
import { v4 as uuidv4 } from 'uuid';
import { Livro } from '../livros/livro.js';
import { Membro } from '../membros/membro.js';

export class EmprestimoService extends BaseServico<Emprestimo> {
    constructor(
        // Agora usamos o IRepositorio importado lá em cima, de forma mais limpa
        repositorio: IRepositorio<Emprestimo>,
        private livroService: LivroService,
        private membroService: MembroService
    ) {
        super(repositorio);
    }

    async emprestarLivro(livroId: string, membroId: string): Promise<boolean> {
        const livro = await this.livroService.buscarPorId(livroId);
        const membro = await this.membroService.buscarPorId(membroId);

        if (!this.validarEmprestimo(livro, membro)) {
            return false;
        }

        // Assegurando que livro não é undefined antes de usar
        if (livro) {
            await this.livroService.atualizar(livroId, { disponivel: false });

            const novoEmprestimo: Emprestimo = {
                id: uuidv4(),
                livroId,
                membroId,
                dataEmprestimo: new Date().toISOString(),
            };
            await this.adicionar(novoEmprestimo);
            return true;
        }
        return false;
    }

    async devolverLivro(emprestimoId: string): Promise<boolean> {
        const emprestimo = await this.buscarPorId(emprestimoId);
        if (!emprestimo || emprestimo.dataDevolucao) {
            return false;
        }

        await this.livroService.atualizar(emprestimo.livroId, { disponivel: true });

        const emprestimoDevolvido = { ...emprestimo, dataDevolucao: new Date().toISOString() };
        return await this.atualizar(emprestimoId, emprestimoDevolvido);
    }

    protected validarEmprestimo(livro: Livro | undefined, membro: Membro | undefined): boolean {
        // A '!!' converte o valor para booleano (true/false)
        return !!livro && !!membro && livro.disponivel && membro.ativo;
    }
}