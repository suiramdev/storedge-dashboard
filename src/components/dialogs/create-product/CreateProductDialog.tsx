import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateProductForm } from "./CreateProductForm";
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

interface CreateProductDialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

export function CreateProductDialog({ open, onOpenChange, children }: CreateProductDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open ?? defaultOpen} onOpenChange={onOpenChange ?? setDefaultOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a product</DialogTitle>
          </DialogHeader>
          <CreateProductForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open ?? defaultOpen} onOpenChange={onOpenChange ?? setDefaultOpen}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a product</DrawerTitle>
        </DrawerHeader>
        <CreateProductForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
