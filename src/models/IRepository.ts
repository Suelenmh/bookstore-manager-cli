export interface IRepository<T> {
  listar(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | undefined>;
  salvar(entidade: T): Promise<T>;
  remover(id: number): Promise<boolean>;
  gerarProximoId(): Promise<number>;
}