import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/providers/session";
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

interface DeleteStoreDialogProps {
  id: string;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onCompleted?: () => void;
  children?: React.ReactNode;
}

export function DeleteStoreDialog({ id, open, onOpenChange, onCompleted, children }: DeleteStoreDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const { toast } = useToast();
  const selectStore = useSession((state) => state.selectStore);

  const [deleteStore] = useMutation(DELETE_STORE, {
    variables: { id },
    onCompleted: () => {
      selectStore(null);
      toast({ title: "Store deleted" });
      onOpenChange ? onOpenChange(false) : setDefaultOpen(false);
      onCompleted && onCompleted();
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
    refetchQueries: ["Stores"],
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
          <AlertDialogAction onClick={() => deleteStore()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
