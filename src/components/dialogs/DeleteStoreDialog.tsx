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
import { useSession } from "@/providers/session";

const DELETE_STORE = gql`
  mutation DeleteStore($id: String!) {
    deleteManyProductVariant(where: { product: { is: { store: { is: { id: { equals: $id } } } } } }) {
      count
    }
    deleteManyProductImage(where: { product: { is: { store: { is: { id: { equals: $id } } } } } }) {
      count
    }
    deleteManyProduct(where: { store: { is: { id: { equals: $id } } } }) {
      count
    }
    deleteOneStore(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteStoreDialogProps extends AlertDialogProps {
  id: string;
  onCompleted?: () => void;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

function DeleteStoreDialog({ id, onCompleted, open, onOpenChange, children, ...props }: DeleteStoreDialogProps) {
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const selectStore = useSession((state) => state.selectStore);

  const [handleDelete] = useMutation(DELETE_STORE, {
    variables: { id },
    onCompleted: () => {
      selectStore(null);
      toast({ title: "Store deleted" });
      onOpenChange ? onOpenChange(false) : setShow(false);
      onCompleted && onCompleted();
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
    refetchQueries: ["Stores"],
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
            This action is irreversible. All the data related to the store and itself will be deleted.
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

export default DeleteStoreDialog;
