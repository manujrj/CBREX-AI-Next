import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ReduxProvider } from "../providers/ReduxProvider";
import Header from "./components/Header";
import { ReactNode } from "react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "CBREX AI",
  description: "AI-powered hiring tools",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="bg-white text-black dark:bg-[#1A1B24] dark:text-white font-sans transition-colors duration-300">
        <ReduxProvider>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
