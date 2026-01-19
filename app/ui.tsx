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
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    border: "1.5px solid #e5e5e5",
    marginBottom: 20,
  } as CSSProperties,

  cardTitle: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 6,
  } as CSSProperties,

  cardDesc: {
    fontSize: 14,
    lineHeight: 1.6,
    opacity: 0.75,
  } as CSSProperties,

  /* ===== 小标签 / 统计 ===== */
  pillRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12,
  } as CSSProperties,

  pill: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontSize: 13,
    fontWeight: 800,
  } as CSSProperties,

  /* ===== 链接 / 返回 ===== */
  smallLink: {
    fontSize: 14,
    fontWeight: 800,
    color: "#1d4ed8",
    textDecoration: "underline",
    cursor: "pointer",
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

  /* ===== 作答区 ===== */
  optionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 12,
  } as CSSProperties,

  option: {
    padding: "14px 12px",
    borderRadius: 16,
    border: "2px solid #ddd",
    fontWeight: 900,
    background: "#fff",
    cursor: "pointer",
    textAlign: "center",
  } as CSSProperties,

  optionSelected: {
    borderColor: "#2563eb",
    background: "#eff6ff",
  } as CSSProperties,

  optionCorrect: {
    borderColor: "#16a34a",
    background: "#ecfdf5",
  } as CSSProperties,

  optionWrong: {
    borderColor: "#dc2626",
    background: "#fef2f2",
  } as CSSProperties,

  /* ===== 操作列 ===== */
  actionRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  } as CSSProperties,

  primaryBtn: {
    padding: "10px 16px",
    borderRadius: 14,
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  } as CSSProperties,

  ghostBtn: {
    padding: "10px 16px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as CSSProperties,

  disabledBtn: {
    opacity: 0.4,
    pointerEvents: "none",
  } as CSSProperties,

  /* ===== 提示 / 讯息 ===== */
  messageCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    fontWeight: 700,
    lineHeight: 1.6,
  } as CSSProperties,

  pauseCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: "#fff7ed",
    border: "2px solid #fb923c",
    fontWeight: 900,
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
};