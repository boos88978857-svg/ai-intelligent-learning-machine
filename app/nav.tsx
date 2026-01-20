"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "./ui";

const items = [
  { href: "/", label: "首頁" },
  { href: "/learn", label: "學習區" },
  { href: "/records", label: "記錄" },
  { href: "/settings", label: "設定" },
  { href: "/about", label: "關於" },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={ui.navBar}>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            style={{ ...ui.navBtn, ...(active ? ui.navBtnActive : null) }}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}