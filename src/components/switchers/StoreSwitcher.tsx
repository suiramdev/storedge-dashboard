import { gql, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { useSession } from "@/providers/session";
import { useShallow } from "zustand/react/shallow";
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
import { Store } from "@/types";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { CreateStoreDialog } from "@/components/dialogs/create-store";

const STORES = gql`
  query Stores {
    stores {
      id
      name
    }
  }
`;

export function StoreSwitcher() {
  const [open, setOpen] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const { data } = useQuery(STORES);

  const { selectedStoreId, selectStore } = useSession(
    useShallow((state) => ({ selectedStoreId: state.selectedStoreId, selectStore: state.selectStore })),
  );

  const selectedStore = useMemo(
    () => data?.stores.find((store: any) => store.id === selectedStoreId),
    [data, selectedStoreId],
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="max-w-[200px]">
            {selectedStore && (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage src={`https://avatar.vercel.sh/${selectedStore.name}.png`} />
                  <AvatarFallback>
                    <Skeleton />
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedStore.name}</span>
              </>
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search a store..." />
              <CommandEmpty>No stores found.</CommandEmpty>
              <CommandGroup>
                {data &&
                  data.stores.map((store: Store) => (
                    <CommandItem
                      key={store.id}
                      onSelect={() => {
                        selectStore(store.id);
                        setOpen(false);
                      }}
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage src={`https://avatar.vercel.sh/${store.name}.png`} />
                        <AvatarFallback>
                          <Skeleton />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{store.name}</span>
                      <CheckIcon
                        className={cn("ml-auto h-4 w-4", selectedStoreId === store.id ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpenCreateDialog(true);
                    setOpen(false);
                  }}
                >
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  Create a store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateStoreDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
    </>
  );
}
