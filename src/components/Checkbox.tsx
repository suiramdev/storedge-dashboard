import { useEffect, useRef } from "react";

type Props = {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Checkbox({ checked, indeterminate, onChange }: Props) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checkboxRef.current) return;

    checkboxRef.current.checked = checked || false;
    checkboxRef.current.indeterminate = indeterminate || false;
  }, [checked, indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className="h-6 w-6 rounded border-gray-200 bg-white checked:bg-indigo-600 indeterminate:bg-indigo-600 hover:bg-gray-50 checked:hover:bg-indigo-700 hover:indeterminate:bg-indigo-700 focus:ring-indigo-700 focus:checked:bg-indigo-700"
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default Checkbox;
