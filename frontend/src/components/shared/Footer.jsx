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
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              careerX
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              A modern job platform connecting professionals with verified
              opportunities worldwide.
            </p>

            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    h-9 w-9 rounded-md
                    border border-gray-200 dark:border-white/10
                    flex items-center justify-center
                    text-gray-500 dark:text-gray-400
                    hover:text-black dark:hover:text-white
                    hover:border-gray-300 dark:hover:border-white/20
                    transition
                  "
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} careerX. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Built for professionals. Designed for clarity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
