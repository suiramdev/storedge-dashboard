import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useSession } from "../providers/SessionProvider";
import { useModals } from "@/router";
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

const STORES = gql`
  query Stores {
    stores {
      id
      name
    }
  }
`;

function StoreSwitcher() {
  const [open, setOpen] = useState<boolean>(false);
  const { selectedStore, selectStore } = useSession();
  const { data } = useQuery(STORES);
  const modals = useModals();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} aria-label="Search" className="max-w-[200px]">
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={`https://avatar.vercel.sh/${selectedStore}.png`} />
            <AvatarFallback>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
          {selectedStore}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search a store..." />
            <CommandEmpty>No stores found.</CommandEmpty>
            <CommandGroup>
              {data && data.stores.map((store: any) => (
                <CommandItem key={store.id} onSelect={() => selectStore(store.id)}>
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={`https://avatar.vercel.sh/${store.name}.png`} />
                    <AvatarFallback>
                      <Skeleton />
                    </AvatarFallback>
                  </Avatar>
                  {store.name}
                  <CheckIcon className={cn("ml-auto h-4 w-4", selectedStore === store.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => {
                modals.open("/new-store");
                setOpen(false)
              }}>
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

export default StoreSwitcher;
