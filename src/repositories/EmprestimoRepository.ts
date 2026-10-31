import { Emprestimo } from "../models/Emprestimo";
import { IRepository } from "../models/IRepository";

export class EmprestimoRepository implements IRepository<Emprestimo> {
  private emprestimos: Emprestimo[];
  private proximoId: number;

  constructor(emprestimosIniciais: Emprestimo[] = []) {
    this.emprestimos = [...emprestimosIniciais];
    const maiorId = emprestimosIniciais.reduce((maior, e) => Math.max(maior, e.id), 0);
    this.proximoId = maiorId + 1;
  }

  async listar(): Promise<Emprestimo[]> {
    return [...this.emprestimos];
  }

  async buscarPorId(id: number): Promise<Emprestimo | undefined> {
    return this.emprestimos.find((emprestimo) => emprestimo.id === id);
  }

  async listarPorLivro(livroId: number): Promise<Emprestimo[]> {
    return this.emprestimos.filter((e) => e.livroId === livroId);
  }

  async listarPorCliente(clienteId: number): Promise<Emprestimo[]> {
    return this.emprestimos.filter((e) => e.clienteId === clienteId);
  }

  async buscarAtivo(livroId: number, clienteId: number): Promise<Emprestimo | undefined> {
    return this.emprestimos.find(
      (e) => e.livroId === livroId && e.clienteId === clienteId && e.estaAtivo()
    );
  }

  async salvar(emprestimo: Emprestimo): Promise<Emprestimo> {
    const indice = this.emprestimos.findIndex((e) => e.id === emprestimo.id);
    if (indice >= 0) {
      this.emprestimos[indice] = emprestimo;
    } else {
      this.emprestimos.push(emprestimo);
    }
    return emprestimo;
  }

  async remover(id: number): Promise<boolean> {
    const tamanhoAntes = this.emprestimos.length;
    this.emprestimos = this.emprestimos.filter((e) => e.id !== id);
    return this.emprestimos.length < tamanhoAntes;
  }

  gerarProximoId(): number {
    return this.proximoId++;
  }
}