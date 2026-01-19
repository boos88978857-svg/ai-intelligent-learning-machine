import "./globals.css";
import Nav from "./nav";

export const metadata = {
  title: "AI 智能學習機",
  description: "AI 智能學習機 - 框架入口",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}