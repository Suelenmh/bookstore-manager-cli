import { criarDadosIniciais } from "./data/seed";
import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { ClienteRepository } from "./repositories/ClienteRepository";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { ClienteService } from "./services/ClienteService";
import { EmprestimoService } from "./services/EmprestimoService";
import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { ClienteController } from "./controllers/ClienteController";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { MenuAutores } from "./menus/MenuAutores";
import { MenuLivros } from "./menus/MenuLivros";
import { MenuClientes } from "./menus/MenuClientes";
import { MenuEmprestimos } from "./menus/MenuEmprestimos";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { fecharEntrada } from "./utils/entrada";

async function main(): Promise<void> {
  try {
    const dados = criarDadosIniciais();

    const autorRepository = new AutorRepository(dados.autores);
    const livroRepository = new LivroRepository(dados.livros);
    const clienteRepository = new ClienteRepository(dados.clientes);
    const emprestimoRepository = new EmprestimoRepository(dados.emprestimos);

    const autorService = new AutorService(autorRepository, livroRepository);
    const livroService = new LivroService(livroRepository, autorService, emprestimoRepository);
    const clienteService = new ClienteService(clienteRepository, emprestimoRepository);
    const emprestimoService = new EmprestimoService(
      emprestimoRepository,
      livroService,
      clienteService
    );

    const menuAutores = new MenuAutores(new AutorController(autorService));
    const menuLivros = new MenuLivros(new LivroController(livroService, autorService));
    const menuClientes = new MenuClientes(new ClienteController(clienteService));
    const menuEmprestimos = new MenuEmprestimos(
      new EmprestimoController(emprestimoService, livroService, clienteService)
    );

    const menu = new MenuPrincipal(menuAutores, menuLivros, menuClientes, menuEmprestimos);
    await menu.exibir();
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  } finally {
    fecharEntrada();
    console.log("\nAplicação encerrada. Até logo!");
  }
}

main();