import type { Metadata } from "next";
import { Fraunces} from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "heyRMDY Admin",
  description: "Admin console for the heyRMDY platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
