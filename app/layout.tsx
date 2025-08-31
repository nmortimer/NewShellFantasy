
import "./../styles/globals.css";
import type { Metadata } from "next";
import { Inter, Roboto, Bebas_Neue, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-roboto", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-oswald", display: "swap" });

export const metadata: Metadata = {
  title: "Fantasy League Studio — Premium",
  description: "Generate premium fantasy league posters, recaps, and power rankings.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${bebas.variable} ${oswald.variable}`}>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
