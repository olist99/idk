# Snog - Secure Social Discovery Platform

A modern, **secure**, and **GDPR-compliant** social discovery platform built with Next.js 14, featuring comprehensive authentication, age verification, content moderation, and data protection.

## 🔐 Security & Compliance Features

### ✅ User Authentication
- **NextAuth.js** integration with secure session management
- **Bcrypt password hashing** (12 rounds)
- **Account lockout** after failed login attempts
- **Two-factor authentication** support
- **Rate limiting** on authentication endpoints

### ✅ Age Verification
- **Mandatory 18+ verification** for all users
- Multiple verification methods:
  - Government ID upload
  - Credit card verification
  - Third-party verification services (Onfido, Jumio, Veriff)
- **Annual re-verification** for users under 21
- Secure document handling with auto-deletion

### ✅ Content Moderation
- **AI-powered image moderation** using NSFWJS + TensorFlow
- **Text content filtering** (profanity, hate speech, spam)
- **Human moderation queue** for flagged content
- **User reporting system** with investigation workflow
- **Automated suspicious activity detection**

### ✅ GDPR Compliance
- **Right to Access** - Export all personal data
- **Right to Erasure** - Delete account with 30-day grace period
- **Right to Portability** - Machine-readable data export
- **Consent Management** - Granular privacy controls
- **Data Minimization** - Only collect necessary data
- **Audit Logging** - Complete activity tracking

### ✅ Data Security
- **AES-256 encryption** for sensitive data at rest
- **TLS 1.3** for data in transit
- **Message encryption** for private communications
- **EXIF data removal** from uploaded images
- **IP address anonymization** for privacy
- **Secure password requirements** with strength validation

### ✅ Privacy & Safety
- **Block/unmatch functionality**
- **Report abusive users**
- **Content moderation pipeline**
- **Terms of Service** and **Privacy Policy**
- **Safety guidelines** and resources

## 🚀 Features

- **Server-Side Rendering (SSR)** - Fast initial page loads with Next.js 14 App Router
- **Swipeable Cards** - Smooth drag-and-drop interactions with Framer Motion
- **Real-time Matching** - Instant feedback on Snog, Marry, or Avoid decisions
- **State Management** - Zustand for efficient client-side state
- **Responsive Design** - Beautiful UI that works on all devices
- **Type-Safe** - Built with TypeScript for better developer experience

## 🎨 Design Features

- Custom gradient backgrounds with dark theme
- Glass morphism effects
- Smooth animations and transitions
- Custom fonts (Clash Display + DM Sans)
- Mobile-first responsive design

## 📱 Pages

1. **Discover** (`/`) - Swipe through profiles with Snog/Marry/Avoid actions
2. **Matches** (`/matches`) - View all your matches and filter by type
3. **Messages** (`/messages`) - Chat with your matches (UI ready)
4. **Profile** (`/profile`) - View and edit your profile

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 14 (App Router with SSR)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

### Security & Compliance
- **Password Hashing**: Bcryptjs
- **Encryption**: AES-256 (Node.js Crypto)
- **Age Verification**: ID verification services integration
- **Content Moderation**: NSFWJS + TensorFlow.js
- **Rate Limiting**: rate-limiter-flexible
- **Validation**: Zod

### Frontend
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Image Processing**: Sharp
- **Date Formatting**: date-fns

### Infrastructure
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Monitoring**: Audit logging system

## 🏗️ Project Structure

```
snog-clone/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── legal/            # Terms of Service & Privacy Policy
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Discover page (SSR)
│   ├── DiscoverClient.tsx
│   ├── globals.css
│   ├── matches/
│   ├── messages/
│   └── profile/
├── components/
│   ├── ProfileCard.tsx
│   ├── ActionButtons.tsx
│   └── Navigation.tsx
├── lib/
│   ├── auth/
│   │   ├── auth.ts       # NextAuth configuration
│   │   └── prisma.ts     # Prisma client
│   ├── security/
│   │   ├── encryption.ts # Password hashing, encryption
│   │   ├── content-moderation.ts  # AI moderation
│   │   ├── gdpr.ts       # GDPR compliance utilities
│   │   └── audit.ts      # Audit logging
│   ├── validators/
│   │   └── age-verification.ts
│   ├── middleware/
│   │   └── rate-limit.ts
│   ├── data.ts
│   └── store.ts
├── prisma/
│   └── schema.prisma     # Database schema with security features
├── .env.example          # Environment variables template
├── SECURITY.md           # Security documentation
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Cloudinary account for image storage

### 1. Clone and Install

```bash
# Extract the archive
tar -xzf snog-clone.tar.gz
cd snog-clone

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# Create a PostgreSQL database
createdb snog_db

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/snog_db"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed with sample data
npm run prisma:seed
```

### 3. Configure Environment Variables

Edit `.env` file with your credentials:

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# Email (for verification)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Optional Services
CLOUDINARY_CLOUD_NAME="your-cloud-name"
AGE_VERIFICATION_API_KEY="your-api-key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Key Interactions

### Swipe Gestures
- **Swipe Right** → Snog (Like)
- **Swipe Left** → Avoid (Pass)
- **Swipe Up** → Marry (Super Like)

### Button Actions
- **Green Button** → Snog
- **Pink Button** → Marry
- **Red Button** → Avoid

## 🔧 Configuration

### Environment Variables (Future)
Create a `.env.local` file for production:

```env
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

