import express from 'express';
import cors from 'cors';
import { LivroService } from './services/livroService';
import { MembroService } from './services/membroService';
import { EmprestimoService } from './transacoes/EmprestimoService';
import { SQLiteRepositorio } from './repositorios/SQLiteRepositorio';
import { Livro } from './livros/livro';
import { Membro } from './membros/membro';
import { Emprestimo } from './transacoes/Emprestimo';


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


    app.get('/', (req, res) => {
        res.send('API da Biblioteca em execução!');
    });

    // --- Rotas para Livros ---

    // Criar um novo livro
    app.post('/livros', async (req, res) => {
        try {
            const novoLivro: Livro = req.body;
            await livroService.adicionar(novoLivro);
            res.status(201).send(novoLivro);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao adicionar livro', error: error.message });
        }
    });

    // Listar todos os livros
    app.get('/livros', async (req, res) => {
        try {
            const livros = await livroService.listar();
            res.status(200).send(livros);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao listar livros', error: error.message });
        }
    });

    // Buscar um livro por ID
    app.get('/livros/:id', async (req, res) => {
        try {
            const livro = await livroService.buscarPorId(req.params.id);
            if (livro) {
                res.status(200).send(livro);
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao buscar livro', error: error.message });
        }
    });

    // Atualizar um livro
    app.put('/livros/:id', async (req, res) => {
        try {
            const sucesso = await livroService.atualizar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).send({ message: 'Livro atualizado com sucesso' });
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao atualizar livro', error: error.message });
        }
    });

    // Remover um livro
    app.delete('/livros/:id', async (req, res) => {
        try {
            const sucesso = await livroService.remover(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Livro removido com sucesso' });
            } else {
                res.status(404).send({ message: 'Livro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao remover livro', error: error.message });
        }
    });

    // --- Rotas para Membros ---

    // Criar um novo membro
    app.post('/membros', async (req, res) => {
        try {
            const novoMembro: Membro = req.body;
            await membroService.adicionar(novoMembro);
            res.status(201).send(novoMembro);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao adicionar membro', error: error.message });
        }
    });

    // Listar todos os membros
    app.get('/membros', async (req, res) => {
        try {
            const membros = await membroService.listar();
            res.status(200).send(membros);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao listar membros', error: error.message });
        }
    });

    // Buscar um membro por ID
    app.get('/membros/:id', async (req, res) => {
        try {
            const membro = await membroService.buscarPorId(req.params.id);
            if (membro) {
                res.status(200).send(membro);
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao buscar membro', error: error.message });
        }
    });

    // Atualizar um membro
    app.put('/membros/:id', async (req, res) => {
        try {
            const sucesso = await membroService.atualizar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).send({ message: 'Membro atualizado com sucesso' });
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao atualizar membro', error: error.message });
        }
    });

    // Remover um membro
    app.delete('/membros/:id', async (req, res) => {
        try {
            const sucesso = await membroService.remover(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Membro removido com sucesso' });
            } else {
                res.status(404).send({ message: 'Membro não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao remover membro', error: error.message });
        }
    });

    // --- Rotas para Empréstimos ---

    // Criar um novo empréstimo
    app.post('/emprestimos', async (req, res) => {
        try {
            const { livroId, membroId } = req.body;
            const sucesso = await emprestimoService.emprestarLivro(livroId, membroId);
            if (sucesso) {
                res.status(201).send({ message: 'Empréstimo realizado com sucesso' });
            } else {
                res.status(400).send({ message: 'Não foi possível realizar o empréstimo' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao realizar empréstimo', error: error.message });
        }
    });

    // Listar todos os empréstimos
    app.get('/emprestimos', async (req, res) => {
        try {
            const emprestimos = await emprestimoService.listar();
            res.status(200).send(emprestimos);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao listar empréstimos', error: error.message });
        }
    });

    // Buscar um empréstimo por ID
    app.get('/emprestimos/:id', async (req, res) => {
        try {
            const emprestimo = await emprestimoService.buscarPorId(req.params.id);
            if (emprestimo) {
                res.status(200).send(emprestimo);
            } else {
                res.status(404).send({ message: 'Empréstimo não encontrado' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao buscar empréstimo', error: error.message });
        }
    });

    // Devolver um livro (finalizar empréstimo)
    app.put('/emprestimos/:id/devolver', async (req, res) => {
        try {
            const sucesso = await emprestimoService.devolverLivro(req.params.id);
            if (sucesso) {
                res.status(200).send({ message: 'Livro devolvido com sucesso' });
            } else {
                res.status(400).send({ message: 'Não foi possível devolver o livro' });
            }
        } catch (error: any) {
            res.status(500).send({ message: 'Erro ao devolver livro', error: error.message });
        }
    });

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });
}

bootstrap();
