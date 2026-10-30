export class Autor {
  constructor(
    public readonly id: number,
    public nome: string,
    public nacionalidade: string,
    public dataNascimento: string | null = null
  ) {}
}