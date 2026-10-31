import { MenuAutores } from "./MenuAutores";
import { perguntar, pausar } from "../utils/entrada";
import { exibirTitulo, exibirErro } from "../utils/mensagens";
import { MenuLivros } from "./MenuLivros";
import { MenuClientes } from "./MenuClientes";

export class MenuPrincipal {
    constructor(
    private readonly menuAutores: MenuAutores,
    private readonly menuLivros: MenuLivros,
    private readonly menuClientes: MenuClientes
  ) {}

  async exibir(): Promise<void> {
    let executando = true;

    while (executando) {
      exibirTitulo("BOOKSTORE MANAGER CLI");
      console.log("1 - Autores");
      console.log("2 - Livros");
      console.log("3 - Clientes");
      console.log("4 - Empréstimos");
      console.log("0 - Encerrar aplicação");

      const opcao = await perguntar("\nEscolha uma opção: ");

      switch (opcao) {
        case "1":
          await this.menuAutores.exibir();
          break;
        case "2":
          await this.menuLivros.exibir();
          break;
        case "3":
          await this.menuClientes.exibir();
          break;
        case "4":
          console.log("\nMódulo em construção...");
          await pausar();
          break;
        case "0":
          executando = false;
          break;
        default:
          exibirErro("Opção inválida. Tente novamente.");
      }
    }
  }
}