import { Livro } from "../models/Livro";
import { IRepository } from "../models/IRepository";

export class LivroRepository implements IRepository<Livro> {
  private livros: Livro[];
  private proximoId: number;

  constructor(livrosIniciais: Livro[] = []) {
    this.livros = [...livrosIniciais];
    const maiorId = livrosIniciais.reduce((maior, l) => Math.max(maior, l.id), 0);
    this.proximoId = maiorId + 1;
  }

  async listar(): Promise<Livro[]> {
    return [...this.livros];
  }

  async buscarPorId(id: number): Promise<Livro | undefined> {
    return this.livros.find((livro) => livro.id === id);
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | undefined> {
    return this.livros.find((livro) => livro.isbn === isbn);
  }

  async listarPorAutor(autorId: number): Promise<Livro[]> {
    return this.livros.filter((livro) => livro.autorId === autorId);
  }

  async salvar(livro: Livro): Promise<Livro> {
    const indice = this.livros.findIndex((l) => l.id === livro.id);
    if (indice >= 0) {
      this.livros[indice] = livro;
    } else {
      this.livros.push(livro);
    }
    return livro;
  }

  async remover(id: number): Promise<boolean> {
    const tamanhoAntes = this.livros.length;
    this.livros = this.livros.filter((livro) => livro.id !== id);
    return this.livros.length < tamanhoAntes;
  }

  gerarProximoId(): number {
    return this.proximoId++;
  }
}