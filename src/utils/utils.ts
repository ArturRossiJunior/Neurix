import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone;
};

export const maskPhone = (value: string): string => {
  let v = value.replace(/\D/g, '');
  v = v.substring(0, 11);
  const length = v.length;

  if (length <= 2) {
    return `(${v}`;
  }
  if (length <= 6) {
    return `(${v.substring(0, 2)}) ${v.substring(2)}`;
  }
  if (length <= 10) {
    return `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6)}`;
  }
  return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
};

export const calculateDetailedAge = (dateString: string): string => {
  if (!dateString) {
    return 'N/A';
  }

  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) {
    return 'Data inválida';
  }

  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();
    days += lastMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0 && days === 0) {
    return '0 dias';
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
  }
  if (days > 0) {
    parts.push(`${days} dia${days > 1 ? 's' : ''}`);
  }

  return parts.join(' e ');
};

export const formatCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return 'N/A';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const capitalizeName = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const isValidDate = (dateStr: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return false;
  const today = new Date();
  if (date > today) return false;
  if (year < 1900) return false;
  return true;
};

export const validateEmail = (email: string) =>
  /^[^@]+@[^@]+\.[^@]+$/.test(email);

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres';
  }
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula';
  }
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula';
  }
  if (!/\d/.test(password)) {
    return 'A senha deve conter pelo menos um número';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial';
  }
  return null;
};

export const isValidPhone = (phone: string): boolean => {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

export const validateCRM = (crm: string) => {
  const crmRegex = /^\d{4,8}\/[A-Z]{2}$/i;
  return crmRegex.test(crm.trim());
};

export const formatCRMForDB = (crm: string): string => {
  return crm.trim().toUpperCase();
};

export const maskCRM = (value: string): string => {
  let v = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const digits = (v.match(/\d+/) || [''])[0].substring(0, 8);
  const letters = (v.match(/[A-Z]+/) || [''])[0].substring(0, 2);

  if (letters) {
    return `${digits}/${letters}`;
  }
  return digits;
};

export const isValidCPF = (cpf: string): boolean => {
  if (typeof cpf !== 'string') return false;

  cpf = cpf.replace(/[^0-9]/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export const validateFullName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Nome é obrigatório';
  }
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
    return 'Digite o nome completo (nome e sobrenome)';
  }
  return null;
};