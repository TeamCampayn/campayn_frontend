import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Campayn</h3>
            <p className="text-sm">
              India's leading influencer marketing platform connecting brands with authentic creators.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@campayn.com"
                className="hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-white transition-colors">
                  For Creators
                </Link>
              </li>
              <li>
                <Link to="/create-campaign" className="hover:text-white transition-colors">
                  For Brands
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="hover:text-white transition-colors">
                  Cancellation & Refunds
                </Link>
              </li>
              <li>
                <Link to="/data-deletion" className="hover:text-white transition-colors">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@campayn.com" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="mailto:sales@campayn.com" className="hover:text-white transition-colors">
                  Sales Inquiries
                </a>
              </li>
              <li>
                <a href="mailto:press@campayn.com" className="hover:text-white transition-colors">
                  Press & Media
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© {new Date().getFullYear()} Campayn India Pvt Ltd. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Made with ❤️ in India | Delhi, India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
