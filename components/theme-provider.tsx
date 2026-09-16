"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Real light/dark theming via next-themes.
 * Class strategy on <html>; the toggle lives in the site header.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
