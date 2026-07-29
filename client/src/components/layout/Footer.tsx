const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground md:flex-row md:text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">SmartLibrary</span>
          {" "}All rights reserved.
        </p>
        <p className="text-center">
          Built with <span className="text-red-500">&#9829;</span> using React, Express, Azure SQL &amp; Azure Blob Storage
        </p>
      </div>
    </footer>
  );
};

export default Footer;

