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
  SparklesIcon,
  RocketLaunchIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

// Import images
import dashboardLaptop from '../assets/dashboard-laptop.png';
import urlAnalytics from '../assets/url-analytics.png';

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: LinkIcon,
      title: 'Smart URL Shortening',
      description: 'Transform long URLs into short, memorable links with intelligent customization.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track clicks, locations, devices, and get insights to optimize your campaigns.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Enterprise Security',
      description: 'Bank-level security with spam protection, malware detection, and SSL encryption.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Global CDN with 99.9% uptime ensures instant redirects worldwide.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Access your links from anywhere with servers in 150+ countries.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile First',
      description: 'Optimized for all devices with native mobile app-like experience.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { number: '50M+', label: 'Links Created', icon: LinkIcon },
    { number: '200M+', label: 'Clicks Tracked', icon: ChartBarIcon },
    { number: '99.9%', label: 'Uptime', icon: ShieldCheckIcon },
    { number: '150+', label: 'Countries', icon: GlobeAltIcon },
  ];

  const benefits = [
    'Unlimited link creation',
    'Real-time analytics dashboard',
    '24/7 customer support',
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Main content wrapper with semantic HTML structure */}
      <main className="bg-white dark:bg-gray-900 overflow-hidden">
        {/* Navigation */}
        <nav className="relative px-4 sm:px-6 py-4 sm:py-6 mx-auto flex justify-between items-center max-w-7xl" role="navigation" aria-label="Main navigation">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <LinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">SnipURL</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-2 sm:space-x-4"
          >
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? (
                <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 sm:px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Get Started Free
            </Link>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="relative px-4 sm:px-6 py-16 sm:py-20 mx-auto max-w-7xl">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200/50 dark:border-primary-700/50 mb-8"
            >
              <SparklesIcon className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Trusted by 100,000+ users worldwide</span>
            </motion.div>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Shorten URLs with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600">
                Super Intelligence
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform long URLs into powerful, trackable links. Boost engagement, analyze performance, 
              and grow your audience with our AI-powered URL shortening platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 sm:px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-primary-500/25 flex items-center justify-center min-w-[200px]"
              >
                Start Creating Links
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600 flex items-center justify-center min-w-[200px]">
                <PlayIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> succeed</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our platform provides all the tools you need to create, manage, and analyze your shortened URLs with enterprise-grade features.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`h-16 w-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Showcase Section */}
        <div className="px-6 py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200/50 dark:border-primary-700/50">
                  <ChartBarIcon className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Analytics Dashboard</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Powerful
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Analytics</span>
                  <br />
                  at Your Fingertips
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Track every click, analyze visitor behavior, and optimize your campaigns with our comprehensive analytics dashboard. 
                  Get insights that help you make data-driven decisions.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Real-time click tracking and monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Geographic and device analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Custom reports and data export</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Start Tracking Analytics
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Analytics Dashboard Preview */}
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  {/* Browser-like header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Analytics Dashboard</div>
                  </div>
                  
                  {/* Analytics Image */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={urlAnalytics} 
                      alt="URL Analytics Dashboard" 
                      className="w-full h-auto object-cover shadow-lg"
                    />
                    
                    {/* Floating stats overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className="text-2xl font-bold text-primary-600">2.4K</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Total Clicks</div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className="text-2xl font-bold text-purple-600">+23%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Growth</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-6 py-24 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Why choose
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> SnipURL?</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  We've built the most comprehensive URL shortening platform that scales with your business needs. 
                  From individual creators to enterprise teams, we've got you covered.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className="inline-flex items-center bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Dashboard Preview with Real Images */}
                <div className="space-y-6">
                  {/* Laptop Dashboard */}
                  <div className="relative">
                    <div className="bg-gray-800 rounded-t-2xl p-3 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
                      <img 
                        src={dashboardLaptop} 
                        alt="Dashboard on laptop" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-24 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <RocketLaunchIcon className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to launch your links?
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                Join thousands of creators, marketers, and businesses who trust our platform to power their link strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-50 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/50 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-200">
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-20 bg-gray-900 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tl from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Main footer content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Company info */}
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center">
                    <LinkIcon className="h-7 w-7 text-white" />
                  </div>
                  <span className="ml-3 text-3xl font-bold">SnipURL</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg max-w-md">
                  The intelligent URL shortening platform that helps you create, track, and optimize your links for maximum engagement.
                </p>
              </div>

              {/* Quick actions */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/register"
                      className="group bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 transition-all duration-200 hover:border-primary-500/50 flex items-center"
                    >
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <RocketLaunchIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Get Started</div>
                        <div className="text-sm text-gray-400">Create your first link</div>
                      </div>
                    </Link>
                    
                    <Link
                      to="/login"
                      className="group bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 transition-all duration-200 hover:border-primary-500/50 flex items-center"
                    >
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <ChartBarIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">View Analytics</div>
                        <div className="text-sm text-gray-400">Track your links</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">&copy; 2024 SnipURL. All rights reserved.</p>
                <div className="flex items-center space-x-4">
                  <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
                  <span className="text-gray-600">•</span>
                  <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
                </div>
              </div>
              
              {/* Made with love */}
              {/* <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Made with</span>
                <svg className="h-4 w-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-gray-400 text-sm">by</span>
                <a 
                  href="https://www.linkedin.com/in/iamsaurabhshukla" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors hover:underline"
                >
                  Saurabh
                </a>
              </div> */}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
