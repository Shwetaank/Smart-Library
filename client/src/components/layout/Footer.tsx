const Footer = () => {
  return (
    // Application footer
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-sm text-muted-foreground md:flex-row">
        {/* Copyright */}
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">SmartLibrary</span>{" "}
          All rights reserved.
        </p>

        {/* Tech stack */}
        <p>
          Built with ❤️ using React, Express, Azure SQL &amp; Azure Blob Storage
        </p>
      </div>
    </footer>
  );
};

export default Footer;