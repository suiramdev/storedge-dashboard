import "@/styles/globals.css";
import { SideBar, TopBar } from "@/app/components/Layout";

export const metadata = {
  title: "Storedge",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="flex">
        <SideBar />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <div className="px-16 py-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
