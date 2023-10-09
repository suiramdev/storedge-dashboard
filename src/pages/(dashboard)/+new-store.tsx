import { useModals } from "@/router";
import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function NewStoreModal() {
  const modals = useModals();
  const open = useMemo(() => modals.current === "/new-store", [modals.current]);

  return (
    <Dialog open={open} onOpenChange={() => modals.close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new store</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default NewStoreModal;
