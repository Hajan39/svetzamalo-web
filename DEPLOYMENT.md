# 🚀 Deployment Guide

This guide covers deploying the Lowcost Traveling app to Vercel with all optimizations and configurations.

## 📋 Prerequisites

- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Google Analytics 4 property (optional)
- Google AdSense account (optional)

## 🔧 Environment Setup

### 1. Copy Environment Template

```bash
cp env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

```bash
# Site Configuration
VITE_SITE_URL=https://your-app.vercel.app

# Analytics (GA4)
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_PROVIDER=google-analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXXX
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Monetization
VITE_ENABLE_ADS=true
VITE_AD_PROVIDER=adsense
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Affiliate Partners
VITE_SKYSCANNER_AFFILIATE_ID=your_skyscanner_id
VITE_BOOKING_AFFILIATE_ID=your_booking_id
```

### 3. Set Environment Variables in Vercel

```bash
# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SITE_URL
vercel env add VITE_GA_TRACKING_ID
vercel env add VITE_ADSENSE_CLIENT_ID
# ... add other variables
```

## 🚀 Deployment Steps

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name: lowcost-traveling
# - Select directory: ./
# - Override build settings: No

# Deploy updates
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output`
   - **Install Command**: `npm install`

## 🔧 Build Optimizations

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze
```

### Performance Monitoring

The app includes:
- Core Web Vitals tracking
- Bundle size monitoring
- Performance metrics collection

## 📊 Analytics Setup (GA4)

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property
3. Note the Measurement ID (G-XXXXXXXXXX)

### 2. Configure GA4

```bash
# Set in environment
VITE_GA_TRACKING_ID=GA-XXXXXXXXXX
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_PROVIDER=google-analytics
```

### 3. GDPR Compliance

The app includes:
- Consent banner for analytics
- Cookie-less tracking when consent denied
- IP anonymization
- Do Not Track support

## 📢 AdSense Setup

### 1. Get AdSense Approval

1. Apply at [Google AdSense](https://adsense.google.com)
2. Wait for approval
3. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)

### 2. Configure AdSense

```bash
# Set in environment
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ENABLE_ADS=true
VITE_AD_PROVIDER=adsense
```

### 3. Ad Placement

Ads are placed at:
- Article top banner
- Article end banner
- Destination sidebar

## 🌍 Domain Setup

### Custom Domain

1. Go to Vercel project settings
2. Add custom domain
3. Configure DNS records
4. Update `VITE_SITE_URL` environment variable

### SSL Certificate

Vercel provides automatic SSL certificates for all deployments.

## 🔍 SEO & Performance

### Sitemap Generation

The app automatically generates:
- `/sitemap.xml` - Main sitemap
- Dynamic routes included

### Meta Tags

All pages include:
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Canonical URLs

## 🧪 Testing Deployment

### Local Testing

```bash
# Test production build locally
npm run preview:build

# Test with environment variables
VITE_SITE_URL=http://localhost:4173 npm run dev
```

### Vercel Preview Deployments

Every git push creates a preview deployment:
- `main` branch → Production
- Other branches → Preview URLs
- Pull requests → Automatic previews

## 🚨 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check TypeScript errors
npm run type-check

# Check linting
npm run lint

# Clear cache
rm -rf node_modules .output
npm install
```

#### Analytics Not Working
```bash
# Check environment variables
vercel env ls

# Check consent status
# Visit site and check localStorage for 'analytics-consent'
```

#### Ads Not Loading
```bash
# Check AdSense approval status
# Verify client ID format
# Check browser console for errors
```

### Performance Issues

```bash
# Bundle analysis
npm run analyze

# Core Web Vitals
# Check in Chrome DevTools > Lighthouse
```

## 📈 Monitoring & Analytics

### Vercel Analytics

Vercel provides built-in analytics:
- Page views
- Performance metrics
- Error tracking

### Custom Analytics

The app tracks:
- Page views with referrer
- Scroll depth milestones
- Custom events
- Performance metrics

### Error Tracking

```bash
# Check Vercel dashboard for errors
# Monitor console logs
# Set up error boundaries
```

## 🔄 Updates & Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Test build
npm run build

# Deploy
vercel --prod
```

### Content Updates

```bash
# Update articles in src/content/
# Test locally
npm run dev

# Deploy changes
git push origin main
```

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally first
4. Check GitHub issues

## 🎉 Success Checklist

- [ ] Environment variables configured
- [ ] Vercel project created
- [ ] Domain configured (optional)
- [ ] Analytics working (optional)
- [ ] Ads configured (optional)
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] SEO configured

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Google Analytics Setup](https://developers.google.com/analytics/devguides/collection/ga4)
- [AdSense Policies](https://support.google.com/adsense)
- [TanStack Router Deployment](https://tanstack.com/router/latest/docs/framework/react/start/deployment)