import { gql } from "@apollo/client";
import { useSession } from "@/providers/session";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { ImagePlusIcon, Loader2Icon } from "lucide-react";
import { apolloClient } from "@/lib/apollo";
import { useState } from "react";

const STAGE_PRODUCT_IMAGE = gql`
  mutation StageProductImage($storeId: String!, $mimeType: String!) {
    stageOneFile(storeId: $storeId, mimeType: $mimeType) {
      uploadUrl
      bucket
      key
      contentType
    }
  }
`;

const CREATE_PRODUCT_IMAGE = gql`
  mutation CreateProductImage(
    $productId: String!
    $bucket: String!
    $key: String!
    $contentType: String!
    $orderIndex: Int!
  ) {
    createOneProductImage(
      data: {
        product: { connect: { id: $productId } }
        file: {
          connectOrCreate: {
            where: { src: { bucket: $bucket, key: $key } }
            create: { bucket: $bucket, key: $key, contentType: $contentType }
          }
        }
        orderIndex: $orderIndex
      }
    ) {
      id
    }
  }
`;

interface ProductImageDropZoneProps {
  id: string;
  orderIndex?: number;
}

// TODO: Loading state during uploading
function ProductImageDropZone({ id, orderIndex }: ProductImageDropZoneProps) {
  const selectedStoreId = useSession((state) => state.selectedStoreId);
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      if (!files[0]) return;

      const { data, errors } = await apolloClient.mutate({
        mutation: STAGE_PRODUCT_IMAGE,
        variables: {
          storeId: selectedStoreId,
          mimeType: files[0].type,
        },
      });
      if (errors) return;

      setLoading(true);
      const result = await fetch(data.stageOneFile.uploadUrl, {
        method: "PUT",
        body: files[0],
        mode: "cors",
        headers: {
          "Content-Type": data.stageOneFile.contentType,
        },
      });
      setLoading(false);
      if (!result.ok) return;

      await apolloClient.mutate({
        mutation: CREATE_PRODUCT_IMAGE,
        variables: {
          productId: id,
          bucket: data.stageOneFile.bucket,
          key: data.stageOneFile.key,
          contentType: data.stageOneFile.contentType,
          orderIndex: orderIndex || 0,
        },
        refetchQueries: ["ProductImages"],
      });
    },
  });

  return loading ? (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-md border py-6">
      <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
      <span className="text-primary">Uploading...</span>
    </div>
  ) : (
    <button
      className={clsx(
        "group flex w-full flex-col items-center justify-center space-y-2 rounded-md border py-6",
        isDragActive
          ? "border-solid border-primary bg-primary/25"
          : "border-dashed hover:border-solid hover:border-primary hover:bg-primary/25",
      )}
      type="button"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <ImagePlusIcon
        className={clsx("h-4 w-4 text-muted-foreground group-hover:text-primary", isDragActive && "text-primary")}
      />
      <span>
        Drag and drop or <span className="text-primary hover:cursor-pointer hover:underline">choose file</span>
      </span>
      <span className="text-xs text-muted-foreground">JPEG, JPG, PNG</span>
    </button>
  );
}

export default ProductImageDropZone;
