import { Autor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";
import { AppError } from "../utils/AppError";
import { LivroRepository } from "../repositories/LivroRepository";

export class AutorService {
    constructor(
    private readonly autorRepository: AutorRepository,
    private readonly livroRepository: LivroRepository
  ) {}
  async cadastrar(
    nome: string,
    nacionalidade: string,
    dataNascimento: string | null
  ): Promise<Autor> {
    this.validarCampos(nome, nacionalidade);

    const existente = await this.autorRepository.buscarPorNome(nome);
    if (existente) {
      throw new AppError(`Já existe um autor cadastrado com o nome "${nome}".`);
    }

    const id = await this.autorRepository.gerarProximoId();
    const autor = new Autor(id, nome, nacionalidade, dataNascimento);
    return this.autorRepository.salvar(autor);
  }

  async listar(): Promise<Autor[]> {
    return this.autorRepository.listar();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new AppError(`Autor com ID ${id} não encontrado.`);
    }
    return autor;
  }

  async atualizar(
    id: number,
    nome: string,
    nacionalidade: string,
    dataNascimento: string | null
  ): Promise<Autor> {
    const autor = await this.buscarPorId(id);
    this.validarCampos(nome, nacionalidade);

    const existente = await this.autorRepository.buscarPorNome(nome);
    if (existente && existente.id !== id) {
      throw new AppError(`Já existe outro autor com o nome "${nome}".`);
    }

    autor.nome = nome;
    autor.nacionalidade = nacionalidade;
    autor.dataNascimento = dataNascimento;
    return this.autorRepository.salvar(autor);
  }

   async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const livros = await this.livroRepository.listarPorAutor(id);
    if (livros.length > 0) {
      throw new AppError(
        `Não é possível remover: o autor possui ${livros.length} livro(s) cadastrado(s).`
      );
    }
    await this.autorRepository.remover(id);
  }

  private validarCampos(nome: string, nacionalidade: string): void {
    if (nome.trim() === "") {
      throw new AppError("O nome do autor é obrigatório.");
    }
    if (nacionalidade.trim() === "") {
      throw new AppError("A nacionalidade do autor é obrigatória.");
    }
  }
}