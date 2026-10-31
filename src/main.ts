import { criarDadosIniciais } from "./data/seed";
import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { MenuAutores } from "./menus/MenuAutores";
import { MenuLivros } from "./menus/MenuLivros";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { fecharEntrada } from "./utils/entrada";

async function main(): Promise<void> {
  try {
    const dados = criarDadosIniciais();

    const autorRepository = new AutorRepository(dados.autores);
    const livroRepository = new LivroRepository(dados.livros);

    const autorService = new AutorService(autorRepository, livroRepository);
    const livroService = new LivroService(livroRepository, autorService);

    const menuAutores = new MenuAutores(new AutorController(autorService));
    const menuLivros = new MenuLivros(new LivroController(livroService, autorService));

    const menu = new MenuPrincipal(menuAutores, menuLivros);
    await menu.exibir();
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  } finally {
    fecharEntrada();
    console.log("\nAplicação encerrada. Até logo!");
  }
}

main();