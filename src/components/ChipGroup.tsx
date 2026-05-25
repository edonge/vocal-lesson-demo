type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  singleSelect?: boolean;
};

export default function ChipGroup({ options, selected, onToggle, singleSelect }: Props) {
  return (
    <div className="chips">
      {options.map((opt) => {
        const isSel = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            className={`chip ${isSel ? 'selected' : ''}`}
            onClick={() => {
              if (singleSelect && isSel) return;
              onToggle(opt);
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
