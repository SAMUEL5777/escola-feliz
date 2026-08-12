export type Aluno = {
  id: string;
  nome: string;
  turma: string;
  responsavel: string;
  frequencia: number;
  media: number;
  situacao: "Aprovado" | "Recuperação" | "Reprovado";
};

export type Professor = {
  id: string;
  nome: string;
  disciplina: string;
  turmas: string[];
  email: string;
};

export type Turma = {
  id: string;
  nome: string;
  turno: "Manhã" | "Tarde";
  alunos: number;
  sala: string;
  regente: string;
};

export const alunos: Aluno[] = [
  { id: "2024001", nome: "Ana Beatriz Ferreira", turma: "9º A", responsavel: "Marcos Ferreira", frequencia: 96, media: 8.7, situacao: "Aprovado" },
  { id: "2024002", nome: "Bruno Almeida Souza", turma: "9º A", responsavel: "Cláudia Souza", frequencia: 81, media: 6.2, situacao: "Recuperação" },
  { id: "2024003", nome: "Carla Nunes Dias", turma: "8º B", responsavel: "Roberto Dias", frequencia: 99, media: 9.4, situacao: "Aprovado" },
  { id: "2024004", nome: "Diego Martins Rocha", turma: "8º B", responsavel: "Sandra Rocha", frequencia: 68, media: 4.8, situacao: "Reprovado" },
  { id: "2024005", nome: "Eduarda Lima Castro", turma: "7º A", responsavel: "Paulo Castro", frequencia: 92, media: 7.9, situacao: "Aprovado" },
  { id: "2024006", nome: "Felipe Andrade Pinto", turma: "7º A", responsavel: "Regina Pinto", frequencia: 88, media: 7.1, situacao: "Aprovado" },
  { id: "2024007", nome: "Gabriela Moreira Reis", turma: "9º B", responsavel: "Antônio Reis", frequencia: 74, media: 5.9, situacao: "Recuperação" },
  { id: "2024008", nome: "Henrique Barbosa Melo", turma: "9º B", responsavel: "Luciana Melo", frequencia: 95, media: 8.3, situacao: "Aprovado" },
];

export const professores: Professor[] = [
  { id: "P01", nome: "Helena Vasconcelos", disciplina: "Matemática", turmas: ["9º A", "9º B"], email: "helena@escola.edu.br" },
  { id: "P02", nome: "Ricardo Tavares", disciplina: "Português", turmas: ["8º B", "7º A"], email: "ricardo@escola.edu.br" },
  { id: "P03", nome: "Juliana Prado", disciplina: "Ciências", turmas: ["9º A", "8º B"], email: "juliana@escola.edu.br" },
  { id: "P04", nome: "Marcelo Aguiar", disciplina: "História", turmas: ["7º A", "9º B"], email: "marcelo@escola.edu.br" },
  { id: "P05", nome: "Patrícia Gomes", disciplina: "Geografia", turmas: ["8º B", "9º A"], email: "patricia@escola.edu.br" },
];

export const turmas: Turma[] = [
  { id: "T1", nome: "7º A", turno: "Manhã", alunos: 28, sala: "12", regente: "Ricardo Tavares" },
  { id: "T2", nome: "8º B", turno: "Manhã", alunos: 31, sala: "14", regente: "Juliana Prado" },
  { id: "T3", nome: "9º A", turno: "Tarde", alunos: 26, sala: "07", regente: "Helena Vasconcelos" },
  { id: "T4", nome: "9º B", turno: "Tarde", alunos: 24, sala: "09", regente: "Marcelo Aguiar" },
];

export const disciplinas = ["Matemática", "Português", "Ciências", "História", "Geografia"];

export const notas = alunos.map((a) => ({
  aluno: a.nome,
  turma: a.turma,
  bimestres: [
    Number((a.media + (Math.round(Math.sin(a.id.charCodeAt(6)) * 10) / 10)).toFixed(1)),
    Number((a.media - 0.4).toFixed(1)),
    Number((a.media + 0.6).toFixed(1)),
    Number(a.media.toFixed(1)),
  ].map((n) => Math.max(0, Math.min(10, n))),
}));

export const frequenciaMensal = [
  { mes: "Fev", presenca: 94 },
  { mes: "Mar", presenca: 91 },
  { mes: "Abr", presenca: 89 },
  { mes: "Mai", presenca: 93 },
  { mes: "Jun", presenca: 87 },
  { mes: "Ago", presenca: 90 },
];

export const desempenhoPorDisciplina = [
  { disciplina: "Mat", media: 7.2 },
  { disciplina: "Port", media: 8.1 },
  { disciplina: "Ciên", media: 7.8 },
  { disciplina: "Hist", media: 8.4 },
  { disciplina: "Geo", media: 7.6 },
];

export const agenda = [
  { data: "12 Ago", titulo: "Conselho de classe — 9º ano", tipo: "Reunião" },
  { data: "15 Ago", titulo: "Prova bimestral de Matemática", tipo: "Avaliação" },
  { data: "18 Ago", titulo: "Entrega de boletins", tipo: "Secretaria" },
  { data: "22 Ago", titulo: "Feira de ciências", tipo: "Evento" },
];
