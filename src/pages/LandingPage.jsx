import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  LinkIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: LinkIcon,
      title: 'Smart URL Shortening',
      description: 'Create short, memorable links that are easy to share and track.',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Get detailed analytics on your links including clicks, locations, and devices.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with spam protection and malware detection.',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Optimized for speed with global CDN and instant redirects.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Access your links from anywhere in the world with 99.9% uptime.',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works perfectly on all devices.',
    },
  ];

  const stats = [
    { number: '10M+', label: 'Links Created' },
    { number: '50M+', label: 'Clicks Tracked' },
    { number: '99.9%', label: 'Uptime' },
    { number: '150+', label: 'Countries' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900">
        {/* Navigation */}
        <nav className="relative px-6 py-6 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">URLShortner</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative px-6 py-24 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Shorten URLs with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                {' '}Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform long URLs into short, shareable links. Track performance, analyze traffic, 
              and grow your audience with our powerful URL shortening platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Shortening URLs
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our platform provides all the tools you need to create, manage, and analyze your shortened URLs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-24 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of users who trust our platform for their URL shortening needs.
              </p>
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Create Your Account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-12 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold">URLShortner</span>
                </div>
                <p className="text-gray-400">
                  The intelligent URL shortening platform for modern businesses.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 URLShortner. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
