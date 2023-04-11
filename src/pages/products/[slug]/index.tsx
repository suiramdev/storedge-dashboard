import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Link } from "@/router";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiArrowNarrowLeft, HiSave, HiTrash } from "react-icons/hi";

const GET_PRODUCT = gql`
  query Product($id: String!) {
    product(id: $id) {
      id
      name
      description
      status
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: String!
    $name: String
    $description: String
    $status: ProductStatus
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      status: $status
    ) {
      id
      name
      description
      status
    }
  }
`;

function ProductPage() {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      id: slug,
    },
  });

  const [mutateFunction] = useMutation(UPDATE_PRODUCT);

  const {
    formState: { isDirty },
    register,
    handleSubmit,
    reset,
  } = useForm();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    mutateFunction({
      variables: {
        id: data.product.id,
        ...formData,
      },
    });
    reset(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 flex justify-between">
        <Link
          className="flex items-center gap-2 text-sm text-gray-500 hover:underline hover:underline-offset-4"
          to="/products"
        >
          <HiArrowNarrowLeft size={24} />
          Back to products
        </Link>
        <button className="btn btn-primary" type="submit" disabled={!isDirty}>
          <HiSave size={16} />
          Save changes
        </button>
      </div>
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-sm border border-gray-200 bg-white p-6">
            <label className="input">
              Name
              <input
                type="text"
                defaultValue={data.product.name}
                {...register("name")}
              />
            </label>
            <label className="input">
              Description
              <textarea
                defaultValue={data.product.description}
                {...register("description")}
              />
            </label>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-sm border border-gray-200 bg-white p-6">
            <label className="input">
              Status
              <select
                {...register("status")}
                defaultValue={data.product.status}
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </label>
            <button className="btn btn-danger" type="button">
              <HiTrash size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProductPage;
