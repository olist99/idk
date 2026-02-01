import { prisma } from '../auth/prisma';
import { anonymizeIp } from './encryption';

interface AuditLogData {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        ipAddress: data.ipAddress ? anonymizeIp(data.ipAddress) : null,
        userAgent: data.userAgent,
        metadata: data.metadata || {},
      },
    });
  } catch (error) {
    // Don't throw errors for audit logging failures
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const where: any = { userId };
  
  if (options?.action) {
    where.action = options.action;
  }
  
  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) {
      where.createdAt.gte = options.startDate;
    }
    if (options.endDate) {
      where.createdAt.lte = options.endDate;
    }
  }
  
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    take: options?.limit || 100,
    skip: options?.offset || 0,
  });
  
  return logs;
}

/**
 * Search audit logs (for admin/compliance)
 */
export async function searchAuditLogs(
  filters: {
    userId?: string;
    action?: string;
    ipAddress?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
) {
  const where: any = {};
  
  if (filters.userId) {
    where.userId = filters.userId;
  }
  
  if (filters.action) {
    where.action = filters.action;
  }
  
  if (filters.ipAddress) {
    where.ipAddress = anonymizeIp(filters.ipAddress);
  }
  
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }
  
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    take: filters.limit || 1000,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
  
  return logs;
}

/**
 * Get security events for monitoring
 */
export async function getSecurityEvents(timeWindow: number = 24) {
  const startTime = new Date(Date.now() - timeWindow * 60 * 60 * 1000);
  
  const events = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          'login_failed',
          'account_locked',
          'suspicious_activity_detected',
          'password_reset_requested',
          'email_changed',
          'two_factor_disabled',
        ],
      },
      createdAt: {
        gte: startTime,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return events;
}

/**
 * Detect anomalous behavior
 */
export async function detectAnomalies(userId: string): Promise<{
  hasAnomalies: boolean;
  anomalies: string[];
}> {
  const anomalies: string[] = [];
  
  // Check login from multiple locations in short time
  const recentLogins = await prisma.auditLog.findMany({
    where: {
      userId,
      action: 'login',
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
    select: {
      ipAddress: true,
    },
  });
  
  const uniqueIps = new Set(recentLogins.map(log => log.ipAddress));
  if (uniqueIps.size > 3) {
    anomalies.push('Multiple login locations detected');
  }
  
  // Check for rapid actions
  const recentActions = await prisma.auditLog.count({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    },
  });
  
  if (recentActions > 50) {
    anomalies.push('Unusually high activity rate');
  }
  
  return {
    hasAnomalies: anomalies.length > 0,
    anomalies,
  };
}

/**
 * Clean old audit logs (data retention policy)
 */
export async function cleanOldAuditLogs(retentionDays: number = 365): Promise<number> {
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  
  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
      // Keep security-critical logs longer
      action: {
        notIn: [
          'data_deletion_requested',
          'account_banned',
          'terms_accepted',
          'age_verification_completed',
        ],
      },
    },
  });
  
  return result.count;
}

/**
 * Generate compliance report
 */
export async function generateComplianceReport(startDate: Date, endDate: Date) {
  const report = {
    period: {
      start: startDate,
      end: endDate,
    },
    statistics: {
      newUsers: 0,
      dataExportRequests: 0,
      dataDeletionRequests: 0,
      reportsFiled: 0,
      contentModerated: 0,
      accountsBanned: 0,
    },
    securityEvents: {
      failedLogins: 0,
      suspiciousActivity: 0,
      accountLocks: 0,
    },
  };
  
  // New users
  report.statistics.newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Data export requests
  report.statistics.dataExportRequests = await prisma.dataExportRequest.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Data deletion requests
  report.statistics.dataDeletionRequests = await prisma.dataDeletionRequest.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Reports filed
  report.statistics.reportsFiled = await prisma.report.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Content moderated
  report.statistics.contentModerated = await prisma.photo.count({
    where: {
      moderatedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Accounts banned
  report.statistics.accountsBanned = await prisma.user.count({
    where: {
      isBanned: true,
      bannedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Failed logins
  report.securityEvents.failedLogins = await prisma.auditLog.count({
    where: {
      action: 'login_failed',
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Suspicious activity
  report.securityEvents.suspiciousActivity = await prisma.auditLog.count({
    where: {
      action: 'suspicious_activity_detected',
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  // Account locks
  report.securityEvents.accountLocks = await prisma.auditLog.count({
    where: {
      action: 'account_locked',
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  
  return report;
}
