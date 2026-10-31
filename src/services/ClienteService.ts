import { Cliente } from "../models/Cliente";
import { DadosCliente } from "../models/DadosCliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { AppError } from "../utils/AppError";
import { apenasDigitos, emailValido } from "../utils/validacoes";

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async cadastrar(dados: DadosCliente): Promise<Cliente> {
    const cpf = apenasDigitos(dados.cpf);
    this.validarCampos(dados, cpf);
    await this.garantirUnicidade(dados.email, cpf);

    const cliente = new Cliente(
      this.clienteRepository.gerarProximoId(),
      dados.nome,
      dados.email,
      cpf,
      dados.telefone
    );
    return this.clienteRepository.salvar(cliente);
  }

  async listar(): Promise<Cliente[]> {
    return this.clienteRepository.listar();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new AppError(`Cliente com ID ${id} não encontrado.`);
    }
    return cliente;
  }

  async atualizar(id: number, dados: DadosCliente): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    const cpf = apenasDigitos(dados.cpf);
    this.validarCampos(dados, cpf);
    await this.garantirUnicidade(dados.email, cpf, id);

    cliente.nome = dados.nome;
    cliente.email = dados.email;
    cliente.cpf = cpf;
    cliente.telefone = dados.telefone;
    return this.clienteRepository.salvar(cliente);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.clienteRepository.remover(id);
  }

  private async garantirUnicidade(email: string, cpf: string, idIgnorado?: number): Promise<void> {
    const porEmail = await this.clienteRepository.buscarPorEmail(email);
    if (porEmail && porEmail.id !== idIgnorado) {
      throw new AppError(`Já existe um cliente com o e-mail "${email}".`);
    }
    const porCpf = await this.clienteRepository.buscarPorCpf(cpf);
    if (porCpf && porCpf.id !== idIgnorado) {
      throw new AppError("Já existe um cliente com este CPF.");
    }
  }

  private validarCampos(dados: DadosCliente, cpf: string): void {
    if (dados.nome.trim() === "") {
      throw new AppError("O nome do cliente é obrigatório.");
    }
    if (!emailValido(dados.email)) {
      throw new AppError("E-mail inválido. Exemplo: nome@email.com");
    }
    if (cpf.length !== 11) {
      throw new AppError("O CPF deve ter 11 dígitos.");
    }
  }
}