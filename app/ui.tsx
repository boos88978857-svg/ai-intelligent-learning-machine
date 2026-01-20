// app/ui.tsx
import type { CSSProperties } from "react";

export const ui = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
  } as CSSProperties,

  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "16px 16px 40px",
  } as CSSProperties,

  navBar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 18,
  } as CSSProperties,

  navBtn: {
    padding: "10px 16px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as CSSProperties,

  navBtnActive: {
    background: "#111",
    color: "#fff",
    borderColor: "#111",
  } as CSSProperties,

  card: {
    background: "#fff",
    border: "1.5px solid #e5e5e5",
    borderRadius: 18,
    padding: 16,
  } as CSSProperties,

  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: "8px 0 0",
    lineHeight: 1.6,
    color: "#333",
    fontWeight: 600,
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  } as CSSProperties,

  pill: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 900,
    whiteSpace: "nowrap",
  } as CSSProperties,

  smallLink: {
    fontSize: 14,
    color: "#555",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 700,
  } as CSSProperties,

  backLink: {
    fontSize: 16,
    color: "#1b4fff",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 800,
  } as CSSProperties,
};