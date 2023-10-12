import { gql, useMutation } from "@apollo/client";
import { useParams, useModals, useNavigate } from "@/router";
import { useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PRODUCTS } from "../_components/ProductsTable";
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

function DeleteProductModal() {
  let { id } = useParams("/products/:id");
  if (!id) id = history.state.usr.product.id;

  const modals = useModals();
  const open = useMemo(() => modals.current === "/products/[id]/delete", [modals.current]);

  const { toast } = useToast();

  const navigate = useNavigate();

  const [handleDelete] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    refetchQueries: [PRODUCTS],
    onCompleted: () => {
      toast({ title: "Product deleted" });
      navigate("/products");
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={() => modals.close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. All the data related to this product will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => modals.close()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteProductModal;
