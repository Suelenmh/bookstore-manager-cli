import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AppError } from "./AppError";

const interfaceLeitura = readline.createInterface({ input, output });

export async function perguntar(texto: string): Promise<string> {
  const resposta = await interfaceLeitura.question(texto);
  return resposta.trim();
}

export async function perguntarNumero(texto: string): Promise<number> {
  const resposta = await perguntar(texto);
  const numero = Number(resposta);
  if (resposta === "" || !Number.isInteger(numero)) {
    throw new AppError("Digite um número inteiro válido.");
  }
  return numero;
}

export async function pausar(): Promise<void> {
  await perguntar("\nPressione ENTER para continuar...");
}

export function fecharEntrada(): void {
  interfaceLeitura.close();
}