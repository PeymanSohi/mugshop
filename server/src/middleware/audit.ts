import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';

interface AuditLog {
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  statusCode?: number;
  details?: any;
}

const auditLogs: AuditLog[] = [];

export const auditLogger = (action: string, resource: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Override res.json to capture response
    const originalJson = res.json;
    res.json = function(body: any) {
      const duration = Date.now() - startTime;
      
      const auditLog: AuditLog = {
        timestamp: new Date(),
        userId: req.user?.id,
        userEmail: req.user?.email,
        action,
        resource,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        statusCode: res.statusCode,
        details: {
          duration,
          bodySize: JSON.stringify(body).length,
          query: req.query,
          params: req.params
        }
      };
      
      auditLogs.push(auditLog);
      
      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('AUDIT:', JSON.stringify(auditLog, null, 2));
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};

export const getAuditLogs = (req: Request, res: Response) => {
  const { page = 1, limit = 50, userId, action, resource } = req.query;
  
  let filteredLogs = auditLogs;
  
  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === userId);
  }
  
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action.includes(action as string));
  }
  
  if (resource) {
    filteredLogs = filteredLogs.filter(log => log.resource.includes(resource as string));
  }
  
  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
  
  res.json({
    logs: paginatedLogs,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(filteredLogs.length / Number(limit)),
      totalItems: filteredLogs.length,
      itemsPerPage: Number(limit)
    }
  });
};

export const clearAuditLogs = (req: Request, res: Response) => {
  auditLogs.length = 0;
  res.json({ message: 'لاگ‌های حسابرسی پاک شدند' });
};
