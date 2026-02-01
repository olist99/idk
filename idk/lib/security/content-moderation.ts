import { prisma } from '../auth/prisma';
import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs-node';

/**
 * Moderate image content using AI
 */
export async function moderateImage(imageBuffer: Buffer): Promise<{
  isApproved: boolean;
  scores: {
    nsfw: number;
    violence: number;
    hate: number;
  };
  reason?: string;
}> {
  try {
    // Load NSFW.js model
    const model = await nsfwjs.load();
    
    // Convert buffer to tensor
    const image = await tf.node.decodeImage(imageBuffer, 3);
    
    // Get predictions
    const predictions = await model.classify(image);
    
    // Calculate scores
    const nsfwScore = predictions.reduce((max, pred) => {
      if (['Porn', 'Hentai', 'Sexy'].includes(pred.className)) {
        return Math.max(max, pred.probability);
      }
      return max;
    }, 0);
    
    // Thresholds
    const NSFW_THRESHOLD = 0.6;
    const VIOLENCE_THRESHOLD = 0.7;
    const HATE_THRESHOLD = 0.5;
    
    // Determine approval
    const isApproved = nsfwScore < NSFW_THRESHOLD;
    
    const result = {
      isApproved,
      scores: {
        nsfw: nsfwScore,
        violence: 0, // Would integrate violence detection model
        hate: 0, // Would integrate hate symbol detection
      },
    };
    
    if (!isApproved) {
      return {
        ...result,
        reason: 'Image contains inappropriate content',
      };
    }
    
    return result;
  } catch (error) {
    console.error('Image moderation error:', error);
    // Fail safe: reject if moderation fails
    return {
      isApproved: false,
      scores: { nsfw: 1, violence: 0, hate: 0 },
      reason: 'Unable to verify image content',
    };
  }
}

/**
 * Moderate text content
 */
export function moderateText(text: string): {
  isApproved: boolean;
  flags: string[];
  reason?: string;
} {
  const flags: string[] = [];
  
  // Check for profanity
  const profanityPatterns = [
    /\b(fuck|shit|bitch|ass|damn|cunt|cock)\b/gi,
    // Add more patterns as needed
  ];
  
  for (const pattern of profanityPatterns) {
    if (pattern.test(text)) {
      flags.push('profanity');
      break;
    }
  }
  
  // Check for hate speech indicators
  const hatePatterns = [
    /\b(nigger|faggot|retard|kike)\b/gi,
    // Add more patterns as needed
  ];
  
  for (const pattern of hatePatterns) {
    if (pattern.test(text)) {
      flags.push('hate_speech');
      break;
    }
  }
  
  // Check for phone numbers (potential contact info sharing)
  if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
    flags.push('contact_info');
  }
  
  // Check for email addresses
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    flags.push('contact_info');
  }
  
  // Check for URLs (spam prevention)
  if (/https?:\/\/[^\s]+/.test(text)) {
    flags.push('url');
  }
  
  // Check for spam patterns
  const spamPatterns = [
    /\b(buy|purchase|click here|limited time|act now)\b/gi,
    /\b(viagra|cialis|pharmacy|pills)\b/gi,
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      flags.push('spam');
      break;
    }
  }
  
  const isApproved = !flags.includes('hate_speech') && 
                     !flags.includes('spam');
  
  return {
    isApproved,
    flags,
    reason: !isApproved ? `Content flagged: ${flags.join(', ')}` : undefined,
  };
}

/**
 * Moderate user profile
 */
export async function moderateProfile(userId: string): Promise<{
  isApproved: boolean;
  issues: string[];
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      photos: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const issues: string[] = [];
  
  // Check bio
  const bioModeration = moderateText(user.bio);
  if (!bioModeration.isApproved) {
    issues.push(`Bio: ${bioModeration.reason}`);
  }
  
  // Check name
  const nameModeration = moderateText(user.name);
  if (!nameModeration.isApproved) {
    issues.push(`Name: ${nameModeration.reason}`);
  }
  
  // Check photos
  for (const photo of user.photos) {
    if (photo.moderationStatus === 'rejected') {
      issues.push(`Photo rejected: ${photo.rejectionReason}`);
    }
  }
  
  return {
    isApproved: issues.length === 0,
    issues,
  };
}

/**
 * Auto-moderate message
 */
export async function moderateMessage(
  senderId: string,
  receiverId: string,
  content: string
): Promise<{
  isApproved: boolean;
  shouldFlag: boolean;
  shouldBlock: boolean;
  reason?: string;
}> {
  const moderation = moderateText(content);
  
  // Check if users have history of violations
  const senderReports = await prisma.report.count({
    where: {
      reportedId: senderId,
      status: 'resolved',
    },
  });
  
  const shouldBlock = moderation.flags.includes('hate_speech') || 
                      (senderReports > 3 && moderation.flags.length > 0);
  
  const shouldFlag = moderation.flags.length > 0 && !shouldBlock;
  
  return {
    isApproved: moderation.isApproved,
    shouldFlag,
    shouldBlock,
    reason: moderation.reason,
  };
}

/**
 * Review flagged content (for human moderators)
 */
export async function reviewFlaggedContent(
  contentId: string,
  contentType: 'photo' | 'message' | 'profile',
  decision: 'approve' | 'reject',
  moderatorId: string,
  reason?: string
): Promise<void> {
  if (contentType === 'photo') {
    await prisma.photo.update({
      where: { id: contentId },
      data: {
        moderationStatus: decision === 'approve' ? 'approved' : 'rejected',
        moderatedAt: new Date(),
        moderatedBy: moderatorId,
        rejectionReason: decision === 'reject' ? reason : null,
      },
    });
    
    if (decision === 'reject') {
      // Notify user
      const photo = await prisma.photo.findUnique({
        where: { id: contentId },
        include: { user: true },
      });
      
      if (photo) {
        await prisma.moderationAction.create({
          data: {
            userId: photo.userId,
            action: 'content_removal',
            reason: reason || 'Inappropriate content',
            performedBy: moderatorId,
          },
        });
      }
    }
  }
  
  // Create audit log
  await prisma.auditLog.create({
    data: {
      action: `content_moderation_${decision}`,
      metadata: {
        contentId,
        contentType,
        moderatorId,
        reason,
      },
    },
  });
}

/**
 * Get content that needs moderation
 */
export async function getContentForModeration(limit: number = 50) {
  const photos = await prisma.photo.findMany({
    where: {
      moderationStatus: 'pending',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: limit,
  });
  
  return photos;
}

/**
 * Automated flagging system
 */
export async function autoFlagSuspiciousActivity(userId: string): Promise<void> {
  // Check for rapid messaging (potential spam)
  const recentMessages = await prisma.message.count({
    where: {
      senderId: userId,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });
  
  if (recentMessages > 50) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'suspicious_activity_detected',
        metadata: {
          type: 'rapid_messaging',
          count: recentMessages,
        },
      },
    });
  }
  
  // Check for rapid profile updates
  const recentUpdates = await prisma.auditLog.count({
    where: {
      userId,
      action: 'profile_update',
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000),
      },
    },
  });
  
  if (recentUpdates > 10) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'suspicious_activity_detected',
        metadata: {
          type: 'rapid_profile_updates',
          count: recentUpdates,
        },
      },
    });
  }
}
