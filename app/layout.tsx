import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Alternance Tracker",
  description: "Suivi de candidatures d'alternance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>
      </body>
    </html>
  );
}
