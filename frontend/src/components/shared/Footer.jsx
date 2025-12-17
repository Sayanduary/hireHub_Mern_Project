import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Employer home", href: "#" },
      { name: "Sitemap", href: "#" },
    ],
    resources: [
      { name: "Help center", href: "#" },
      { name: "Report issue", href: "#" },
      { name: "Trust & safety", href: "#" },
    ],
    legal: [
      { name: "Privacy policy", href: "#" },
      { name: "Terms & conditions", href: "#" },
      { name: "Fraud alert", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-gray-200 dark:border-[#444444] bg-white dark:bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
              HIREHUB
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-[#B0B0B0] max-w-xs leading-relaxed">
              A modern job platform connecting professionals with verified
              opportunities worldwide.
            </p>

            <div className="flex items-center gap-2 mt-5">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    h-9 w-9 rounded-md
                    border border-gray-200 dark:border-[#444444]
                    flex items-center justify-center
                    text-gray-500 dark:text-[#888888]
                    hover:text-gray-900 dark:hover:text-[#E0E0E0]
                    hover:bg-gray-100 dark:hover:bg-[#1a1a1a]
                    transition-colors
                  "
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-[#B0B0B0] hover:text-gray-900 dark:hover:text-[#E0E0E0] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-[#B0B0B0] hover:text-gray-900 dark:hover:text-[#E0E0E0] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0] mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-[#B0B0B0] hover:text-gray-900 dark:hover:text-[#E0E0E0] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-[#444444] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-[#888888]">
            © {new Date().getFullYear()} HIREHUB. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 dark:text-[#888888]">
            Built for professionals. Designed for clarity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
