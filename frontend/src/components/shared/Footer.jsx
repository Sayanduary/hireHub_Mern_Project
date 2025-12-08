import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    about: [
      { name: "About us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Employer home", href: "#" },
      { name: "Sitemap", href: "#" },
      { name: "Credits", href: "#" },
    ],
    helpCenter: [
      { name: "Help center", href: "#" },
      { name: "Summons/Notices", href: "#" },
      { name: "Grievances", href: "#" },
      { name: "Report issue", href: "#" },
    ],
    privacy: [
      { name: "Privacy policy", href: "#" },
      { name: "Terms & conditions", href: "#" },
      { name: "Fraud alert", href: "#" },
      { name: "Trust & safety", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#0a66c2] dark:text-[#70b5f9] mb-4">
              JobPortal
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Connect with us
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#0a66c2] dark:hover:bg-[#70b5f9] hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#0a66c2] dark:hover:bg-[#70b5f9] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#0a66c2] dark:hover:bg-[#70b5f9] hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#0a66c2] dark:hover:bg-[#70b5f9] hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Center Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.helpCenter.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.privacy.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
