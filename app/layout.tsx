// app/layout.tsx
import type { ReactNode } from "react";
import Nav from "./nav";
import { ui } from "./ui";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body style={ui.page}>
        <div style={ui.wrap}>
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}