import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { LivroService } from "./LivroService";
import { ClienteService } from "./ClienteService";
import { AppError } from "../utils/AppError";
import { dataHoje, somarDias } from "../utils/validacoes";

export class EmprestimoService {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly livroService: LivroService,
    private readonly clienteService: ClienteService
  ) {}

  async emprestar(livroId: number, clienteId: number, diasPrazo: number): Promise<Emprestimo> {
    if (!Number.isInteger(diasPrazo) || diasPrazo < 1 || diasPrazo > 90) {
      throw new AppError("O prazo deve ser um número inteiro de 1 a 90 dias.");
    }

    const livro = await this.livroService.buscarPorId(livroId);
    const cliente = await this.clienteService.buscarPorId(clienteId);

    if (!livro.temDisponibilidade()) {
      throw new AppError(`O livro "${livro.titulo}" não tem exemplares disponíveis.`);
    }

    const duplicado = await this.emprestimoRepository.buscarAtivo(livroId, clienteId);
    if (duplicado) {
      throw new AppError(
        `${cliente.nome} já está com um exemplar de "${livro.titulo}" (empréstimo ${duplicado.id}).`
      );
    }

    const hoje = dataHoje();
    const emprestimo = new Emprestimo(
      await this.emprestimoRepository.gerarProximoId(),
      livroId,
      clienteId,
      hoje,
      somarDias(hoje, diasPrazo)
    );

    await this.livroService.retirarExemplar(livroId);
    return this.emprestimoRepository.salvar(emprestimo);
  }

  async devolver(emprestimoId: number): Promise<Emprestimo> {
    const emprestimo = await this.buscarPorId(emprestimoId);

    if (!emprestimo.estaAtivo()) {
      throw new AppError(`O empréstimo ${emprestimoId} já foi devolvido.`);
    }

    await this.livroService.devolverExemplar(emprestimo.livroId);
    emprestimo.registrarDevolucao(dataHoje());
    return this.emprestimoRepository.salvar(emprestimo);
  }

  async listar(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.listar();
  }

  async listarAtivos(): Promise<Emprestimo[]> {
    const todos = await this.emprestimoRepository.listar();
    return todos.filter((emprestimo) => emprestimo.estaAtivo());
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) {
      throw new AppError(`Empréstimo com ID ${id} não encontrado.`);
    }
    return emprestimo;
  }
}