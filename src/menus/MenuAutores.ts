import { AutorController } from "../controllers/AutorController";
import { AppError } from "../utils/AppError";
import { perguntar, pausar } from "../utils/entrada";
import { exibirTitulo, exibirErro } from "../utils/mensagens";

export class MenuAutores {
  constructor(private readonly autorController: AutorController) {}

  async exibir(): Promise<void> {
    let executando = true;

    while (executando) {
      exibirTitulo("MENU AUTORES");
      console.log("1 - Cadastrar autor");
      console.log("2 - Listar autores");
      console.log("3 - Consultar autor por ID");
      console.log("4 - Atualizar autor");
      console.log("5 - Remover autor");
      console.log("0 - Voltar");

      const opcao = await perguntar("\nEscolha uma opção: ");

      if (opcao === "0") {
        executando = false;
        continue;
      }

      try {
        switch (opcao) {
          case "1":
            await this.autorController.cadastrar();
            break;
          case "2":
            await this.autorController.listar();
            break;
          case "3":
            await this.autorController.consultar();
            break;
          case "4":
            await this.autorController.atualizar();
            break;
          case "5":
            await this.autorController.remover();
            break;
          default:
            exibirErro("Opção inválida. Tente novamente.");
            continue;
        }
      } catch (erro) {
        if (erro instanceof AppError) {
          exibirErro(erro.message);
        } else {
          exibirErro("Ocorreu um erro inesperado.");
          console.error(erro);
        }
      }
      await pausar();
    }
  }
}