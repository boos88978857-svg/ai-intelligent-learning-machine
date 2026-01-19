// app/ui.tsx
import Link from "next/link";
import type { CSSProperties } from "react";

export const ui = {
  page: {
    background: "#fff",
    minHeight: "100vh",
  } as CSSProperties,

  navWrap: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  } as CSSProperties,

  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  } as CSSProperties,

  navBtn: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    textDecoration: "none",
    color: "#1d4ed8",
    fontWeight: 700,
    background: "#fff",
  } as CSSProperties,

  main: {
    padding: 24,
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  } as CSSProperties,

  card: {
    display: "block",
    padding: 18,
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    background: "white",
  } as CSSProperties,

  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  } as CSSProperties,

  cardDesc: {
    margin: "10px 0 0",
    opacity: 0.75,
    lineHeight: 1.6,
  } as CSSProperties,

  smallLink: {
    display: "inline-block",
    marginTop: 14,
    color: "#1d4ed8",
    textDecoration: "underline",
  } as CSSProperties,
};

export function CardLink(props: { href: string; title: string; desc: string }) {
  return (
    <Link href={props.href} style={ui.card}>
      <h2 style={ui.cardTitle}>{props.title}</h2>
      <p style={ui.cardDesc}>{props.desc}</p>
      <span style={ui.smallLink}>進入 →</span>
    </Link>
  );
}