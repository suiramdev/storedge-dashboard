import { ChangeEvent, useEffect, useRef } from "react";

type Props = {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({ checked, indeterminate, onChange }: Props) {
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
      className="h-6 w-6 rounded-lg border-gray-200 bg-white checked:bg-indigo-500 indeterminate:bg-indigo-500 hover:bg-gray-50 checked:hover:bg-indigo-600 hover:indeterminate:bg-indigo-600 focus:ring-indigo-600 focus:checked:bg-indigo-600"
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
