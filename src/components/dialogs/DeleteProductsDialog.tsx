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

interface DeleteProductsDialogProps extends AlertDialogProps {
  ids: string[];
  onCompleted?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

function DeleteProductsDialog({ ids, onCompleted, open, onOpenChange, children, ...props }: DeleteProductsDialogProps) {
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const [handleDelete] = useMutation(DELETE_PRODUCTS, {
    variables: { ids },
    refetchQueries: ["Products"],
    onCompleted: () => {
      toast({ title: "Products deleted" });
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
            This action is irreversible. All the data related to theses products will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>Delete all</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProductsDialog;
