import { AppError } from "../utils/AppError";

export class Livro {
  constructor(
    public readonly id: number,
    public titulo: string,
    public isbn: string,
    public anoPublicacao: number,
    public quantidadeTotal: number,
    public quantidadeDisponivel: number,
    public autorId: number
  ) {}

  temDisponibilidade(): boolean {
    return this.quantidadeDisponivel > 0;
  }

  retirarExemplar(): void {
    if (!this.temDisponibilidade()) {
      throw new AppError(`O livro "${this.titulo}" não tem exemplares disponíveis.`);
    }
    this.quantidadeDisponivel--;
  }

  devolverExemplar(): void {
    if (this.quantidadeDisponivel >= this.quantidadeTotal) {
      throw new AppError(`Todos os exemplares de "${this.titulo}" já estão na estante.`);
    }
    this.quantidadeDisponivel++;
  }
}