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
    marginBottom: 18,
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
    background: "#fff",
    border: "1.5px solid #e5e5e5",
    borderRadius: 18,
    padding: 16,
  } as CSSProperties,

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 22,
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: 0,
    color: "#333",
    lineHeight: 1.6,
  } as CSSProperties,

  /* ===== 栅格 ===== */
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  } as CSSProperties,

  /* ===== 链接/按钮辅助 ===== */
  smallLink: {
    fontSize: 14,
    color: "#555",
    textDecoration: "underline",
  } as CSSProperties,

  backLink: {
    marginTop: 14,
    display: "inline-block",
    color: "#1d4ed8",
    textDecoration: "underline",
    fontWeight: 700,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
  } as CSSProperties,

  /* ===== 小胶囊（状态栏用） ===== */
  pill: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    whiteSpace: "nowrap",
  } as CSSProperties,
};