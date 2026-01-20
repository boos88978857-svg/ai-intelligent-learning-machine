// app/ui.ts
import type { CSSProperties } from "react";

export const ui = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
  } as CSSProperties,

  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "16px 16px 44px",
  } as CSSProperties,

  navBar: {
    display: "flex",
    gap: 10,
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
    borderColor: "#2f5cff",
    color: "#2f5cff",
  } as CSSProperties,

  card: {
    background: "#fff",
    border: "1.5px solid #e5e5e5",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  } as CSSProperties,

  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: "10px 0 0",
    lineHeight: 1.6,
    color: "#333",
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  } as CSSProperties,

  pillRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  } as CSSProperties,

  pill: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    whiteSpace: "nowrap",
  } as CSSProperties,

  btnRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  } as CSSProperties,

  btn: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  } as CSSProperties,

  btnPrimary: {
    borderColor: "#18a34a",
  } as CSSProperties,

  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  } as CSSProperties,

  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  } as CSSProperties,

  choiceCard: {
    borderRadius: 16,
    border: "1.5px solid #ddd",
    background: "#fff",
    padding: 14,
    fontWeight: 900,
    fontSize: 20,
    cursor: "pointer",
    userSelect: "none",
  } as CSSProperties,

  choiceSelected: {
    borderColor: "#2f5cff",
    background: "#eef3ff",
  } as CSSProperties,

  choiceCorrect: {
    borderColor: "#18a34a",
    background: "#ecfdf3",
  } as CSSProperties,

  choiceWrong: {
    borderColor: "#ef4444",
    background: "#fff1f2",
  } as CSSProperties,

  notice: {
    marginTop: 14,
    borderRadius: 16,
    border: "1.5px solid #ddd",
    background: "#fff",
    padding: 14,
  } as CSSProperties,

  noticeTitle: {
    margin: 0,
    fontWeight: 900,
    fontSize: 18,
  } as CSSProperties,

  noticeText: {
    margin: "8px 0 0",
    lineHeight: 1.6,
    color: "#333",
  } as CSSProperties,
};