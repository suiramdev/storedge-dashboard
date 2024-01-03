import { useAuth } from "@/providers/auth";
import { useModals } from "@/router";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreSwitcher, ThemeSwitcher } from "@/components/switchers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOutIcon, SettingsIcon } from "lucide-react";

export function Topbar() {
  const { signOut } = useAuth();
  const modals = useModals();

  return (
    <div className="grid grid-cols-3 items-center p-6">
      <StoreSwitcher />
      <Input type="text" placeholder="Search..." className="max-w-[600px]" onClick={() => modals.open("/search")} />
      <div className="flex items-center space-x-2 justify-self-end">
        <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={null} size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://avatar.vercel.sh/DS.png`} />
                <AvatarFallback>
                  <Skeleton />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px]" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
