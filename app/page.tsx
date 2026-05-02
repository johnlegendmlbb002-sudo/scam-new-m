// app/page.tsx
import HomeSection from "@/components/Home/Home";

export const metadata = {
  title: "Scammer Store – MLBB Diamond Top Up | Instant & Secure",
  description:
    "Scammer Store is a simple and safe Mobile Legends (MLBB) diamond top-up site with fast delivery.",
  keywords: [
    "MLBB top up",
    "buy MLBB diamonds",
    "Mobile Legends recharge",
    "Scammer Store top up",
  ],
};

export default function Page() {
  return (
    <main>
      <HomeSection />
    </main>
  );
}
