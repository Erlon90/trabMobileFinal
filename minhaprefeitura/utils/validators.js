/**
 * Validadores puros para CPF e formulários dos novos módulos.
 */

const VALID_SEVERITIES = ['Baixa', 'Média', 'Alta'];

/**
 * Remove caracteres não numéricos de um texto.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/**
 * Formata incrementalmente até 11 dígitos no padrão `000.000.000-00`.
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function formatCpf(raw) {
  const digits = onlyDigits(raw).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Valida CPF usando os dois dígitos verificadores oficiais (módulo 11).
 * @param {string | null | undefined} cpf
 * @returns {boolean}
 */
export function validateCpf(cpf) {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(digits[10]);
}

/**
 * Valida o formulário de denúncia de buraco recorrente.
 * @param {{ titulo?: string, endereco?: string, bairro?: string, descricao?: string, gravidade?: string }} input
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validatePotholeReport(input = {}) {
  const errors = {};
  const titulo = String(input.titulo || '').trim();
  const endereco = String(input.endereco || '').trim();
  const bairro = String(input.bairro || '').trim();
  const descricao = String(input.descricao || '').trim();
  const gravidade = String(input.gravidade || '').trim();

  if (titulo.length < 3) {
    errors.titulo = 'Informe um título resumido com pelo menos 3 caracteres.';
  }
  if (endereco.length < 5) {
    errors.endereco = 'Informe a rua/avenida e número aproximado.';
  }
  if (bairro.length < 2) {
    errors.bairro = 'Informe o bairro onde está o buraco.';
  }
  if (descricao.length < 10) {
    errors.descricao = 'Descreva o problema com pelo menos 10 caracteres.';
  }
  if (!VALID_SEVERITIES.includes(gravidade)) {
    errors.gravidade = 'Selecione uma gravidade válida (Baixa, Média ou Alta).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida os dados de entrada de um agendamento municipal.
 * @param {{ categoria?: string, servicoId?: string, unidadeId?: string, data?: string, horario?: string, cidadaoNome?: string, cidadaoCpf?: string }} input
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateAppointmentInput(input = {}) {
  const errors = {};
  if (!input.categoria) {
    errors.categoria = 'Selecione a área do atendimento.';
  }
  if (!input.servicoId) {
    errors.servicoId = 'Selecione o serviço desejado.';
  }
  if (!input.unidadeId) {
    errors.unidadeId = 'Selecione a unidade de atendimento.';
  }
  if (!input.data) {
    errors.data = 'Selecione uma data disponível.';
  }
  if (!input.horario) {
    errors.horario = 'Selecione um horário disponível.';
  }
  if (String(input.cidadaoNome || '').trim().length < 3) {
    errors.cidadaoNome = 'Informe o nome completo (mínimo 3 caracteres).';
  }
  if (!validateCpf(input.cidadaoCpf)) {
    errors.cidadaoCpf = 'Informe um CPF válido com 11 dígitos.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida opinião enviada pelo cidadão em uma enquete.
 * @param {{ texto?: string }} input
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validatePollComment(input = {}) {
  const errors = {};
  const texto = String(input.texto || '').trim();
  if (texto.length < 3) {
    errors.texto = 'Escreva sua opinião com pelo menos 3 caracteres.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
