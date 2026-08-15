import { Inter, Lora, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AppToast from "@/components/ui/AppToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AuthBootstrap from "@/features/auth/components/AuthBootstrap";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${lora.variable} ${outfit.variable} antialiased font-outfit`}>
        <QueryProvider>
          <AuthBootstrap />
          {children}
          <AppToast />
          <ConfirmDialog />
        </QueryProvider>
      </body>
    </html>
  );
}