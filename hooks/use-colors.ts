import theme from '../theme.config';

export function useColors() {
  return theme.colors;
}

export function useCategoryColor(category: string): string {
  const colors: Record<string, string> = theme.categoryColors;
  return colors[category] || theme.colors.textSecondary;
}