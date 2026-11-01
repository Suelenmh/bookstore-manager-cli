import { Cliente } from "../models/Cliente";
import { IRepository } from "../models/IRepository";

export class ClienteRepository implements IRepository<Cliente> {
  private clientes: Cliente[];
  private proximoId: number;

  constructor(clientesIniciais: Cliente[] = []) {
    this.clientes = [...clientesIniciais];
    const maiorId = clientesIniciais.reduce((maior, c) => Math.max(maior, c.id), 0);
    this.proximoId = maiorId + 1;
  }

  async listar(): Promise<Cliente[]> {
    return [...this.clientes];
  }

  async buscarPorId(id: number): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.id === id);
  }

  async buscarPorEmail(email: string): Promise<Cliente | undefined> {
    return this.clientes.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }

  async buscarPorCpf(cpf: string): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.cpf === cpf);
  }

  async salvar(cliente: Cliente): Promise<Cliente> {
    const indice = this.clientes.findIndex((c) => c.id === cliente.id);
    if (indice >= 0) {
      this.clientes[indice] = cliente;
    } else {
      this.clientes.push(cliente);
    }
    return cliente;
  }

  async remover(id: number): Promise<boolean> {
    const tamanhoAntes = this.clientes.length;
    this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
    return this.clientes.length < tamanhoAntes;
  }

    async gerarProximoId(): Promise<number> {
    return this.proximoId++;
  }
}