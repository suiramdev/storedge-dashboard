import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useModals } from "@/router";
import { ArrowUpLeftIcon } from "lucide-react";
import { useMemo } from "react";

function SearchModal() {
  const modals = useModals();
  const open = useMemo(() => modals.current === "/search", [modals.current]);

  return (
    <CommandDialog open={open} onOpenChange={() => modals.close()}>
      <CommandInput autoFocus placeholder="Search..." />
      <CommandList>
        <CommandItem>
          <ArrowUpLeftIcon className="mr-2 h-4 w-4" />
          All products
        </CommandItem>
        <CommandItem>
          <ArrowUpLeftIcon className="mr-2 h-4 w-4" />
          All orders
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
}

export default SearchModal;
