import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateUserForm } from "./CreateUserForm";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/utils";

interface CreateUserDialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

export function CreateUserDialog({ open, onOpenChange, children }: CreateUserDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = () => {
    onOpenChange ? onOpenChange(false) : setDefaultOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open ?? defaultOpen} onOpenChange={onOpenChange ?? setDefaultOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a user</DialogTitle>
          </DialogHeader>
          <CreateUserForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open ?? defaultOpen} onOpenChange={onOpenChange ?? setDefaultOpen}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a user</DrawerTitle>
        </DrawerHeader>
        <CreateUserForm className="px-4" onSubmit={handleSubmit} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
