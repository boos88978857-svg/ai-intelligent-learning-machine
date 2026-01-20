// app/nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "./ui";

const items = [
  { href: "/", label: "首頁" },
  { href: "/practice", label: "學習區" },
  { href: "/record", label: "記錄" },
  { href: "/settings", label: "設定" },
  { href: "/about", label: "關於" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <div style={ui.navBar}>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            style={{
              ...ui.navBtn,
              ...(active ? ui.navBtnActive : {}),
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}