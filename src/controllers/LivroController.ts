import { LivroService } from "../services/LivroService";
import { AutorService } from "../services/AutorService";
import { Livro } from "../models/Livro";
import { perguntar, perguntarNumero } from "../utils/entrada";
import { exibirTitulo, exibirSucesso } from "../utils/mensagens";

export class LivroController {
  constructor(
    private readonly livroService: LivroService,
    private readonly autorService: AutorService
  ) {}

  async cadastrar(): Promise<void> {
    exibirTitulo("CADASTRAR LIVRO");
    await this.mostrarAutoresDisponiveis();

    const titulo = await perguntar("Título: ");
    const isbn = await perguntar("ISBN: ");
    const ano = await perguntarNumero("Ano de publicação: ");
    const quantidade = await perguntarNumero("Quantidade de exemplares: ");
    const autorId = await perguntarNumero("ID do autor: ");

    const livro = await this.livroService.cadastrar({
      titulo,
      isbn,
      anoPublicacao: ano,
      quantidadeTotal: quantidade,
      autorId,
    });
    exibirSucesso(`Livro "${livro.titulo}" cadastrado com ID ${livro.id}.`);
  }

  async listar(): Promise<void> {
    exibirTitulo("LISTA DE LIVROS");
    const livros = await this.livroService.listar();

    if (livros.length === 0) {
      console.log("\nNenhum livro cadastrado.");
      return;
    }
    for (const livro of livros) {
      await this.exibirLivro(livro);
    }
  }

  async consultar(): Promise<void> {
    exibirTitulo("CONSULTAR LIVRO");
    const id = await perguntarNumero("ID do livro: ");
    const livro = await this.livroService.buscarPorId(id);
    await this.exibirLivro(livro);
  }

  async atualizar(): Promise<void> {
    exibirTitulo("ATUALIZAR LIVRO");
    const id = await perguntarNumero("ID do livro: ");
    const atual = await this.livroService.buscarPorId(id);

    console.log("(Deixe em branco para manter o valor atual)");
    const titulo = await perguntar(`Título [${atual.titulo}]: `);
    const isbn = await perguntar(`ISBN [${atual.isbn}]: `);
    const ano = await perguntar(`Ano [${atual.anoPublicacao}]: `);
    const quantidade = await perguntar(`Quantidade total [${atual.quantidadeTotal}]: `);
    const autorId = await perguntar(`ID do autor [${atual.autorId}]: `);

    await this.livroService.atualizar(id, {
      titulo: titulo || atual.titulo,
      isbn: isbn || atual.isbn,
      anoPublicacao: ano === "" ? atual.anoPublicacao : Number(ano),
      quantidadeTotal: quantidade === "" ? atual.quantidadeTotal : Number(quantidade),
      autorId: autorId === "" ? atual.autorId : Number(autorId),
    });
    exibirSucesso("Livro atualizado com sucesso.");
  }

  async remover(): Promise<void> {
    exibirTitulo("REMOVER LIVRO");
    const id = await perguntarNumero("ID do livro: ");
    await this.livroService.remover(id);
    exibirSucesso(`Livro ${id} removido com sucesso.`);
  }

  private async mostrarAutoresDisponiveis(): Promise<void> {
    const autores = await this.autorService.listar();
    console.log("\nAutores disponíveis:");
    autores.forEach((a) => console.log(`  ${a.id} - ${a.nome}`));
    console.log("");
  }

  private async exibirLivro(livro: Livro): Promise<void> {
    const autor = await this.autorService.buscarPorId(livro.autorId);
    console.log(`\nID: ${livro.id}`);
    console.log(`Título: ${livro.titulo}`);
    console.log(`Autor: ${autor.nome}`);
    console.log(`ISBN: ${livro.isbn}`);
    console.log(`Ano: ${livro.anoPublicacao}`);
    console.log(`Exemplares: ${livro.quantidadeDisponivel} disponíveis de ${livro.quantidadeTotal}`);
  }
}