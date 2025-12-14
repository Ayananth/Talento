import React from "react";
import { Facebook, Twitter, Linkedin, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white/60 backdrop-blur-xl border-t border-gray-200 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP SECTION */}
        <div className="grid grid-cols-6 md:grid-cols-6 gap-10">

          {/* LOGO */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <div className="w-5 h-5 bg-blue-300 rounded rotate-45"></div>
              </div>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                Talento
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 pr-4">
              Talento helps you find the best opportunities. Discover jobs, connect with teams, and grow your career globally.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4">
              <a className="bg-gray-100 hover:bg-blue-600 hover:text-white transition p-3 rounded-full shadow-sm">
                <Facebook size={18} />
              </a>
              <a className="bg-gray-100 hover:bg-blue-500 hover:text-white transition p-3 rounded-full shadow-sm">
                <Twitter size={18} />
              </a>
              <a className="bg-gray-100 hover:bg-blue-600 hover:text-white transition p-3 rounded-full shadow-sm">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* RESOURCES */}
          <FooterColumn
            title="Resources"
            links={["About Us", "Our Team", "Products", "Contact"]}
          />

          {/* COMMUNITY */}
          <FooterColumn
            title="Community"
            links={["Feature", "Pricing", "Credits", "FAQ"]}
          />

          {/* QUICK LINKS */}
          <FooterColumn
            title="Quick Links"
            links={["iOS", "Android", "Windows", "Desktop"]}
          />

          {/* MORE */}
          <FooterColumn
            title="More"
            links={["Privacy", "Help", "Terms", "FAQ"]}
          />
        </div>

        {/* LINE SEPARATOR */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm text-center">
            © {new Date().getFullYear()} Talento. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a className="text-gray-600 hover:text-blue-600 transition">Privacy Policy</a>
            <a className="text-gray-600 hover:text-blue-600 transition">Terms & Conditions</a>
            <a className="text-gray-600 hover:text-blue-600 transition">Security</a>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <ArrowUp size={22} />
      </button>
    </footer>
  );
}

/* REUSABLE COLUMN COMPONENT */
function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4 text-lg tracking-tight">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item}>
            <a className="text-gray-600 hover:text-blue-600 text-sm transition cursor-pointer">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
