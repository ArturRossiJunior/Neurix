import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
};

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
    const lastMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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

export const validateEmail = (email: string) => /^[^@]+@[^@]+\.[^@]+$/.test(email);

export const validateCRP = (crp: string) => {
  const normalized = crp.toUpperCase().replace('CRP', '').trim();
  const crpRegex = /^(?:\d{1,2}[\/\-\s]\d{4,}|\d{4,}[\/\-\s]\d{1,2})$/;
  return crpRegex.test(normalized);
};

export const formatCRPForDB = (crp: string): string => {
  const normalized = crp
    .toUpperCase()
    .replace('CRP', '')
    .replace(/[\s\-\/]/, '/') 
    .replace(/[^0-9\/]/g, '');

  let match = normalized.match(/^(\d{4,})\/(\d{1,2})$/);
  if (match) {
    return `${match[2]}/${match[1]}`;
  }

  match = normalized.match(/^(\d{1,2})\/(\d{4,})$/);
  if (match) {
    return normalized;
  }
  return crp.toUpperCase(); 
};