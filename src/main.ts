import { MenuPrincipal } from "./menus/MenuPrincipal";
import { fecharEntrada } from "./utils/entrada";

async function main(): Promise<void> {
  try {
    const menu = new MenuPrincipal();
    await menu.exibir();
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  } finally {
    fecharEntrada();
    console.log("\nAplicação encerrada. Até logo!");
  }
}

main();