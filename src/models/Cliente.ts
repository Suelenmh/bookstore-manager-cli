export class Cliente {
  constructor(
    public readonly id: number,
    public nome: string,
    public email: string,
    public cpf: string,
    public telefone: string | null = null
  ) {}
}