export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '4h',
    issuer: 'mugshop-admin',
    audience: 'mugshop-admin-panel'
  },
  
  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
    historyCount: 5 // remember last 5 passwords
  },
  
  // Account Lockout Configuration
  lockout: {
    maxAttempts: 5,
    lockoutDuration: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    resetAttemptsAfter: 15 * 60 * 1000 // 15 minutes in milliseconds
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    admin: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50 // requests per window
    },
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // login attempts per window
    }
  },
  
  // Session Configuration
  session: {
    maxAge: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    refreshThreshold: 30 * 60 * 1000, // 30 minutes before expiry
    maxSessions: 3 // maximum concurrent sessions per user
  },
  
  // Security Headers
  headers: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    csp: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com', 'https://admin.your-domain.com']
      : ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles: 5
  },
  
  // Audit Logging Configuration
  audit: {
    enabled: true,
    logLevel: 'info',
    maxLogs: 10000,
    retentionDays: 30
  }
};

export default securityConfig;
