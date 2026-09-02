import type { Aluno } from "@/lib/school-data";
import type { Usuario } from "@/lib/auth-store";

/**
 * Alunos que o usuário logado pode ver:
 * - responsável: apenas o aluno vinculado
 * - aluno: apenas ele mesmo
 * - demais perfis: todos
 */
export function alunosVisiveis(alunos: Aluno[], usuario: Usuario | null): Aluno[] {
  if (usuario?.perfil === "responsavel" && usuario.vinculo) {
    return alunos.filter((a) => a.nome === usuario.vinculo);
  }
  if (usuario?.perfil === "aluno") {
    return alunos.filter((a) => a.nome === usuario.nome);
  }
  return alunos;
}
