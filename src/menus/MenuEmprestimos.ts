import { EmprestimoController } from "../controllers/EmprestimoController";
import { perguntar, pausar } from "../utils/entrada";
import { exibirTitulo, exibirErro } from "../utils/mensagens";
import { tratarErro } from "../utils/tratarErro";

export class MenuEmprestimos {
  constructor(private readonly emprestimoController: EmprestimoController) {}

  async exibir(): Promise<void> {
    let executando = true;

    while (executando) {
      exibirTitulo("MENU EMPRÉSTIMOS");
      console.log("1 - Registrar empréstimo");
      console.log("2 - Registrar devolução");
      console.log("3 - Listar todos os empréstimos");
      console.log("4 - Listar empréstimos ativos");
      console.log("5 - Consultar empréstimo por ID");
      console.log("0 - Voltar");

      const opcao = await perguntar("\nEscolha uma opção: ");

      if (opcao === "0") {
        executando = false;
        continue;
      }

      try {
        switch (opcao) {
          case "1":
            await this.emprestimoController.emprestar();
            break;
          case "2":
            await this.emprestimoController.devolver();
            break;
          case "3":
            await this.emprestimoController.listar();
            break;
          case "4":
            await this.emprestimoController.listarAtivos();
            break;
          case "5":
            await this.emprestimoController.consultar();
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