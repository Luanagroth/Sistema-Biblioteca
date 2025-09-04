import { Emprestimo } from './Emprestimo';
import { LivroService } from '../servicos/livroService';
import { MembroService } from '../membros/membroService';
import { BaseServico } from '../compartilhado/BaseServico';
import { Livro } from '../livros/livro';
import { Membro } from '../membros/membro';

export class EmprestimoService extends BaseServico<Emprestimo> {
  constructor(
    repositorio: import('../repositorios/IRepositorio').IRepositorio<Emprestimo>,
    private livroService: LivroService,
    private membroService: MembroService
  ) {
    super(repositorio);
  }

  async emprestarLivro(livroId: string, membroId: string): Promise<boolean> {
    const livro = await this.livroService.buscarPorId(livroId);
    const membro = await this.membroService.buscarPorId(membroId);
    if (!livro || !membro || !livro.disponivel) {
      return false;
    }
    // SRP: Cada serviço tem uma única responsabilidade (EmprestimoService gerencia empréstimos)
    // DIP: EmprestimoService depende de abstrações (LivroService, MembroService) via injeção de dependência
    // OCP: EmprestimoService pode ser estendido por herança sem modificar o código existente
    // Marcar livro como indisponível
    await this.livroService.atualizar(livroId, { disponivel: false });
    // Criar empréstimo
    const emprestimo: Emprestimo = {
      id: this.gerarId(),
      livroId,
      membroId,
      dataEmprestimo: new Date(),
    };
    await this.adicionar(emprestimo);
    return true;
  }

  async devolverLivro(emprestimoId: string): Promise<boolean> {
    const emprestimo = await this.buscarPorId(emprestimoId);
    if (!emprestimo || emprestimo.dataDevolucao) {
      return false;
    }
    emprestimo.dataDevolucao = new Date();
    await this.atualizar(emprestimoId, { dataDevolucao: emprestimo.dataDevolucao });
    // Marcar livro como disponível
    await this.livroService.atualizar(emprestimo.livroId, { disponivel: true });
    return true;
  }

  // Método para gerar IDs únicos (simples para exemplo)
  private gerarId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // OCP: métodos de validação podem ser sobrescritos em subclasses
  protected validarEmprestimo(livro: Livro, membro: Membro): boolean {
    return livro.disponivel && membro.ativo;
  }
}
