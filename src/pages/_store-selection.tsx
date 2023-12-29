import { gql, useQuery } from "@apollo/client";
import { useSession } from "@/providers/session";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateStoreDialog } from "@/components/dialogs/create-store";
import { LogOutIcon, PlusCircleIcon } from "lucide-react";

const STORES = gql`
  query Stores {
    stores {
      id
      name
    }
  }
`;

function StoreSelectionPage() {
  const { selectStore, signOut } = useSession(
    useShallow((state) => ({ selectStore: state.selectStore, signOut: state.signOut })),
  );
  const { data } = useQuery(STORES);

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-between gap-16 bg-primary-foreground p-16">
        <h1 className="text-4xl font-bold">Welcome to Storedge</h1>
        <p className="mt-2 text-xl">
          Storedge is a headless e-commerce platform with a focus on developer experience and performance.
        </p>
      </div>
      <div className="bg-primary-background flex flex-col items-center justify-center space-y-6 p-8">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Select a store</CardTitle>
            <CardDescription>Select a store to continue.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {data &&
              data.stores.map((store: Store) => (
                <Button
                  variant="outline"
                  className="justify-start"
                  key={store.id}
                  onClick={() => selectStore(store.id)}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={`https://avatar.vercel.sh/${store.name}.png`} />
                    <AvatarFallback>
                      <Skeleton />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{store.name}</span>
                </Button>
              ))}
            <CreateStoreDialog>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Create a store
              </Button>
            </CreateStoreDialog>
          </CardContent>
        </Card>
        <Button variant="outline" className="w-[400px]" onClick={signOut}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export default StoreSelectionPage;
