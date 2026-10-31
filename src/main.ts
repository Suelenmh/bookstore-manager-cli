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
import { ClienteRepository } from "./repositories/ClienteRepository";
import { ClienteService } from "./services/ClienteService";
import { ClienteController } from "./controllers/ClienteController";
import { MenuClientes } from "./menus/MenuClientes";

async function main(): Promise<void> {
  try {
    const dados = criarDadosIniciais();

    const autorRepository = new AutorRepository(dados.autores);
    const livroRepository = new LivroRepository(dados.livros);

    const autorService = new AutorService(autorRepository, livroRepository);
    const livroService = new LivroService(livroRepository, autorService);

    const menuAutores = new MenuAutores(new AutorController(autorService));
    const menuLivros = new MenuLivros(new LivroController(livroService, autorService));

    const clienteRepository = new ClienteRepository(dados.clientes);
    const clienteService = new ClienteService(clienteRepository);
    const menuClientes = new MenuClientes(new ClienteController(clienteService));
    const menu = new MenuPrincipal(menuAutores, menuLivros, menuClientes);
    await menu.exibir();
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  } finally {
    fecharEntrada();
    console.log("\nAplicação encerrada. Até logo!");
  }
}

main();