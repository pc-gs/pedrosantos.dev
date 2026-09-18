import type { Metadata } from "next";
import { DesignMode } from "@/components/providers/design-mode";

export const metadata: Metadata = {
  title: "Design explorations",
  robots: { index: false, follow: false },
};

export default function DesignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DesignMode />
      {children}
    </>
  );
}
