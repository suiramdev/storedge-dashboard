import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";

const placeholderStores = ["Store 1", "Store 2", "Store 3"];

function ShopSwitcher() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(placeholderStores[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Search"
          className="max-w-[200px]"
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={`https://avatar.vercel.sh/${selectedStore}.png`} />
            <AvatarFallback>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          {selectedStore}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search a store..." />
            <CommandEmpty>No stores found.</CommandEmpty>
            <CommandGroup>
              {placeholderStores.map((store) => (
                <CommandItem key={store} onSelect={() => setSelectedStore(store)}>
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={`https://avatar.vercel.sh/${store}.png`} />
                    <AvatarFallback>
                      <Skeleton />
                    </AvatarFallback>
                  </Avatar>
                  {store}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedStore === store ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => setOpen(false)}>
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ShopSwitcher;
