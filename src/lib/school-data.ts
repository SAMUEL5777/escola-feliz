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

export type Aula = {
  id: string;
  turma: string;
  disciplina: string;
  professor: string;
  horario: string;
  diaSemana: "Seg" | "Ter" | "Qua" | "Qui" | "Sex";
};

export const aulas: Aula[] = [
  { id: "A1", turma: "9º A", disciplina: "Matemática", professor: "Helena Vasconcelos", horario: "07:30", diaSemana: "Seg" },
  { id: "A2", turma: "9º A", disciplina: "Ciências", professor: "Juliana Prado", horario: "08:20", diaSemana: "Seg" },
  { id: "A3", turma: "9º B", disciplina: "Matemática", professor: "Helena Vasconcelos", horario: "13:30", diaSemana: "Ter" },
  { id: "A4", turma: "9º B", disciplina: "História", professor: "Marcelo Aguiar", horario: "14:20", diaSemana: "Ter" },
  { id: "A5", turma: "8º B", disciplina: "Português", professor: "Ricardo Tavares", horario: "07:30", diaSemana: "Qua" },
  { id: "A6", turma: "8º B", disciplina: "Geografia", professor: "Patrícia Gomes", horario: "08:20", diaSemana: "Qua" },
  { id: "A7", turma: "7º A", disciplina: "Português", professor: "Ricardo Tavares", horario: "09:30", diaSemana: "Qui" },
  { id: "A8", turma: "7º A", disciplina: "História", professor: "Marcelo Aguiar", horario: "10:20", diaSemana: "Sex" },
];

export type Mensalidade = {
  id: string;
  alunoId: string;
  referencia: string;
  vencimento: string;
  valor: number;
  status: "Paga" | "Pendente" | "Atrasada";
};

const referencias = ["Mai/2026", "Jun/2026", "Jul/2026", "Ago/2026"];

export const mensalidades: Mensalidade[] = alunos.flatMap((a, ai) =>
  referencias.map((ref, i) => {
    const atrasoLikely = (ai + i) % 7 === 0;
    const status: Mensalidade["status"] =
      i < 2 ? "Paga" : atrasoLikely ? "Atrasada" : i === 3 ? "Pendente" : "Paga";
    return {
      id: `${a.id}-${ref}`,
      alunoId: a.id,
      referencia: ref,
      vencimento: `10/${String(5 + i).padStart(2, "0")}/2026`,
      valor: 890,
      status,
    };
  }),
);

export type Mensagem = {
  id: string;
  alunoId: string;
  autor: string;
  perfil: string;
  texto: string;
  quando: string;
};

export const mensagens: Mensagem[] = [
  { id: "M1", alunoId: "2024002", autor: "Helena Vasconcelos", perfil: "Professor(a)", texto: "Bruno precisa reforçar equações do 2º grau antes da prova de 15/Ago.", quando: "ontem" },
  { id: "M2", alunoId: "2024004", autor: "Maria Silva", perfil: "Secretaria acadêmica", texto: "Frequência de Diego está abaixo do mínimo legal. Podemos conversar esta semana?", quando: "há 2 dias" },
  { id: "M3", alunoId: "2024001", autor: "Marcos Ferreira", perfil: "Responsável", texto: "Obrigado pelo retorno sobre a feira de ciências!", quando: "há 3 dias" },
];

export type RegistroHistorico = {
  alunoId: string;
  ano: number;
  serie: string;
  mediaFinal: number;
  frequencia: number;
  resultado: "Aprovado" | "Aprovado com recuperação";
};

export const historico: RegistroHistorico[] = alunos.flatMap((a) => [
  { alunoId: a.id, ano: 2024, serie: "6º ano", mediaFinal: Number(Math.min(10, a.media + 0.5).toFixed(1)), frequencia: Math.min(100, a.frequencia + 3), resultado: "Aprovado" },
  { alunoId: a.id, ano: 2025, serie: "7º ano", mediaFinal: Number(Math.max(0, a.media - 0.3).toFixed(1)), frequencia: Math.max(0, a.frequencia - 2), resultado: a.media < 7 ? "Aprovado com recuperação" : "Aprovado" },
]);
