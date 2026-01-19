import Link from "next/link";
import type { CSSProperties } from "react";

export const ui = {
  page: {
    padding: 24,
  } as CSSProperties,

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
  } as CSSProperties,

  subtitle: {
    margin: "8px 0 18px",
    opacity: 0.75,
    lineHeight: 1.6,
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    maxWidth: 900,
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
    </Link>
  );
}