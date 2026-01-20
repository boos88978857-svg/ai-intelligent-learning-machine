// app/nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "./ui";

const items = [
  { href: "/", label: "首頁" },
  { href: "/learn", label: "