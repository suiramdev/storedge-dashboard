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

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteManyProductVariant(where: { productId: { equals: $id } }) {
      count
    }
    deleteManyProductImage(where: { productId: { equals: $id } }) {
      count
    }
    deleteOneProduct(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteProductDialogProps {
  id: string;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onCompleted?: () => void;
  children?: React.ReactNode;
}

export function DeleteProductDialog({ id, open, onOpenChange, onCompleted, children }: DeleteProductDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    refetchQueries: ["Products"],
    onCompleted: () => {
      toast.success("Product deleted");
      onOpenChange ? onOpenChange(false) : setDefaultOpen(false);
      onCompleted && onCompleted();
    },
    onError: (error) => toast.error(error.message),
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
            This action is irreversible. All the data related to this product will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProduct()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
