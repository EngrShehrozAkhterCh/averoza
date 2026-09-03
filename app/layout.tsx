import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Shell } from "@/components/shell";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://averoza.me"),
  title: { default: "Averoza | Shop smart. Live better.", template: "%s | Averoza" },
  description: "Thoughtful tech, home, and lifestyle essentials delivered across Pakistan.",
  openGraph: { title: "Averoza", description: "Thoughtful things for better everyday living.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en"><body className={`${bodyFont.variable} ${displayFont.variable}`}>
      <CartProvider><Shell>{children}</Shell></CartProvider>
    </body>
    </html>
  );
}
