import './TagChip.css';

interface TagChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TagChip({ label, selected, onClick }: TagChipProps) {
  return (
    <button
      type="button"
      className={`tag-chip ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="checkbox"
      aria-checked={selected}
    >
      {label}
    </button>
  );
}
