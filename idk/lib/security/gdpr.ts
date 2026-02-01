import { prisma } from '../auth/prisma';
import { createAuditLog } from './audit';

const DATA_EXPORT_EXPIRY_DAYS = parseInt(process.env.DATA_EXPORT_EXPIRY_DAYS || '7');
const DATA_DELETION_GRACE_PERIOD = parseInt(process.env.DATA_DELETION_GRACE_PERIOD_DAYS || '30');

/**
 * Request data export (GDPR Article 15 - Right of Access)
 */
export async function requestDataExport(userId: string): Promise<string> {
  // Check if there's already a pending request
  const existingRequest = await prisma.dataExportRequest.findFirst({
    where: {
      userId,
      status: {
        in: ['pending', 'processing'],
      },
    },
  });
  
  if (existingRequest) {
    throw new Error('A data export request is already in progress');
  }
  
  // Create export request
  const request = await prisma.dataExportRequest.create({
    data: {
      userId,
      status: 'pending',
      expiresAt: new Date(Date.now() + DATA_EXPORT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  
  // Create audit log
  await createAuditLog({
    userId,
    action: 'data_export_requested',
  });
  
  // In production, trigger background job to generate export
  // For now, we'll process it immediately
  await processDataExport(request.id);
  
  return request.id;
}

/**
 * Process data export
 */
async function processDataExport(requestId: string): Promise<void> {
  const request = await prisma.dataExportRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });
  
  if (!request) {
    throw new Error('Export request not found');
  }
  
  // Update status
  await prisma.dataExportRequest.update({
    where: { id: requestId },
    data: { status: 'processing' },
  });
  
  try {
    const userId = request.userId;
    
    // Collect all user data
    const userData = await collectUserData(userId);
    
    // In production, upload to secure storage (S3, etc.)
    // and generate a download link
    const fileUrl = await uploadDataExport(userData, userId);
    
    // Update request
    await prisma.dataExportRequest.update({
      where: { id: requestId },
      data: {
        status: 'completed',
        fileUrl,
        completedAt: new Date(),
      },
    });
    
    // Send email notification
    // await sendDataExportEmail(request.user.email, fileUrl);
    
  } catch (error) {
    await prisma.dataExportRequest.update({
      where: { id: requestId },
      data: { status: 'failed' },
    });
    throw error;
  }
}

/**
 * Collect all user data for export
 */
async function collectUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      photos: true,
      interests: true,
      sentMatches: {
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      receivedMatches: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      sentMessages: {
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      receivedMessages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      reportsSubmitted: true,
      reportsReceived: true,
      auditLogs: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Remove sensitive fields
  const { hashedPassword, twoFactorSecret, ...userData } = user;
  
  return {
    exportDate: new Date().toISOString(),
    userData,
    disclaimer: 'This export contains all personal data we hold about you as required by GDPR Article 15.',
  };
}

/**
 * Upload data export (placeholder)
 */
async function uploadDataExport(data: any, userId: string): Promise<string> {
  // In production, use Cloudinary, S3, or similar
  // For now, return a placeholder URL
  return `https://storage.example.com/exports/${userId}_${Date.now()}.json`;
}

/**
 * Request account deletion (GDPR Article 17 - Right to Erasure)
 */
export async function requestDataDeletion(userId: string, reason?: string): Promise<string> {
  // Check if there's already a pending request
  const existingRequest = await prisma.dataDeletionRequest.findFirst({
    where: {
      userId,
      status: {
        in: ['pending', 'processing'],
      },
    },
  });
  
  if (existingRequest) {
    throw new Error('A data deletion request is already in progress');
  }
  
  // Create deletion request with grace period
  const scheduledFor = new Date(Date.now() + DATA_DELETION_GRACE_PERIOD * 24 * 60 * 60 * 1000);
  
  const request = await prisma.dataDeletionRequest.create({
    data: {
      userId,
      status: 'pending',
      scheduledFor,
    },
  });
  
  // Deactivate account immediately
  await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
    },
  });
  
  // Create audit log
  await createAuditLog({
    userId,
    action: 'data_deletion_requested',
    metadata: { reason, scheduledFor },
  });
  
  // Send confirmation email
  // await sendDeletionRequestEmail(user.email, scheduledFor);
  
  return request.id;
}

