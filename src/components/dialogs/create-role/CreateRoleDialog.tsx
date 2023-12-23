import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateRoleForm } from "./CreateRoleForm";
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

interface CreateRoleDialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

export function CreateRoleDialog({ open, onOpenChange, children }: CreateRoleDialogProps) {
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
            <DialogTitle>Create a role</DialogTitle>
          </DialogHeader>
          <CreateRoleForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open ?? defaultOpen} onOpenChange={onOpenChange ?? setDefaultOpen}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a role</DrawerTitle>
        </DrawerHeader>
        <CreateRoleForm className="px-4" onSubmit={handleSubmit} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
