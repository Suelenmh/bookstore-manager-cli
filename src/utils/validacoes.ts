export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function apenasDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

export function dataValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const objeto = new Date(`${data}T00:00:00`);
  return !Number.isNaN(objeto.getTime()) && objeto.toISOString().startsWith(data);
}

export function dataHoje(): string {
  return new Date().toISOString().slice(0, 10);
}

export function somarDias(data: string, dias: number): string {
  const objeto = new Date(`${data}T00:00:00`);
  objeto.setDate(objeto.getDate() + dias);
  return objeto.toISOString().slice(0, 10);
}