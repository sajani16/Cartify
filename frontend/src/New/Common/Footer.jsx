// Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#6B4C3B] text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">About Our Café</h2>
          <p className="text-sm">
            Cozy corner for coffee lovers. Enjoy freshly brewed coffee, pastries, and a warm ambiance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-yellow-300 transition">Home</a></li>
            <li><a href="/menu" className="hover:text-yellow-300 transition">Menu</a></li>
            <li><a href="/about" className="hover:text-yellow-300 transition">About</a></li>
            <li><a href="/contact" className="hover:text-yellow-300 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-sm">123 Coffee Street, Bean Town</p>
          <p className="text-sm">Phone: +123 456 7890</p>
          <p className="text-sm">Email: info@cozycafe.com</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-yellow-300 transition">Facebook</a>
            <a href="#" className="hover:text-yellow-300 transition">Instagram</a>
            <a href="#" className="hover:text-yellow-300 transition">Twitter</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-brown-800 mt-8 pt-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Cozy Café. All rights reserved.
      </div>
    </footer>
  );
}
