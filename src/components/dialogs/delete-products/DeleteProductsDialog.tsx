import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const DELETE_PRODUCTS = gql`
  mutation DeleteProducts($ids: [String!]) {
    deleteManyProductVariant(where: { productId: { in: $ids } }) {
      count
    }
    deleteManyProductImage(where: { productId: { in: $ids } }) {
      count
    }
    deleteManyProduct(where: { id: { in: $ids } }) {
      count
    }
  }
`;

interface DeleteProductsDialogProps {
  ids: string[];
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onCompleted?: () => void;
  children?: React.ReactNode;
}

export function DeleteProductsDialog({ ids, open, onOpenChange, onCompleted, children }: DeleteProductsDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const [deleteProducts] = useMutation(DELETE_PRODUCTS, {
    variables: { ids },
    onCompleted: () => {
      toast.success("Products deleted");
      onOpenChange ? onOpenChange(false) : setDefaultOpen(false);
      onCompleted && onCompleted();
    },
    onError: (error) => toast.error(error.message),
    refetchQueries: ["Products"],
  });

  return (
    <AlertDialog
      open={open ?? defaultOpen}
      onOpenChange={(value) => {
        onOpenChange ? onOpenChange(value) : setDefaultOpen(value);
        setTimeout(() => (document.body.style.pointerEvents = ""), 200); // Weird fix for #468 shadcn-ui's issue
      }}
    >
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. All the data related to the products will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProducts()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
