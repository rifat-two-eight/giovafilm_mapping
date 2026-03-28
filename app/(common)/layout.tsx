import Footer from "@/components/shared/navigation/footer";
import Header from "@/components/shared/navigation/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}

      <Footer />
    </div>
  );
}
