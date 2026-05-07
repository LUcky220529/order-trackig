export default function Footer() {
  return (
    <footer id="footer" className="bg-[#070f1e] text-[#c0c8d4] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Mercury</span>
                <span className="text-[#9aa5b4] text-xs block">Dry Cleaners</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#9aa5b4]">Premium garment care with the precision and speed of Mercury. Trusted by thousands.</p>

          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Dry Cleaning", "Laundry & Press", "Alterations", "Leather Cleaning", "Wedding Gowns", "Bulk / Corporate"].map((s) => (
                <li key={s}><a href="#" className="hover:text-[#d4af5a] transition-colors duration-200">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Operating Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-[#9aa5b4]">Mon – Sun</span><span>9:00 AM – 9:00 PM</span></li>
            </ul>
            <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Currently Open</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-[#b8963e]">📞</span>
                <div className="flex flex-col gap-1">
                  <a href="tel:+918010366665" className="hover:text-[#d4af5a] transition-colors">+91 80103 66665</a>
                  <a href="tel:+919310002020" className="hover:text-[#d4af5a] transition-colors">+91 93100 02020</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#b8963e]">✉️</span>
                <a href="mailto:naveensethi2007@yahoo.com" className="hover:text-[#d4af5a] transition-colors">naveensethi2007@yahoo.com</a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#b8963e] mt-0.5">📍</span>
                <a
                  href="https://www.google.com/maps/place/Mercury+Dry+Clean/@28.6442038,77.1331907,17z/data=!3m1!4b1!4m6!3m5!1s0x390d03b6c913d433:0x18b6c7df21f77dad!8m2!3d28.6441991!4d77.1357656!16s%2Fg%2F11lh_k4sfj!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#d4af5a] transition-colors leading-relaxed"
                >
                  1, Block F, Mansarover Garden,<br />New Delhi, Delhi 110015
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9aa5b4]">
          <p>© {new Date().getFullYear()} Mercury Dry Cleaners. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#d4af5a] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#d4af5a] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#d4af5a] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
