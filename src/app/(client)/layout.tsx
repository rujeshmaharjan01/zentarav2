import { Navbar } from "@/components/client/navbar";
import { Footer } from "@/components/client/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
