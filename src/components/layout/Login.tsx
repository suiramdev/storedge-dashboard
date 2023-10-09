import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SessionStatus, useSession } from "@/components/providers/SessionProvider";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { status, signIn } = useSession();

  return (
    <div className="grid min-h-screen grid-cols-2">
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
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id="email" type="email" placeholder="example@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id="password" type="password" placeholder="••••••••••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

export default Login;
