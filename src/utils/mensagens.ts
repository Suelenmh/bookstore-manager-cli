export function exibirTitulo(titulo: string): void {
  console.log("\n==============================");
  console.log(`  ${titulo}`);
  console.log("==============================");
}

export function exibirSucesso(mensagem: string): void {
  console.log(`\n✔ ${mensagem}`);
}

export function exibirErro(mensagem: string): void {
  console.log(`\n✖ ${mensagem}`);
}