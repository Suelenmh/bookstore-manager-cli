import { EmprestimoService } from "../services/EmprestimoService";
import { LivroService } from "../services/LivroService";
import { ClienteService } from "../services/ClienteService";
import { Emprestimo } from "../models/Emprestimo";
import { perguntar, perguntarNumero } from "../utils/entrada";
import { exibirTitulo, exibirSucesso } from "../utils/mensagens";

export class EmprestimoController {
  constructor(
    private readonly emprestimoService: EmprestimoService,
    private readonly livroService: LivroService,
    private readonly clienteService: ClienteService
  ) {}

  async emprestar(): Promise<void> {
    exibirTitulo("REGISTRAR EMPRÉSTIMO");
    await this.mostrarLivrosDisponiveis();

    const livroId = await perguntarNumero("ID do livro: ");
    const clienteId = await perguntarNumero("ID do cliente: ");
    const textoPrazo = await perguntar("Prazo em dias [14]: ");
    const prazo = textoPrazo === "" ? 14 : Number(textoPrazo);

    const emprestimo = await this.emprestimoService.emprestar(livroId, clienteId, prazo);
    exibirSucesso(
      `Empréstimo ${emprestimo.id} registrado. Devolução prevista: ${emprestimo.dataDevolucaoPrevista}.`
    );
  }

  async devolver(): Promise<void> {
    exibirTitulo("REGISTRAR DEVOLUÇÃO");
    const ativos = await this.emprestimoService.listarAtivos();
    if (ativos.length === 0) {
      console.log("\nNão há empréstimos ativos.");
      return;
    }
    console.log("\nEmpréstimos ativos:");
    for (const emprestimo of ativos) {
      await this.exibirEmprestimo(emprestimo);
    }

    const id = await perguntarNumero("\nID do empréstimo a devolver: ");
    await this.emprestimoService.devolver(id);
    exibirSucesso(`Devolução do empréstimo ${id} registrada.`);
  }

  async listar(): Promise<void> {
    exibirTitulo("TODOS OS EMPRÉSTIMOS");
    const emprestimos = await this.emprestimoService.listar();
    await this.exibirLista(emprestimos);
  }

  async listarAtivos(): Promise<void> {
    exibirTitulo("EMPRÉSTIMOS ATIVOS");
    const emprestimos = await this.emprestimoService.listarAtivos();
    await this.exibirLista(emprestimos);
  }

  async consultar(): Promise<void> {
    exibirTitulo("CONSULTAR EMPRÉSTIMO");
    const id = await perguntarNumero("ID do empréstimo: ");
    const emprestimo = await this.emprestimoService.buscarPorId(id);
    await this.exibirEmprestimo(emprestimo);
  }

  private async mostrarLivrosDisponiveis(): Promise<void> {
    const livros = await this.livroService.listar();
    console.log("\nLivros com exemplares disponíveis:");
    livros
      .filter((livro) => livro.temDisponibilidade())
      .forEach((livro) =>
        console.log(`  ${livro.id} - ${livro.titulo} (${livro.quantidadeDisponivel} disp.)`)
      );
    console.log("");
  }

  private async exibirLista(emprestimos: Emprestimo[]): Promise<void> {
    if (emprestimos.length === 0) {
      console.log("\nNenhum empréstimo encontrado.");
      return;
    }
    for (const emprestimo of emprestimos) {
      await this.exibirEmprestimo(emprestimo);
    }
  }

  private async exibirEmprestimo(emprestimo: Emprestimo): Promise<void> {
    const livro = await this.livroService.buscarPorId(emprestimo.livroId);
    const cliente = await this.clienteService.buscarPorId(emprestimo.clienteId);

    console.log(`\nEmpréstimo ${emprestimo.id} [${emprestimo.status}]`);
    console.log(`Livro: ${livro.titulo}`);
    console.log(`Cliente: ${cliente.nome}`);
    console.log(`Data do empréstimo: ${emprestimo.dataEmprestimo}`);
    console.log(`Devolução prevista: ${emprestimo.dataDevolucaoPrevista}`);
    console.log(`Devolvido em: ${emprestimo.dataDevolucao ?? "-"}`);
  }
}