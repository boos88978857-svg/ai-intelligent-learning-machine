export const ui = {
  wrap: {
    padding: 24,
    maxWidth: 980,
    margin: "0 auto",
  } as React.CSSProperties,

  navBar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    padding: "14px 24px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  } as React.CSSProperties,

  navBtn: {
    display: "inline-block",
    padding: "10px 14px",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 12,
    textDecoration: "none",
    color: "#111",
    background: "#fff",
    fontWeight: 600,
  } as React.CSSProperties,

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  } as React.CSSProperties,

  card: {
    display: "block",
    padding: 18,
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14,
    textDecoration: "none",
    color: "inherit",
    background: "#fff",
  } as React.CSSProperties,

  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  } as React.CSSProperties,

  cardDesc: {
    margin: "10px 0 0",
    opacity: 0.75,
    lineHeight: 1.7,
  } as React.CSSProperties,

  backLink: {
    display: "inline-block",
    marginTop: 14,
    color: "#1d4ed8",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: 16,
    cursor: "pointer",
    textDecoration: "underline",
  } as React.CSSProperties,
};