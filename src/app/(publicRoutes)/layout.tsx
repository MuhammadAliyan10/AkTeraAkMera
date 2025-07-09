import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { NavbarDemo } from "@/components/navbar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NavbarDemo>{children}</NavbarDemo>
    </ThemeProvider>
  );
}
