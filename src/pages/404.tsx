import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileQuestionIcon } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Alert className="max-w-sm" variant="destructive">
        <FileQuestionIcon className="h-4 w-4" />
        <AlertTitle>404</AlertTitle>
        <AlertDescription>Page not found</AlertDescription>
      </Alert>
    </div>
  );
}

export default NotFoundPage;
