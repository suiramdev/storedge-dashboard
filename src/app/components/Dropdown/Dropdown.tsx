"use client";

import { useRef, useEffect, useState } from "react";
import DropdownItem from "./DropdownItem";

type Props = {
  button: React.ReactNode;
  children: React.ReactNode;
};

function Dropdown({ button, children }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };

    document.addEventListener("click", handleWindowClick);

    return () => {
      document.removeEventListener("click", handleWindowClick);
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button className="p-2 hover:bg-black/5" onClick={handleClick}>
        {button}
      </button>
      {isOpen && (
        <div
          className="absolute right-0 bottom-0 z-10 flex min-w-[200px] translate-y-full flex-col rounded border border-gray-200 bg-white py-1 shadow-lg"
          ref={menuRef}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Dropdown.Item = DropdownItem;

export default Dropdown;
