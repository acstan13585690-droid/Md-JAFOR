export type AppCategory = 
  | 'Games'
  | 'Communication'
  | 'Social'
  | 'Entertainment'
  | 'Tools'
  | 'Photography'
  | 'Education'
  | 'Lifestyle'
  | 'Finance'
  | 'Health & Fitness'
  | 'Media'
  | 'Productivity'
  | 'Personalization'
  | 'Security';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type PromotionType = 'STANDARD_PUBLISH' | 'FEATURED_LISTING' | 'SPONSORED_SEARCH' | 'HOMEPAGE_HERO';

export interface AndroidPermission {
  name: string;
  level: 'NORMAL' | 'DANGEROUS' | 'SIGNATURE';
  description: string;
}

export interface SecurityScanReport {
  isScanned: boolean;
  scannedAt: string;
  threatsDetected: number;
  safetyScore: number; // 0-100
  sha256: string;
  md5: string;
  targetSdk: number;
  minSdk: number;
  engine: string;
  verifiedPublisher: boolean;
  permissions: AndroidPermission[];
  aiAnalysisSummary?: string;
  riskFactors?: string[];
}

export interface AppReview {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  helpfulCount: number;
}

export interface AppVersionHistory {
  version: string;
  versionCode: number;
  releaseDate: string;
  changelog: string;
  apkSizeMb: number;
}

export interface ApkApp {
  id: string;
  name: string;
  packageName: string;
  developerId: string;
  developerName: string;
  category: AppCategory;
  shortDescription: string;
  fullDescription: string;
  iconUrl: string;
  screenshots: string[];
  version: string;
  versionCode: number;
  apkSizeMb: number;
  downloadUrl: string;
  rating: number;
  ratingCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  isFeatured: boolean;
  isSponsored: boolean;
  isHomepageHero: boolean;
  security: SecurityScanReport;
  hasDistributionRights: boolean;
  reviews: AppReview[];
  versionHistory: AppVersionHistory[];
  isDemoData: boolean;
}

export interface DeveloperAccount {
  id: string;
  name: string;
  email: string;
  companyName: string;
  isVerified: boolean;
  joinedAt: string;
  totalEarnings: number;
  balance: number;
  walletAddress?: string;
}

export interface PromotionPricing {
  standardPublishFee: number;
  featuredListingFee: number;
  sponsoredSearchFee: number;
  homepageHeroFee: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  developerId: string;
  developerName: string;
  appId?: string;
  appName?: string;
  promotionType: PromotionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  serverSignature: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface AppReport {
  id: string;
  appId: string;
  appName: string;
  reason: 'MALWARE' | 'COPYRIGHT' | 'SCAM_OR_FRAUD' | 'BROKEN_APP' | 'INAPPROPRIATE_CONTENT' | 'OTHER';
  details: string;
  reporterEmail: string;
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface MarketplaceStats {
  totalApps: number;
  totalDownloads: number;
  totalRevenue: number;
  pendingSubmissions: number;
  activeDevelopers: number;
  securityScansCount: number;
}
