import { gql, useQuery, useMutation } from "@apollo/client";
import { z } from "zod";
import { storeModel, CurrencyCode } from "@/types";
import { useSession } from "@/providers/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import StoreDetailsCard from "./_components/StoreDetailsCard";
import { TrashIcon } from "lucide-react";

const GENERAL_SETTINGS = gql`
  query GeneralSettings($storeId: String!) {
    store(where: { id: $storeId }) {
      name
      description
      currencyCode
    }
  }
`;

const UPDATE_STORE = gql`
  mutation UpdateStore($where: StoreWhereUniqueInput!, $data: StoreUpdateInput!) {
    updateOneStore(where: $where, data: $data) {
      id
      name
      description
      currencyCode
    }
  }
`;

const formSchema = z.object({
  store: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Name must be at least 3 characters")
      .max(255, "Name must not exceed 255 characters"),
    description: z.string().optional(),
    currencyCode: z.nativeEnum(CurrencyCode),
  }),
});

function SettingsPage() {
  const selectedStoreId = useSession((state) => state.selectedStoreId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store: {
        name: "",
        description: "",
        currencyCode: CurrencyCode.EUR,
      },
    },
  });

  useQuery(GENERAL_SETTINGS, {
    variables: {
      storeId: selectedStoreId,
    },
    onCompleted: (data) => {
      form.reset(data);
    },
  });

  const { toast } = useToast();

  const [updateStore] = useMutation(UPDATE_STORE, {
    onCompleted: (data) => {
      toast({ title: "General settings saved" });
    },
    onError: (error) => {
      toast({ title: "Couldn't save settings", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = form.handleSubmit(
    (data) => {
      updateStore({
        variables: {
          where: { id: selectedStoreId },
          data: {
            name: { set: data.store.name },
            description: { set: data.store.description },
            currencyCode: { set: data.store.currencyCode },
          },
        },
      });

      form.reset(data);
    },
    (errors) => console.log(errors),
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <h2>General</h2>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save changes
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <StoreDetailsCard />
          <Button type="button" variant="destructive" size="lg">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete store
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SettingsPage;
