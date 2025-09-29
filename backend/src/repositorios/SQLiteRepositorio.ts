import { IRepositorio } from './IRepositorio';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

export class SQLiteRepositorio<T extends { id: string }> implements IRepositorio<T> {
    private db: sqlite.Database;
    private tableName: string;

    private constructor(db: sqlite.Database, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    static async create<T extends { id: string }>(tableName: string): Promise<SQLiteRepositorio<T>> {
        const db = await sqlite.open({
            filename: './database.sqlite',
            driver: sqlite3.Database,
        });
        const repo = new SQLiteRepositorio<T>(db, tableName);
        await repo.createTable();
        return repo;
    }

    private async createTable(): Promise<void> {
        const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id TEXT PRIMARY KEY,
      data TEXT
    )`;
        await this.db.run(sql);
    }



    async adicionar(item: T): Promise<void> {
        if (!item.id) {
            throw new Error('O item deve ter um ID para ser adicionado.');
        }
        const data = JSON.stringify(item);
        const sql = `INSERT INTO ${this.tableName} (id, data) VALUES (?, ?)`;
        await this.db.run(sql, [item.id, data]);
    }


    async buscarPorId(id: string): Promise<T | undefined> {
        const sql = `SELECT data FROM ${this.tableName} WHERE id = ?`;
        const row = await this.db.get(sql, [id]);
        return row ? JSON.parse(row.data) : undefined;
    }

    async buscarPor(campo: keyof T, valor: any): Promise<T[]> {
        const sql = `SELECT data FROM ${this.tableName} WHERE JSON_EXTRACT(data, '$.${String(campo)}') = ?`;
        const rows = await this.db.all(sql, [valor]);
        return rows.map(row => JSON.parse(row.data));
    }


    async listar(): Promise<T[]> {
        const sql = `SELECT data FROM ${this.tableName}`;
        try {
            const rows = await this.db.all(sql);
            return rows.map(row => {
                try {
                    return JSON.parse(row.data);
                } catch (parseError) {
                    console.error(`Erro ao parsear JSON para o item na tabela ${this.tableName}:`, row.data, parseError);
                    // Retorna um objeto vazio ou lança um erro para ignorar o item corrompido
                    return {};
                }
            });
        } catch (dbError: any) {
            console.error(`Erro na query SQL para listar ${this.tableName}:`, dbError);
            // Relança o erro para que o Express o capture e envie a resposta 500
            throw dbError;
        }
    }

    

    async atualizar(id: string, itemAtualizado: Partial<T>): Promise<boolean> {
        const sql = `UPDATE ${this.tableName} SET data = ? WHERE id = ?`;
        const item = await this.buscarPorId(id);
        if (!item) return false;
        const itemMesclado = { ...item, ...itemAtualizado };
        const data = JSON.stringify(itemMesclado);
        const result = await this.db.run(sql, [data, id]);
        return result.changes !== undefined && result.changes > 0;
    }

    async remover(id: string): Promise<boolean> {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = await this.db.run(sql, [id]);
        return result.changes !== undefined && result.changes > 0;
    }
}