import { Poppins, Merienda } from "next/font/google";
import "./globals.css";
import "@/styles/main.scss";
import Header from "@/components/layouts/header";
import { siteUrl, siteDescription } from "@/lib/seo.mjs";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "700", "500", "600", "800"],
});
const merienda = Merienda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merienda",
  weight: ["400", "700", "500", "600", "800"],
});
export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Food. | Pizza Recipes & Food Inspiration", template: "%s | Food." },
  description: siteDescription,
  applicationName: "Food.",
  robots: { index: Boolean(siteUrl), follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
