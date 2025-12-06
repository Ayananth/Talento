import React from 'react';
import { Facebook, Twitter, Linkedin, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-wrap gap-8 mb-12">
          {/* Logo and Description */}
          <div className="flex-shrink-0" style={{ width: '280px' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-blue-400 rounded transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">Talento</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Talento is the heart of the design community and the best resource to discover and connect with designers and jobs worldwide.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="flex-shrink-0" style={{ width: '140px' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Our Team</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Products</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="flex-shrink-0" style={{ width: '140px' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Feature</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Credit</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex-shrink-0" style={{ width: '140px' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Quick links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">iOS</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Android</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Microsoft</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Desktop</a></li>
            </ul>
          </div>

          {/* More */}
          <div className="flex-shrink-0" style={{ width: '140px' }}>
            <h3 className="font-semibold text-gray-900 mb-4">More</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Help</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Download App Section */}
          {/* <div className="flex-shrink-0" style={{ width: '280px' }}>
            <h3 className="font-semibold text-gray-900 mb-2">Download App</h3>
            <p className="text-gray-600 text-sm mb-4">
              Download our Apps and get extra 15% Discount on your first Order...!
            </p>
            <div className="flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                <span className="text-lg">🍎</span>
                <div className="text-left">
                  <div className="text-xs opacity-90">Get it on</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                <span className="text-lg">▶️</span>
                <div className="text-left">
                  <div className="text-xs opacity-90">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            Copyright © 2022. JobBox all right reserved
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms & Conditions</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Security</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}