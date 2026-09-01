import { Navbar } from "@/components/client/navbar";
import { Footer } from "@/components/client/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-clip">
      <Navbar />
      <main className="flex-1">{children}</main>
      <div className="pb-[env(safe-area-inset-bottom)]">
      <Footer />
      </div>
    </div>
  );
}
