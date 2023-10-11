import { gql, useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { apolloClient } from "@/lib/apollo";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteManyProductImage(where: { product: { is: { id: { equals: $id } } } }) {
      count
    }
    deleteOneProduct(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteProductModalProps extends AlertDialogProps {
  id: string;
}

function DeleteProductDialog({ id, open, onOpenChange, ...props }: DeleteProductModalProps) {
  const { toast } = useToast();

  const [handleDelete] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    onCompleted: () => {
      toast({ title: "Product deleted" });
      onOpenChange && onOpenChange(false);
      apolloClient.refetchQueries({ include: ["Products"] });
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
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
