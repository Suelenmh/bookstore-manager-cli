import { AppError } from "./AppError";
import { exibirErro } from "./mensagens";

export function tratarErro(erro: unknown): void {
  if (erro instanceof AppError) {
    exibirErro(erro.message);
  } else {
    exibirErro("Ocorreu um erro inesperado.");
    console.error(erro);
  }
}