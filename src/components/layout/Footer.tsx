
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card/50 py-6 mt-auto border-t border-border">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {currentYear} Bakebook. All rights reserved.</p>
        <p className="text-sm">A creation by Waves Digital Services</p>
        <p className="text-sm">Crafted with <span className="text-primary">&hearts;</span> for Bakers</p>
      </div>
    </footer>
  );
};

export default Footer;
