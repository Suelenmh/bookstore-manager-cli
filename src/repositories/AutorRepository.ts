import { Autor } from "../models/Autor";
import { IRepository } from "../models/IRepository";

export class AutorRepository implements IRepository<Autor> {
  private autores: Autor[];
  private proximoId: number;

  constructor(autoresIniciais: Autor[] = []) {
    this.autores = [...autoresIniciais];
    const maiorId = autoresIniciais.reduce((maior, a) => Math.max(maior, a.id), 0);
    this.proximoId = maiorId + 1;
  }

  async listar(): Promise<Autor[]> {
    return [...this.autores];
  }

  async buscarPorId(id: number): Promise<Autor | undefined> {
    return this.autores.find((autor) => autor.id === id);
  }

  async buscarPorNome(nome: string): Promise<Autor | undefined> {
    return this.autores.find(
      (autor) => autor.nome.toLowerCase() === nome.toLowerCase()
    );
  }

  async salvar(autor: Autor): Promise<Autor> {
    const indice = this.autores.findIndex((a) => a.id === autor.id);
    if (indice >= 0) {
      this.autores[indice] = autor;
    } else {
      this.autores.push(autor);
    }
    return autor;
  }

  async remover(id: number): Promise<boolean> {
    const tamanhoAntes = this.autores.length;
    this.autores = this.autores.filter((autor) => autor.id !== id);
    return this.autores.length < tamanhoAntes;
  }

    async gerarProximoId(): Promise<number> {
    return this.proximoId++;
  }
}