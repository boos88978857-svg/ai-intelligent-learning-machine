// app/ui.ts
import { CSSProperties } from "react";

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
    borderRadius: 16,
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
    border: "1.5px solid #e6e6e6",
    borderRadius: 18,
    padding: 16,
  } as CSSProperties,

  cardTitle: {
    margin: "0 0 10px",
    fontSize: 18,
    fontWeight: 900,
  } as CSSProperties,

  cardDesc: {
    margin: 0,
    lineHeight: 1.6,
    opacity: 0.85,
    fontSize: 15,
  } as CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  } as CSSProperties,

  pillRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  } as CSSProperties,

  pill: {
    padding: "10px 14px",
    borderRadius: 16,
    border: "1.5px solid #e5e5e5",
    background: "#fff",
    fontWeight: 900,
    whiteSpace: "nowrap",
  } as CSSProperties,

  choiceBtn: {
    width: "100%",
    textAlign: "left",
    padding: "14px 14px",
    borderRadius: 16,
    border: "1.5px solid #e5e5e5",
    background: "#fff",
    fontWeight: 900,
    fontSize: 20,
    cursor: "pointer",
  } as CSSProperties,

  choiceBtnSelected: {
    borderColor: "#245bff",
    boxShadow: "0 0 0 2px rgba(36,91,255,0.18) inset",
    background: "#f3f6ff",
  } as CSSProperties,

  choiceBtnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  } as CSSProperties,

  actionRow: {
    marginTop: 14,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  } as CSSProperties,

  primaryBtn: {
    padding: "12px 16px",
    borderRadius: 16,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  } as CSSProperties,

  msgCard: {
    marginTop: 14,
    background: "#fff",
    border: "1.5px solid #e6e6e6",
    borderRadius: 18,
    padding: 16,
  } as CSSProperties,
} as const;