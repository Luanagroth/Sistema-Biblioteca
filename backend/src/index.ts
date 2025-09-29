// backend/src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import { LivroService } from './services/livroService.js';
import { MembroService } from './services/membroService.js';
import { EmprestimoService } from './transacoes/EmprestimoService.js';
import { SQLiteRepositorio } from './repositorios/SQLiteRepositorio.js';
import { Livro } from './livros/livro.js';
import { Membro } from './membros/membro.js';
import { Emprestimo } from './transacoes/Emprestimo.js';

async function bootstrap() {
    // --- Instanciando os repositórios de forma assíncrona ---
    const livroRepositorio = await SQLiteRepositorio.create<Livro>('livros');
    const membroRepositorio = await SQLiteRepositorio.create<Membro>('membros');
    const emprestimoRepositorio = await SQLiteRepositorio.create<Emprestimo>('emprestimos');

    // --- Instanciando os serviços ---
    const livroService = new LivroService(livroRepositorio);
    const membroService = new MembroService(membroRepositorio);
    const emprestimoService = new EmprestimoService(emprestimoRepositorio, livroService, membroService);

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use(cors());


    app.get('/', (req: Request, res: Response) => {
        res.send('API da Biblioteca em execução!');
    });

    // --- Rotas para Livros ---
    app.post('/livros', async (req: Request, res: Response) => {
        try {
            const novoLivro: Livro = req.body;
            await livroService.adicionar(novoLivro);
            res.status(201).send(novoLivro);
        } catch (error: any) {
            console.error('Erro ao adicionar livro:', error);
            res.status(500).send({ message: 'Erro ao adicionar livro', error: error.message });
        }
    });

    app.get('/livros', async (req: Request, res: Response) => {
        try {
            const livros = await livroService.listar();
            res.status(200).send(livros);
        } catch (error: any) {
            console.error('Erro ao listar livros:', error);
            res.status(500).send({ message: 'Erro ao listar livros', error: error.message });
        }
    });

    app.get('/livros/:id', async (req: Request, res: Response) => {
        try {
            const livro = await livroService.buscarPorId(req.params.id);
            if (livro) {
                res.status(200).send(livro);
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao buscar livro:', error);
            res.status(500).send({ message: 'Erro ao buscar livro', error: error.message });
        }
    });

    app.put('/livros/:id', async (req: Request, res: Response) => {
        try {
            const sucesso = await livroService.atualizar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).send({ message: 'Livro atualizado com sucesso' });
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao atualizar livro:', error);
            res.status(500).send({ message: 'Erro ao atualizar livro', error: error.message });
        }
    });

    app.delete('/livros/:id', async (req: Request, res: Response) => {
        try {
            const sucesso = await livroService.remover(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Livro removido com sucesso' });
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao remover livro:', error);
            res.status(500).send({ message: 'Erro ao remover livro', error: error.message });
        }
    });

    // --- Rotas para Membros ---
    app.post('/membros', async (req: Request, res: Response) => {
        try {
            const novoMembro: Membro = req.body;
            await membroService.adicionar(novoMembro);
            res.status(201).send(novoMembro);
        } catch (error: any) {
            console.error('Erro ao adicionar membro:', error);
            res.status(500).send({ message: 'Erro ao adicionar membro', error: error.message });
        }
    });

    app.get('/membros', async (req: Request, res: Response) => {
        try {
            const membros = await membroService.listar();
            res.status(200).send(membros);
        } catch (error: any) {
            console.error('Erro ao listar membros:', error);
            res.status(500).send({ message: 'Erro ao listar membros', error: error.message });
        }
    });

    app.get('/membros/cpf/:cpf', async (req: Request, res: Response) => {
        try {
            const cpf = req.params.cpf as string;
            const membros = await membroService.buscarPorCpf(cpf);
            if (membros && membros.length > 0) {
                res.status(200).send(membros[0]);
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao buscar membro por CPF:', error);
            res.status(500).send({ message: 'Erro ao buscar membro por CPF', error: error.message });
        }
    });

    app.get('/membros/:id', async (req: Request, res: Response) => {
        try {
            const membro = await membroService.buscarPorId(req.params.id);
            if (membro) {
                res.status(200).send(membro);
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao buscar membro:', error);
            res.status(500).send({ message: 'Erro ao buscar membro', error: error.message });
        }
    });

    app.put('/membros/:id', async (req: Request, res: Response) => {
        try {
            const sucesso = await membroService.atualizar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).send({ message: 'Membro atualizado com sucesso' });
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao atualizar membro:', error);
            res.status(500).send({ message: 'Erro ao atualizar membro', error: error.message });
        }
    });

    app.delete('/membros/:id', async (req: Request, res: Response) => {
        try {
            const sucesso = await membroService.remover(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Membro removido com sucesso' });
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao remover membro:', error);
            res.status(500).send({ message: 'Erro ao remover membro', error: error.message });
        }
    });

    // --- Rotas para Empréstimos ---
    app.post('/emprestimos', async (req: Request, res: Response) => {
        try {
            const { livroId, membroId } = req.body;
            const sucesso = await emprestimoService.emprestarLivro(livroId, membroId);
            if (sucesso) {
                res.status(201).send({ message: 'Empréstimo realizado com sucesso' });
            } else {
                res.status(400).send({ message: 'Não foi possível realizar o empréstimo' });
            }
        } catch (error: any) {
            console.error('Erro ao realizar empréstimo:', error);
            res.status(500).send({ message: 'Erro ao realizar empréstimo', error: error.message });
        }
    });

    app.get('/emprestimos', async (req: Request, res: Response) => {
        try {
            const emprestimos = await emprestimoService.listar();
            res.status(200).send(emprestimos);
        } catch (error: any) {
            console.error('Erro ao listar empréstimos:', error);
            res.status(500).send({ message: 'Erro ao listar empréstimos', error: error.message });
        }
    });

    app.get('/emprestimos/:id', async (req: Request, res: Response) => {
        try {
            const emprestimo = await emprestimoService.buscarPorId(req.params.id);
            if (emprestimo) {
                res.status(200).send(emprestimo);
            } else {
                res.status(404).send({ message: 'Empréstimo não encontrado' });
            }
        } catch (error: any) {
            console.error('Erro ao buscar empréstimo:', error);
            res.status(500).send({ message: 'Erro ao buscar empréstimo', error: error.message });
        }
    });

    app.put('/emprestimos/:id/devolver', async (req: Request, res: Response) => {
        try {
            const sucesso = await emprestimoService.devolverLivro(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Livro devolvido com sucesso' });
            } else {
                res.status(400).send({ message: 'Não foi possível devolver o livro' });
            }
        } catch (error: any) {
            console.error('Erro ao devolver livro:', error);
            res.status(500).send({ message: 'Erro ao devolver livro', error: error.message });
        }
    });

    // Inicia o servidor
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

}; // Fim da função bootstrap

// Executa a função para iniciar a aplicação
bootstrap();