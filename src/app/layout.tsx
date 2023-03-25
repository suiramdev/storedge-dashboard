import "@/styles/globals.css";
import { Sidebar, Topbar } from "@/app/components/Layout";

export const metadata = {
  title: "Storedge",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <div className="p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
