import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'For Creators', href: '/creators' },
      { name: 'For Brands', href: '/create-campaign' },
      { name: 'Contact Us', href: '/contact' },
    ],
    services: [
      { name: 'Creator Matching', href: '/dashboard/explore-creators' },
      { name: 'Campaign Management', href: '/dashboard' },
      { name: 'Analytics', href: '/dashboard' },
      { name: 'Support', href: '/dashboard/support' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Shipping Policy', href: '/shipping' },
      { name: 'Refund Policy', href: '/refunds' },
    ],
    support: [
      { name: 'Help Center', href: '/dashboard/support' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/dashboard/support' },
      { name: 'Report Issue', href: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campayn
                </h3>
                <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
                  Connecting brands with authentic creators to build meaningful campaigns that resonate with audiences and drive real results.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-600 hover:text-slate-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span>contact@campayn.in</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/70 hover:bg-white backdrop-blur-sm border border-slate-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-slate-600" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-600">Company</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-600">Services</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm sm:text-base text-slate-600 hover:text-purple-600 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-600">Legal</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm sm:text-base text-slate-600 hover:text-pink-600 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-600">Support</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 sm:space-y-6 lg:space-y-0">
              <div>
                <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-slate-800">Stay Updated</h4>
                <p className="text-sm sm:text-base text-slate-600">Get the latest news, insights, and creator trends delivered to your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:max-w-md lg:w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/70 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm sm:text-base"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <p className="text-slate-500 text-xs sm:text-sm">
                © {currentYear} Campayn India Pvt Ltd. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
                <Link to="/privacy" className="text-slate-500 hover:text-slate-700 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-slate-500 hover:text-slate-700 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/refunds" className="text-slate-500 hover:text-slate-700 transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
