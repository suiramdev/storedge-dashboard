import { gql, useMutation } from "@apollo/client";
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

const DELETE_PRODUCT_IMAGES = gql`
  mutation DeleteProducts($ids: [String!]) {
    deleteManyProductImage(where: { id: { in: $ids } }) {
      count
    }
  }
`;

interface DeleteProductImagesDialogProps {
  ids: string[];
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onCompleted?: () => void;
  children?: React.ReactNode;
}

export function DeleteProductImagesDialog({
  ids,
  open,
  onOpenChange,
  onCompleted,
  children,
}: DeleteProductImagesDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const { toast } = useToast();

  const [deleteProductImages] = useMutation(DELETE_PRODUCT_IMAGES, {
    variables: { ids },
    refetchQueries: ["ProductImages"],
    onCompleted: () => {
      toast({ title: "Images deleted" });
      onOpenChange ? onOpenChange(false) : setDefaultOpen(false);
      onCompleted && onCompleted();
    },
    onError: (error) => {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    },
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
          <AlertDialogDescription>This action is reversible. All images will be deleted.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProductImages()}>Delete all</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
