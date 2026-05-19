export default function FilterDropdown({ value, onChange, options, label }) {
  return (
    <select aria-label={label} className="input min-w-36" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
