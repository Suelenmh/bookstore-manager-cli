import { criarDadosIniciais } from "./data/seed";
import { AutorRepository } from "./repositories/AutorRepository";
import { AutorService } from "./services/AutorService";
import { AutorController } from "./controllers/AutorController";
import { MenuAutores } from "./menus/MenuAutores";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { fecharEntrada } from "./utils/entrada";

async function main(): Promise<void> {
  try {
    const dados = criarDadosIniciais();

    const autorRepository = new AutorRepository(dados.autores);
    const autorService = new AutorService(autorRepository);
    const autorController = new AutorController(autorService);
    const menuAutores = new MenuAutores(autorController);

    const menu = new MenuPrincipal(menuAutores);
    await menu.exibir();
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  } finally {
    fecharEntrada();
    console.log("\nAplicação encerrada. Até logo!");
  }
}

main();