import { AppError } from "../utils/AppError";

export type StatusEmprestimo = "ATIVO" | "DEVOLVIDO";

export class Emprestimo {
  constructor(
    public readonly id: number,
    public readonly livroId: number,
    public readonly clienteId: number,
    public readonly dataEmprestimo: string,
    public readonly dataDevolucaoPrevista: string,
    public dataDevolucao: string | null = null,
    public status: StatusEmprestimo = "ATIVO"
  ) {}

  estaAtivo(): boolean {
    return this.status === "ATIVO";
  }

  registrarDevolucao(data: string): void {
    if (!this.estaAtivo()) {
      throw new AppError(`O empréstimo ${this.id} já foi devolvido.`);
    }
    this.dataDevolucao = data;
    this.status = "DEVOLVIDO";
  }
}