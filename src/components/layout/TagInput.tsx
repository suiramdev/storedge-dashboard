import { Badge } from "@/components/ui/badge";
import { XIcon, CheckIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Command, CommandList, CommandInput, CommandGroup, CommandItem } from "@/components/ui/command";

interface TagInputProps {
  availableTags: string[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  availableTags,
  selectedTags,
  onSelectedTagsChange,
  placeholder = "Select a tag",
  className,
}: TagInputProps) {
  const selectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onSelectedTagsChange([...selectedTags, tag]);
    } else {
      onSelectedTagsChange(selectedTags.filter((t) => t !== tag));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full", selectedTags.length > 0 && "!h-auto", className)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedTags.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selectedTags.map((tag) => (
              <Badge>
                {tag}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    selectTag(tag);
                  }}
                  className="ml-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search a scope..." />
            <CommandGroup>
              {availableTags.map((tag) => (
                <CommandItem key={tag} onSelect={() => selectTag(tag)}>
                  {tag}
                  {selectedTags.includes(tag) && <CheckIcon className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
