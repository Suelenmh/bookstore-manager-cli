import { ClienteController } from "../controllers/ClienteController";
import { perguntar, pausar } from "../utils/entrada";
import { exibirTitulo, exibirErro } from "../utils/mensagens";
import { tratarErro } from "../utils/tratarErro";

export class MenuClientes {
  constructor(private readonly clienteController: ClienteController) {}

  async exibir(): Promise<void> {
    let executando = true;

    while (executando) {
      exibirTitulo("MENU CLIENTES");
      console.log("1 - Cadastrar cliente");
      console.log("2 - Listar clientes");
      console.log("3 - Consultar cliente por ID");
      console.log("4 - Atualizar cliente");
      console.log("5 - Remover cliente");
      console.log("0 - Voltar");

      const opcao = await perguntar("\nEscolha uma opção: ");

      if (opcao === "0") {
        executando = false;
        continue;
      }

      try {
        switch (opcao) {
          case "1":
            await this.clienteController.cadastrar();
            break;
          case "2":
            await this.clienteController.listar();
            break;
          case "3":
            await this.clienteController.consultar();
            break;
          case "4":
            await this.clienteController.atualizar();
            break;
          case "5":
            await this.clienteController.remover();
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