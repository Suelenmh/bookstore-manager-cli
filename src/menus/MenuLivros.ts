import { LivroController } from "../controllers/LivroController";
import { perguntar, pausar } from "../utils/entrada";
import { exibirTitulo, exibirErro } from "../utils/mensagens";
import { tratarErro } from "../utils/tratarErro";

export class MenuLivros {
  constructor(private readonly livroController: LivroController) {}

  async exibir(): Promise<void> {
    let executando = true;

    while (executando) {
      exibirTitulo("MENU LIVROS");
      console.log("1 - Cadastrar livro");
      console.log("2 - Listar livros");
      console.log("3 - Consultar livro por ID");
      console.log("4 - Atualizar livro");
      console.log("5 - Remover livro");
      console.log("0 - Voltar");

      const opcao = await perguntar("\nEscolha uma opção: ");

      if (opcao === "0") {
        executando = false;
        continue;
      }

      try {
        switch (opcao) {
          case "1":
            await this.livroController.cadastrar();
            break;
          case "2":
            await this.livroController.listar();
            break;
          case "3":
            await this.livroController.consultar();
            break;
          case "4":
            await this.livroController.atualizar();
            break;
          case "5":
            await this.livroController.remover();
            break;
          default:
            exibirErro("Opção inválida. Tente novamente.");
            continue;
        }
      } catch (erro) {
        tratarErro(erro);
      }
      await pausar();
    }
  }
}