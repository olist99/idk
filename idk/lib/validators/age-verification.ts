import { prisma } from '../auth/prisma';
import { generateSecureToken } from '../security/encryption';

const MIN_AGE = parseInt(process.env.MIN_AGE_REQUIREMENT || '18');

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Verify if user meets minimum age requirement
 */
export function verifyAge(dateOfBirth: Date): {
  isValid: boolean;
  age: number;
  error?: string;
} {
  const age = calculateAge(dateOfBirth);
  
  if (age < MIN_AGE) {
    return {
      isValid: false,
      age,
      error: `You must be at least ${MIN_AGE} years old to use this service`,
    };
  }
  
  return {
    isValid: true,
    age,
  };
}

/**
 * Initiate age verification process
 */
export async function initiateAgeVerification(
  userId: string,
  method: 'id_upload' | 'credit_card' | 'third_party'
): Promise<{ verificationId: string; token: string }> {
  const verificationId = generateSecureToken(16);
  const token = generateSecureToken(32);
  
  // Store verification token
  await prisma.verificationToken.create({
    data: {
      email: userId, // Using this field for userId
      token,
      type: 'age_verification',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });
  
  return { verificationId, token };
}

/**
 * Complete age verification
 */
export async function completeAgeVerification(
  userId: string,
  token: string,
  method: 'id_upload' | 'credit_card' | 'third_party'
): Promise<boolean> {
  // Verify token
  const verification = await prisma.verificationToken.findFirst({
    where: {
      email: userId,
      token,
      type: 'age_verification',
      expires: {
        gt: new Date(),
      },
    },
  });
  
  if (!verification) {
    throw new Error('Invalid or expired verification token');
  }
  
  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      ageVerified: true,
      ageVerifiedAt: new Date(),
      ageVerificationMethod: method,
    },
  });
  
  // Delete used token
  await prisma.verificationToken.delete({
    where: { id: verification.id },
  });
  
  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'age_verification_completed',
      metadata: { method },
    },
  });
  
  return true;
}

/**
 * Verify ID document (placeholder for actual ID verification service)
 */
export async function verifyIdDocument(
  documentImage: Buffer,
  dateOfBirth: Date
): Promise<{
  isValid: boolean;
  confidence: number;
  error?: string;
}> {
  // In production, integrate with services like:
  // - Onfido
  // - Jumio
  // - Veriff
  // - Persona
  
  // This is a placeholder implementation
  const age = calculateAge(dateOfBirth);
  
  if (age < MIN_AGE) {
    return {
      isValid: false,
      confidence: 0,
      error: 'Age requirement not met',
    };
  }
  
  // Simulate verification process
  return {
    isValid: true,
    confidence: 0.95,
  };
}

/**
 * Verify credit card age (credit cards require 18+ in most regions)
 */
export async function verifyCreditCard(
  cardToken: string
): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // In production, integrate with payment processors:
  // - Stripe
  // - PayPal
  // Most require users to be 18+ to have a credit card
  
  // This is a placeholder implementation
  return {
    isValid: true,
  };
}

/**
 * Third-party age verification
 */
export async function verifyWithThirdParty(
  userId: string,
  provider: string
): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // In production, integrate with:
  // - AgeChecked
  // - Yoti
  // - Clear
  
  // This is a placeholder implementation
  return {
    isValid: true,
  };
}

/**
 * Check if user needs age re-verification (e.g., every year for users under 21)
 */
export async function needsReVerification(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dateOfBirth: true,
      ageVerifiedAt: true,
      ageVerified: true,
    },
  });
  
  if (!user || !user.ageVerified || !user.ageVerifiedAt) {
    return true;
  }
  
  const age = calculateAge(user.dateOfBirth);
  
  // Re-verify annually for users under 21
  if (age < 21) {
    const daysSinceVerification = Math.floor(
      (Date.now() - user.ageVerifiedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceVerification > 365;
  }
  
  return false;
}
