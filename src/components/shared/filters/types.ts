
export interface FilterOption {
  value: string;
  label: string;
}

export interface StatusOption extends FilterOption {
  originalValue: string; // Valor original em inglês para manter compatibilidade
}

// Status no idioma português para uso nos componentes
export const statusOptions: StatusOption[] = [
  { value: 'pending', label: 'Pendente', originalValue: 'pending' },
  { value: 'in-progress', label: 'Em Andamento', originalValue: 'in-progress' },
  { value: 'resolved', label: 'Resolvido', originalValue: 'resolved' },
  { value: 'closed', label: 'Encerrado', originalValue: 'closed' }
];
