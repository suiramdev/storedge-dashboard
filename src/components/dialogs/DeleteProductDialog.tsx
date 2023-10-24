import { gql, useMutation } from "@apollo/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
    deleteManyProductOptionValue(where: { option: { is: { product: { is: { id: { equals: $id } } } } } }) {
      count
    }
    deleteManyProductOption(where: { product: { is: { id: { equals: $id } } } }) {
      count
    }
    deleteManyProductImage(where: { product: { is: { id: { equals: $id } } } }) {
      count
    }
    deleteOneProduct(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteProductDialogProps extends AlertDialogProps {
  id: string;
  onCompleted?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

function DeleteProductDialog({ id, onCompleted, open, onOpenChange, children, ...props }: DeleteProductDialogProps) {
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const [handleDelete] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    refetchQueries: ["Products"],
    onCompleted: () => {
      toast({ title: "Product deleted" });
      onOpenChange ? onOpenChange(false) : setShow(false);
      onCompleted && onCompleted();
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
  });

  return (
    <AlertDialog
      {...props}
      open={open ?? show}
      onOpenChange={(value) => {
        onOpenChange ? onOpenChange(value) : setShow(value);
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
          <AlertDialogAction onClick={() => handleDelete()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProductDialog;
