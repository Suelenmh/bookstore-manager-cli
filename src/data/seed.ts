import { Autor } from "../models/Autor";
import { Livro } from "../models/Livro";
import { Cliente } from "../models/Cliente";
import { Emprestimo } from "../models/Emprestimo";

export interface DadosIniciais {
  autores: Autor[];
  livros: Livro[];
  clientes: Cliente[];
  emprestimos: Emprestimo[];
}

export function criarDadosIniciais(): DadosIniciais {
  const autores = [
    new Autor(1, "Machado de Assis", "Brasileira", "1839-06-21"),
    new Autor(2, "Clarice Lispector", "Brasileira", "1920-12-10"),
    new Autor(3, "George Orwell", "Britânica", "1903-06-25"),
    new Autor(4, "J.K. Rowling", "Britânica", "1965-07-31"),
  ];

  const livros = [
    new Livro(1, "Dom Casmurro", "978-85-0001-001-1", 1899, 3, 2, 1),
    new Livro(2, "Memórias Póstumas de Brás Cubas", "978-85-0001-002-2", 1881, 2, 2, 1),
    new Livro(3, "A Hora da Estrela", "978-85-0001-003-3", 1977, 2, 1, 2),
    new Livro(4, "Laços de Família", "978-85-0001-004-4", 1960, 1, 0, 2),
    new Livro(5, "1984", "978-85-0001-005-5", 1949, 3, 2, 3),
    new Livro(6, "A Revolução dos Bichos", "978-85-0001-006-6", 1945, 2, 2, 3),
    new Livro(7, "Harry Potter e a Pedra Filosofal", "978-85-0001-007-7", 1997, 4, 3, 4),
    new Livro(8, "Harry Potter e a Câmara Secreta", "978-85-0001-008-8", 1998, 2, 2, 4),
  ];

  const clientes = [
    new Cliente(1, "Ana Souza", "ana.souza@email.com", "12345678901", "(11) 91111-1111"),
    new Cliente(2, "Bruno Lima", "bruno.lima@email.com", "23456789012", "(11) 92222-2222"),
    new Cliente(3, "Carla Mendes", "carla.mendes@email.com", "34567890123", "(21) 93333-3333"),
    new Cliente(4, "Diego Alves", "diego.alves@email.com", "45678901234", "(31) 94444-4444"),
    new Cliente(5, "Elisa Rocha", "elisa.rocha@email.com", "56789012345", "(41) 95555-5555"),
    new Cliente(6, "Fábio Torres", "fabio.torres@email.com", "67890123456", "(51) 96666-6666"),
  ];

  const emprestimos = [
    new Emprestimo(1, 1, 1, "2026-10-01", "2026-10-15", "2026-10-10", "DEVOLVIDO"),
    new Emprestimo(2, 1, 2, "2026-10-05", "2026-10-19", null, "ATIVO"),
    new Emprestimo(3, 3, 3, "2026-10-06", "2026-10-20", null, "ATIVO"),
    new Emprestimo(4, 4, 2, "2026-10-08", "2026-10-22", null, "ATIVO"),
    new Emprestimo(5, 5, 4, "2026-09-20", "2026-10-04", "2026-10-02", "DEVOLVIDO"),
    new Emprestimo(6, 5, 1, "2026-10-12", "2026-10-26", null, "ATIVO"),
    new Emprestimo(7, 7, 5, "2026-10-14", "2026-10-28", null, "ATIVO"),
    new Emprestimo(8, 7, 3, "2026-09-25", "2026-10-09", "2026-10-08", "DEVOLVIDO"),
  ];

  return { autores, livros, clientes, emprestimos };
}