/**
 * Cancel data deletion request (during grace period)
 */
export async function cancelDataDeletion(userId: string): Promise<void> {
  const request = await prisma.dataDeletionRequest.findFirst({
    where: {
      userId,
      status: 'pending',
      scheduledFor: {
        gte: new Date(),
      },
    },
  });
  
  if (!request) {
    throw new Error('No active deletion request found');
  }
  
  // Delete the request
  await prisma.dataDeletionRequest.delete({
    where: { id: request.id },
  });
  
  // Reactivate account
  await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: true,
    },
  });
  
  await createAuditLog({
    userId,
    action: 'data_deletion_cancelled',
  });
}

/**
 * Process scheduled deletions (run via cron job)
 */
export async function processScheduledDeletions(): Promise<void> {
  const requests = await prisma.dataDeletionRequest.findMany({
    where: {
      status: 'pending',
      scheduledFor: {
        lte: new Date(),
      },
    },
  });
  
  for (const request of requests) {
    try {
      await deleteUserData(request.userId);
      
      await prisma.dataDeletionRequest.update({
        where: { id: request.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to delete user data: ${request.userId}`, error);
    }
  }
}

/**
 * Delete all user data (GDPR compliant)
 */
async function deleteUserData(userId: string): Promise<void> {
  // This should be wrapped in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete in order to respect foreign key constraints
    await tx.photo.deleteMany({ where: { userId } });
    await tx.match.deleteMany({ 
      where: { 
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });
    await tx.message.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });
    await tx.report.deleteMany({
      where: {
        OR: [
          { reporterId: userId },
          { reportedId: userId },
        ],
      },
    });
    await tx.block.deleteMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
    });
    await tx.moderationAction.deleteMany({ where: { userId } });
    await tx.dataExportRequest.deleteMany({ where: { userId } });
    await tx.dataDeletionRequest.deleteMany({ where: { userId } });
    
    // Keep audit logs for legal compliance (anonymized)
    await tx.auditLog.updateMany({
      where: { userId },
      data: {
        userId: null,
        metadata: {
          deletedUser: true,
        },
      },
    });
    
    // Finally, delete the user
    await tx.user.delete({ where: { id: userId } });
  });
}

/**
 * Update consent preferences (GDPR Article 7)
 */
export async function updateConsent(
  userId: string,
  consents: {
    dataProcessing?: boolean;
    marketing?: boolean;
  }
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      dataProcessingConsent: consents.dataProcessing,
      marketingConsent: consents.marketing,
    },
  });
  
  await createAuditLog({
    userId,
    action: 'consent_updated',
    metadata: consents,
  });
}

/**
 * Get user's current consent status
 */
export async function getConsentStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dataProcessingConsent: true,
      marketingConsent: true,
      termsAccepted: true,
      termsAcceptedAt: true,
      privacyPolicyAccepted: true,
      privacyPolicyAcceptedAt: true,
    },
  });
  
  return user;
}

/**
 * Data portability (GDPR Article 20)
 */
export async function exportDataInMachineReadableFormat(userId: string): Promise<any> {
  const data = await collectUserData(userId);
  
  // Return as JSON (machine-readable format)
  return {
    format: 'JSON',
    version: '1.0',
    data,
  };
}

/**
 * Anonymize user data (for analytics/research)
 */
export async function anonymizeUserData(userId: string): Promise<void> {
  const anonymousId = `anon_${Date.now()}`;
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      email: `${anonymousId}@anonymized.local`,
      name: 'Anonymous User',
      bio: '[Anonymized]',
      location: '[Anonymized]',
      lastLoginIp: null,
    },
  });
  
  await createAuditLog({
    userId,
    action: 'user_data_anonymized',
  });
}
