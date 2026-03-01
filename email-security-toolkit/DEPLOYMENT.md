# AuthGuard - Deployment Guide

## 🌐 Quick Deploy (One-Click)

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above or visit [vercel.com/new](https://vercel.com/new)
2. Import this repository
3. Vercel will auto-detect Vite configuration
4. Click "Deploy" - Done! Your app will be live in ~1 minute

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the button above or visit [app.netlify.com](https://app.netlify.com)
2. Connect your Git repository
3. Netlify will use the `netlify.toml` configuration
4. Click "Deploy" - Your site will be live shortly

## 📦 Manual Deployment

### 1. Build for Production
```bash
cd email-security-toolkit
npm install
npm run build
```
This creates an optimized production build in the `dist` folder.

### 2. Preview Production Build
```bash
npm run preview
```

### 3. Deploy Options

#### Option A: Static Hosting (GitHub Pages, Cloudflare Pages, etc.)
- Upload the `dist` folder contents to your hosting provider
- Ensure the server is configured for Single Page Applications (SPA)

#### Option B: Using Vercel CLI
```bash
npm i -g vercel
cd email-security-toolkit
vercel --prod
```

#### Option C: Using Netlify CLI
```bash
npm i -g netlify-cli
cd email-security-toolkit
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Files Included

- **vercel.json**: Vercel configuration with SPA routing and security headers
- **netlify.toml**: Netlify build settings, redirects, and caching rules
- **vite.config.js**: Development server configured for network access

## 🌍 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (360px - 767px)
- 📲 Tablets (768px - 1023px)
- 💻 Laptops (1024px - 1399px)
- 🖥️ Desktops (1400px - 1599px)
- 🖥️ Ultra-wide displays (1600px+)
- 🔄 Landscape orientation support
- 🖨️ Print-optimized layouts

## 🔒 Security Features

- Security headers configured (X-Frame-Options, CSP, etc.)
- No sensitive data in client-side code
- HTTPS recommended for production
- DNS data simulation (no real API keys exposed)

## 📊 Performance

- Vite-powered build for optimal performance
- Code splitting and lazy loading
- CSS optimization and minification
- Asset caching strategies configured

## 🚀 Custom Domain

### Vercel
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain and follow DNS instructions

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Update your DNS records as instructed

## 📝 Environment Variables

This application currently uses simulated DNS data and doesn't require environment variables. 

For future API integration:
```env
VITE_API_ENDPOINT=your-api-url
VITE_API_KEY=your-api-key
```

## 🐛 Troubleshooting

**Build fails:**
- Ensure Node.js version 18+ is installed
- Delete `node_modules` and `package-lock.json`, then run `npm install`

**Blank page after deployment:**
- Check browser console for errors
- Verify base URL in `vite.config.js` matches your deployment path
- Ensure SPA redirect rules are configured

**Styles not loading:**
- Clear browser cache
- Check CDN/hosting for proper MIME types
- Verify Google Fonts are accessible (IBM Plex Sans, IBM Plex Mono)

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Verify all dependencies are installed
- Ensure production build completes without errors

---

**Built with:** React 19 + Vite 7 | **Optimized for:** All devices | **Ready for:** Public deployment
