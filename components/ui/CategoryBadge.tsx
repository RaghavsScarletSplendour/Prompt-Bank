import { getCategoryColor } from '@/lib/categoryColors';

interface CategoryBadgeProps {
  categoryId: string;
  name: string;
  className?: string;
}

export function CategoryBadge({ categoryId, name, className = '' }: CategoryBadgeProps) {
  const { bg, text } = getCategoryColor(categoryId);

  return (
    <span className={`${bg} ${text} text-xs px-2 py-1 rounded ${className}`}>
      {name}
    </span>
  );
}
