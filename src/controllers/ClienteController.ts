import { ClienteService } from "../services/ClienteService";
import { Cliente } from "../models/Cliente";
import { perguntar, perguntarNumero } from "../utils/entrada";
import { exibirTitulo, exibirSucesso } from "../utils/mensagens";

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  async cadastrar(): Promise<void> {
    exibirTitulo("CADASTRAR CLIENTE");
    const nome = await perguntar("Nome: ");
    const email = await perguntar("E-mail: ");
    const cpf = await perguntar("CPF (11 dígitos): ");
    const telefone = await perguntar("Telefone (opcional): ");

    const cliente = await this.clienteService.cadastrar({
      nome,
      email,
      cpf,
      telefone: telefone === "" ? null : telefone,
    });
    exibirSucesso(`Cliente "${cliente.nome}" cadastrado com ID ${cliente.id}.`);
  }

  async listar(): Promise<void> {
    exibirTitulo("LISTA DE CLIENTES");
    const clientes = await this.clienteService.listar();

    if (clientes.length === 0) {
      console.log("\nNenhum cliente cadastrado.");
      return;
    }
    clientes.forEach((cliente) => this.exibirCliente(cliente));
  }

  async consultar(): Promise<void> {
    exibirTitulo("CONSULTAR CLIENTE");
    const id = await perguntarNumero("ID do cliente: ");
    const cliente = await this.clienteService.buscarPorId(id);
    this.exibirCliente(cliente);
  }

  async atualizar(): Promise<void> {
    exibirTitulo("ATUALIZAR CLIENTE");
    const id = await perguntarNumero("ID do cliente: ");
    const atual = await this.clienteService.buscarPorId(id);

    console.log("(Deixe em branco para manter o valor atual)");
    const nome = await perguntar(`Nome [${atual.nome}]: `);
    const email = await perguntar(`E-mail [${atual.email}]: `);
    const cpf = await perguntar(`CPF [${atual.cpf}]: `);
    const telefone = await perguntar(`Telefone [${atual.telefone ?? "não informado"}]: `);

    await this.clienteService.atualizar(id, {
      nome: nome || atual.nome,
      email: email || atual.email,
      cpf: cpf || atual.cpf,
      telefone: telefone || atual.telefone,
    });
    exibirSucesso("Cliente atualizado com sucesso.");
  }

  async remover(): Promise<void> {
    exibirTitulo("REMOVER CLIENTE");
    const id = await perguntarNumero("ID do cliente: ");
    await this.clienteService.remover(id);
    exibirSucesso(`Cliente ${id} removido com sucesso.`);
  }

  private exibirCliente(cliente: Cliente): void {
    console.log(`\nID: ${cliente.id}`);
    console.log(`Nome: ${cliente.nome}`);
    console.log(`E-mail: ${cliente.email}`);
    console.log(`CPF: ${cliente.cpf}`);
    console.log(`Telefone: ${cliente.telefone ?? "não informado"}`);
  }
}