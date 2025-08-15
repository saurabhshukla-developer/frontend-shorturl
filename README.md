# URLShortner Frontend

A beautiful, professional, and responsive frontend application for the URL shortening service built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication System**: Complete user registration, login, and password management
- **Dashboard**: Comprehensive analytics and statistics
- **URL Management**: Create, edit, delete, and organize shortened URLs
- **Group Management**: Organize URLs into logical groups
- **Dark Mode**: Toggle between light and dark themes
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live data updates and notifications
- **Professional Animations**: Smooth transitions using Framer Motion

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful SVG icons
- **Recharts** - Chart components for analytics

## 📱 Pages & Components

### Public Pages
- **Landing Page** - Hero section, features, and call-to-action
- **Login** - User authentication
- **Register** - User registration
- **Forgot Password** - Password reset request
- **Reset Password** - Password reset with token

### Protected Pages
- **Dashboard** - Overview with statistics and charts
- **URLs** - Manage shortened URLs with CRUD operations
- **Groups** - Organize URLs into groups
- **Profile** - User profile and settings

### Components
- **Layout** - Main application layout with sidebar navigation
- **Modals** - Reusable modal components for forms
- **Forms** - Form components with validation
- **Charts** - Analytics and statistics visualization

## 🎨 Design Features

- **Color Scheme**: Professional blue-based color palette
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent spacing system using Tailwind's scale
- **Shadows**: Subtle shadows and hover effects
- **Animations**: Smooth page transitions and micro-interactions
- **Icons**: Consistent iconography using Heroicons
- **Responsive**: Mobile-first responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urlshortner/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API. Update the `VITE_API_URL` environment variable to point to your backend server.

### Tailwind Configuration
Custom Tailwind configuration is available in `tailwind.config.js` with:
- Custom color palette
- Custom animations
- Extended spacing and typography

### Build Configuration
Vite configuration is optimized for:
- Fast development builds
- Optimized production builds
- CSS optimization
- Asset handling

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations

Smooth animations powered by Framer Motion:
- **Page Transitions**: Fade and slide effects
- **Component Animations**: Staggered animations for lists
- **Loading States**: Spinner and skeleton animations
- **Hover Effects**: Interactive hover animations

## 🔐 Authentication

Complete authentication system with:
- JWT token management
- Automatic token refresh
- Protected routes
- User session management
- Password reset functionality

## 📊 State Management

- **Context API**: For global state (auth, theme)
- **Local State**: Component-level state management
- **API Integration**: Real-time data fetching and updates

## 🧪 Development

### Code Structure
```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts for state
├── pages/         # Page components
├── services/      # API service functions
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

### Styling Guidelines
- Use Tailwind utility classes
- Follow component-based CSS architecture
- Maintain consistent spacing and typography
- Use semantic color names

### Component Guidelines
- Functional components with hooks
- Props validation
- Error boundaries
- Loading states
- Accessibility features

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Deploy the `dist` folder to your hosting service

### Environment Variables
Ensure these are set in production:
- `VITE_API_URL` - Backend API URL

### Static Hosting
The application can be deployed to:
- Vercel
- Netlify
- AWS S3
- Any static hosting service

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTPS**: Secure communication (in production)
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based CSRF protection

## 📈 Performance

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Optimized Images**: WebP format support
- **Minification**: CSS and JS minification
- **Caching**: Browser caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check `VITE_API_URL` environment variable
   - Ensure backend server is running
   - Check CORS configuration

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Heroicons** for beautiful SVG icons
- **React Team** for the amazing framework

---

Built with ❤️ using modern web technologies
