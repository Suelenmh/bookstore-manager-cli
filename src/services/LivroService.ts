import { Livro } from "../models/Livro";
import { DadosLivro } from "../models/DadosLivro";
import { LivroRepository } from "../repositories/LivroRepository";
import { AutorService } from "./AutorService";
import { AppError } from "../utils/AppError";

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorService: AutorService
  ) {}

  async cadastrar(dados: DadosLivro): Promise<Livro> {
    this.validarCampos(dados);
    await this.autorService.buscarPorId(dados.autorId);
    await this.garantirIsbnUnico(dados.isbn);

    const livro = new Livro(
      this.livroRepository.gerarProximoId(),
      dados.titulo,
      dados.isbn,
      dados.anoPublicacao,
      dados.quantidadeTotal,
      dados.quantidadeTotal,
      dados.autorId
    );
    return this.livroRepository.salvar(livro);
  }

  async listar(): Promise<Livro[]> {
    return this.livroRepository.listar();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) {
      throw new AppError(`Livro com ID ${id} não encontrado.`);
    }
    return livro;
  }

  async atualizar(id: number, dados: DadosLivro): Promise<Livro> {
    const livro = await this.buscarPorId(id);
    this.validarCampos(dados);
    await this.autorService.buscarPorId(dados.autorId);
    await this.garantirIsbnUnico(dados.isbn, id);

    const emprestados = livro.quantidadeTotal - livro.quantidadeDisponivel;
    if (dados.quantidadeTotal < emprestados) {
      throw new AppError(
        `A quantidade total não pode ser menor que ${emprestados} (exemplares emprestados no momento).`
      );
    }

    livro.titulo = dados.titulo;
    livro.isbn = dados.isbn;
    livro.anoPublicacao = dados.anoPublicacao;
    livro.autorId = dados.autorId;
    livro.quantidadeTotal = dados.quantidadeTotal;
    livro.quantidadeDisponivel = dados.quantidadeTotal - emprestados;
    return this.livroRepository.salvar(livro);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.livroRepository.remover(id);
  }

  private async garantirIsbnUnico(isbn: string, idIgnorado?: number): Promise<void> {
    const existente = await this.livroRepository.buscarPorIsbn(isbn);
    if (existente && existente.id !== idIgnorado) {
      throw new AppError(`Já existe um livro cadastrado com o ISBN "${isbn}".`);
    }
  }

  private validarCampos(dados: DadosLivro): void {
    if (dados.titulo.trim() === "") {
      throw new AppError("O título do livro é obrigatório.");
    }
    if (dados.isbn.trim() === "") {
      throw new AppError("O ISBN do livro é obrigatório.");
    }
    const anoAtual = new Date().getFullYear();
    if (!Number.isInteger(dados.anoPublicacao) || dados.anoPublicacao <= 0 || dados.anoPublicacao > anoAtual) {
      throw new AppError(`O ano de publicação deve ser um número entre 1 e ${anoAtual}.`);
    }
    if (!Number.isInteger(dados.quantidadeTotal) || dados.quantidadeTotal < 1) {
      throw new AppError("A quantidade de exemplares deve ser um número inteiro maior que zero.");
    }
    if (!Number.isInteger(dados.autorId)) {
      throw new AppError("O ID do autor deve ser um número inteiro.");
    }
  }
}