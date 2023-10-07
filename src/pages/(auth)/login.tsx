import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const { setAuthenticated } = useSession();

  const handleSignIn = () => setAuthenticated(true);

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex flex-col justify-between gap-16 bg-primary-foreground p-16">
        <h1 className="text-4xl font-bold">Welcome to Storedge</h1>
        <p className="mt-2 text-xl">
          Storedge is a headless e-commerce platform with a focus on developer experience and performance.
        </p>
      </div>
      <div className="bg-primary-background flex items-center justify-center p-8">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Sign in to your account to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@domain.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••••••••••" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSignIn}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