## 🚢 Production Deployment

### Security Checklist

Before deploying to production:

- [ ] Set strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure production database with SSL
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Configure Cloudinary or S3 for image storage
- [ ] Enable age verification service integration
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting thresholds
- [ ] Review and customize Terms of Service
- [ ] Review and customize Privacy Policy
- [ ] Set up automated database backups
- [ ] Configure HTTPS/TLS certificates
- [ ] Enable security headers
- [ ] Test GDPR data export/deletion
- [ ] Set up monitoring and alerts

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

See `.env.example` for required variables. Critical ones:

```bash
DATABASE_URL=              # Production PostgreSQL URL (with SSL)
NEXTAUTH_SECRET=           # Strong secret (32+ characters)
NEXTAUTH_URL=              # Your production domain
ENCRYPTION_KEY=            # 32-character encryption key
CLOUDINARY_*=              # Image storage credentials
SMTP_*=                    # Email service credentials
AGE_VERIFICATION_API_KEY=  # Age verification service
```

## ✅ Implemented Security Features

- [x] User authentication with NextAuth.js
- [x] Real database integration (PostgreSQL + Prisma)
- [x] Age verification system (multiple methods)
- [x] Content moderation (AI + human review)
- [x] GDPR compliance (data export, deletion, consent)
- [x] Privacy Policy & Terms of Service
- [x] Rate limiting and DDoS protection
- [x] Audit logging system
- [x] Password security (hashing, strength validation)
- [x] Data encryption (at rest and in transit)
- [x] EXIF data removal from images
- [x] User reporting system
- [x] Block/unmatch functionality
- [x] Session management
- [x] IP address anonymization
- [x] Suspicious activity detection

## 🔮 Future Enhancements

- [ ] Video profiles
- [ ] Real-time messaging (WebSocket/Pusher)
- [ ] Advanced filtering options
- [ ] Geolocation features
- [ ] In-app notifications
- [ ] Premium features
- [ ] Mobile apps (React Native)
- [ ] Social media integration
- [ ] Verified profiles
- [ ] Video chat functionality

## 🔐 Security & Legal Compliance

### ✅ Already Implemented

This application includes comprehensive security and compliance features:

1. **Authentication & Authorization**
   - Secure password hashing (Bcrypt)
   - Session management
   - Rate limiting on auth endpoints
   - Account lockout on failed attempts

2. **Age Verification**
   - Mandatory 18+ verification
   - Multiple verification methods
   - Compliance with age-restricted service regulations

3. **Content Moderation**
   - AI-powered image screening (NSFWJS)
   - Text content filtering
   - Human moderation queue
   - User reporting system

4. **GDPR Compliance**
   - Data export functionality
   - Right to be forgotten (account deletion)
   - Consent management
   - Audit logging
   - Privacy Policy and Terms of Service

5. **Data Protection**
   - AES-256 encryption
   - HTTPS/TLS encryption
   - EXIF data removal
   - IP address anonymization
   - Secure database with Prisma

### Additional Recommendations for Production

1. **Third-Party Services**
   - Set up age verification service (Onfido, Jumio, etc.)
   - Configure email service (SendGrid, AWS SES)
   - Set up image CDN (Cloudinary, S3)
   - Enable error tracking (Sentry)

2. **Monitoring & Maintenance**
   - Set up security monitoring
   - Regular security audits
   - Automated backups
   - Incident response plan
   - Content moderation team

3. **Legal Requirements**
   - Consult with legal counsel
   - Customize Terms of Service for your jurisdiction
   - Update Privacy Policy with your details
   - Register as data controller (GDPR)
   - Implement cookie consent (if in EU)

4. **Insurance & Liability**
   - Consider cyber liability insurance
   - Professional indemnity insurance
   - Legal reserve fund

### Performance
- Images are optimized with Next.js Image component
- Server-Side Rendering for fast initial loads
- Client-side navigation for smooth transitions
- Lazy loading for better performance

## 📝 API Integration Guide

To connect to a real backend:

1. **Replace mock data in `lib/data.ts`**:
```typescript
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}
```

2. **Add API routes in `app/api/`**:
```typescript
// app/api/users/route.ts
export async function GET() {
  // Fetch from database
  const users = await db.users.findMany();
  return Response.json(users);
}
```

3. **Update Server Components** to fetch real data:
```typescript
// app/page.tsx
const users = await getUsers();
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
  }
}
```

### Change Fonts
Update in `app/globals.css` and `tailwind.config.js`

## 📄 Documentation

- **[SECURITY.md](./SECURITY.md)** - Comprehensive security documentation
- **[Terms of Service](./app/legal/terms/page.tsx)** - Legal terms
- **[Privacy Policy](./app/legal/privacy/page.tsx)** - GDPR-compliant privacy policy
- **[API Documentation](#)** - Coming soon

## 📄 License

This project is for educational purposes. Ensure compliance with local laws and platform policies before deploying.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14 and TypeScript
