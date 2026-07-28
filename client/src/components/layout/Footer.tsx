const Footer: React.FC = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        color: "var(--muted-foreground)",
        fontSize: "13px",
        padding: "16px 0",
        borderTop: "1px solid var(--border)",
        marginTop: "8px",
      }}
    >
      <p>&copy; {new Date().getFullYear()} SmartLibrary. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

