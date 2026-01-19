// app/ui.tsx
import type { CSSProperties } from "react";

export const ui = {
  wrap: {
    padding: 24,
    maxWidth: 960,
    margin: "0 auto",
  } as CSSProperties,

  // 你 layout 可能會用到
  page: {
    minHeight: "100vh",
    background: "#fff",
  } as CSSProperties,

  navWrap: {
    padding: "18px 18px 14px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  } as CSSProperties,

  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  } as CSSProperties,

  navBtn: {
    display: "inline-block",
    padding: "10px 16px",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    background: "white",
    fontWeight: 700,
  } as CSSProperties,

  // 卡片/網格
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
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
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: "10px 0 0",
    opacity: 0.75,
    lineHeight: 1.6,
  } as CSSProperties,

  // ✅ 你缺的就是這個
  smallLink: {
    display: "inline-block",
    marginTop: 14,
    color: "#1d4ed8",
    textDecoration: "underline",
    fontWeight: 800,
  } as CSSProperties,

  backLink: {
    display: "inline-block",
    marginTop: 16,
    color: "#1d4ed8",
    textDecoration: "underline",
    fontWeight: 800,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
  } as CSSProperties,

  // 小膠囊（狀態用）
  pill: {
    padding: "10px 14px",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14,
    background: "#fff",
    fontWeight: 800,
  } as CSSProperties,
};