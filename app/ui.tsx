// app/ui.tsx
import { CSSProperties } from "react";

export const ui = {
  /* ===== 全站容器 ===== */
  page: {
    minHeight: "100vh",
    background: "#fafafa",
  } as CSSProperties,

  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "16px 16px 40px",
  } as CSSProperties,

  /* ===== 导航列 ===== */
  navBar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  } as CSSProperties,

  navBtn: {
    padding: "8px 14px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  } as CSSProperties,

  navBtnActive: {
    background: "#111",
    color: "#fff",
    borderColor: "#111",
  } as CSSProperties,

  /* ===== 卡片 ===== */
  card: {
    padding: "18px 18px",
    background: "#fff",
    borderRadius: 18,
    border: "1.5px solid #e5e5e5",
  } as CSSProperties,

  cardTitle: {
    margin: "0 0 8px",
    fontSize: 22,
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: 0,
    opacity: 0.75,
    lineHeight: 1.7,
  } as CSSProperties,

  /* ===== 辅助样式（补齐用） ===== */
  smallLink: {
    fontSize: 14,
    color: "#555",
    textDecoration: "underline",
    cursor: "pointer",
  } as CSSProperties,

  backLink: {
    marginTop: 16,
    fontSize: 14,
    color: "#333",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  } as CSSProperties,

  pill: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    whiteSpace: "nowrap",
  } as CSSProperties,
};