import { getCategoryBgColor } from '@/lib/categoryColors';

interface CategoryColorDotProps {
  categoryId: string;
  className?: string;
}

export function CategoryColorDot({ categoryId, className = '' }: CategoryColorDotProps) {
  const bgColor = getCategoryBgColor(categoryId);

  return (
    <span className={`w-3 h-3 rounded-full ${bgColor} inline-block ${className}`} />
  );
}
