import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { SessionStatus, useSession } from "@/providers/session";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { status, signIn } = useSession(useShallow((state) => ({ status: state.status, signIn: state.signIn })));

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-between gap-16 bg-primary-foreground p-16">
        <h1 className="text-4xl font-bold">Welcome to Storedge</h1>
        <p className="mt-2 text-xl">
          Storedge is a headless e-commerce platform with a focus on developer experience and performance.
        </p>
      </div>
      <div className="bg-primary-background flex items-center justify-center p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => signIn(data.email, data.password))}>
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Sign in to your account to continue.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={status == SessionStatus.LOADING}>
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
