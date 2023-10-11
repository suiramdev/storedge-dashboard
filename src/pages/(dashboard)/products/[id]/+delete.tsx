import { useParams, useModals } from "@/router";
import { useMemo } from "react";
import DeleteProductDialog from "@/components/dialogs/DeleteProductDialog";

function DeleteModal() {
  const { id } = useParams("/products/:id");

  const modals = useModals();
  const open = useMemo(() => modals.current === "/products/[id]/delete", [modals.current]);

  return <DeleteProductDialog id={id} open={open} onOpenChange={() => modals.close({ at: "/products" })} />;
}

export default DeleteModal;
