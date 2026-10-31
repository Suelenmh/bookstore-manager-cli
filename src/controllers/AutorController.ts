import { AutorService } from "../services/AutorService";
import { Autor } from "../models/Autor";
import { perguntar, perguntarNumero } from "../utils/entrada";
import { exibirTitulo, exibirSucesso } from "../utils/mensagens";

export class AutorController {
  constructor(private readonly autorService: AutorService) {}

  async cadastrar(): Promise<void> {
    exibirTitulo("CADASTRAR AUTOR");
    const nome = await perguntar("Nome: ");
    const nacionalidade = await perguntar("Nacionalidade: ");
    const nascimento = await perguntar("Data de nascimento (AAAA-MM-DD, opcional): ");

    const autor = await this.autorService.cadastrar(
      nome,
      nacionalidade,
      nascimento === "" ? null : nascimento
    );
    exibirSucesso(`Autor "${autor.nome}" cadastrado com ID ${autor.id}.`);
  }

  async listar(): Promise<void> {
    exibirTitulo("LISTA DE AUTORES");
    const autores = await this.autorService.listar();

    if (autores.length === 0) {
      console.log("\nNenhum autor cadastrado.");
      return;
    }
    autores.forEach((autor) => this.exibirAutor(autor));
  }

  async consultar(): Promise<void> {
    exibirTitulo("CONSULTAR AUTOR");
    const id = await perguntarNumero("ID do autor: ");
    const autor = await this.autorService.buscarPorId(id);
    this.exibirAutor(autor);
  }

  async atualizar(): Promise<void> {
    exibirTitulo("ATUALIZAR AUTOR");
    const id = await perguntarNumero("ID do autor: ");
    const atual = await this.autorService.buscarPorId(id);

    console.log("(Deixe em branco para manter o valor atual)");
    const nome = await perguntar(`Nome [${atual.nome}]: `);
    const nacionalidade = await perguntar(`Nacionalidade [${atual.nacionalidade}]: `);
    const nascimento = await perguntar(
      `Nascimento [${atual.dataNascimento ?? "não informado"}]: `
    );

    await this.autorService.atualizar(
      id,
      nome || atual.nome,
      nacionalidade || atual.nacionalidade,
      nascimento || atual.dataNascimento
    );
    exibirSucesso("Autor atualizado com sucesso.");
  }

  async remover(): Promise<void> {
    exibirTitulo("REMOVER AUTOR");
    const id = await perguntarNumero("ID do autor: ");
    await this.autorService.remover(id);
    exibirSucesso(`Autor ${id} removido com sucesso.`);
  }

  private exibirAutor(autor: Autor): void {
    console.log(`\nID: ${autor.id}`);
    console.log(`Nome: ${autor.nome}`);
    console.log(`Nacionalidade: ${autor.nacionalidade}`);
    console.log(`Nascimento: ${autor.dataNascimento ?? "não informado"}`);
  }
}