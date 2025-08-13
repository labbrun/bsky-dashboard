// Agent Manager - Orchestrates and manages both Clean Code and Security agents
// Provides unified interface for running agent analyses

import CleanCodeAgent from './CleanCodeAgent';
import SecurityAgent from './SecurityAgent';
import logger from '../services/loggingService';

export class AgentManager {
  constructor() {
    this.cleanCodeAgent = new CleanCodeAgent();
    this.securityAgent = new SecurityAgent();
    this.agents = {
      cleanCode: this.cleanCodeAgent,
      security: this.securityAgent
    };
    
    this.lastAnalysis = null;
    this.analysisHistory = [];
  }

  // Run all agents in sequence
  async runAllAgents() {
    logger.info('Agent Manager starting comprehensive analysis');
    
    const startTime = Date.now();
    const analysis = {
      timestamp: new Date().toISOString(),
      agents: {},
      summary: {},
      recommendations: [],
      overallScore: 0
    };

    try {
      // Run Clean Code Agent
      logger.info('Running Clean Code Agent');
      const cleanCodeResults = await this.cleanCodeAgent.execute();
      analysis.agents.cleanCode = cleanCodeResults;

      // Run Security Agent
      logger.info('Running Security Agent');
      const securityResults = await this.securityAgent.execute();
      analysis.agents.security = securityResults;

      // Generate combined analysis
      analysis.summary = this.generateCombinedSummary(cleanCodeResults, securityResults);
      analysis.recommendations = this.generateCombinedRecommendations(cleanCodeResults, securityResults);
      analysis.overallScore = this.calculateOverallScore(cleanCodeResults, securityResults);
      
      const duration = Date.now() - startTime;
      analysis.executionTime = duration;
      
      // Store analysis
      this.lastAnalysis = analysis;
      this.analysisHistory.push(analysis);
      
      // Keep only last 10 analyses
      if (this.analysisHistory.length > 10) {
        this.analysisHistory.shift();
      }

      logger.info('Agent Manager analysis completed', { 
        duration, 
        overallScore: analysis.overallScore,
        totalIssues: analysis.summary.totalIssues
      });

      return {
        success: true,
        analysis,
        executionTime: duration
      };

    } catch (error) {
      logger.error('Agent Manager analysis failed', { error: error.message, stack: error.stack });
      
      return {
        success: false,
        error: error.message,
        partialResults: analysis.agents
      };
    }
  }

  // Run individual agent
  async runAgent(agentName) {
    if (!this.agents[agentName]) {
      throw new Error(`Agent "${agentName}" not found`);
    }

    logger.info(`Running ${agentName} agent`);
    
    try {
      const result = await this.agents[agentName].execute();
      logger.info(`${agentName} agent completed successfully`);
      return result;
    } catch (error) {
      logger.error(`${agentName} agent failed`, { error: error.message });
      throw error;
    }
  }

  // Generate combined summary from both agents
  generateCombinedSummary(cleanCodeResults, securityResults) {
    const cleanCodeSummary = cleanCodeResults.success ? cleanCodeResults.summary : {};
    const securitySummary = securityResults.success ? securityResults.summary : {};

    return {
      codeQuality: {
        score: cleanCodeSummary.qualityScore || 0,
        issues: cleanCodeSummary.totalIssues || 0,
        criticalIssues: cleanCodeSummary.criticalIssues || 0,
        status: this.getQualityStatus(cleanCodeSummary.qualityScore || 0)
      },
      security: {
        score: securitySummary.securityScore || 0,
        issues: securitySummary.totalIssues || 0,
        criticalIssues: securitySummary.criticalIssues || 0,
        status: securitySummary.status || 'Unknown'
      },
      totalIssues: (cleanCodeSummary.totalIssues || 0) + (securitySummary.totalIssues || 0),
      totalCriticalIssues: (cleanCodeSummary.criticalIssues || 0) + (securitySummary.criticalIssues || 0),
      overallHealth: this.calculateOverallHealth(cleanCodeSummary, securitySummary)
    };
  }

  // Generate combined recommendations
  generateCombinedRecommendations(cleanCodeResults, securityResults) {
    const recommendations = [];

    // Add clean code recommendations
    if (cleanCodeResults.success && cleanCodeResults.summary) {
      const cleanRecommendations = cleanCodeResults.summary.recommendations || 0;
      if (cleanRecommendations > 0) {
        recommendations.push({
          category: 'Code Quality',
          priority: 'medium',
          title: 'Address code quality issues',
          description: `${cleanRecommendations} code quality improvements recommended`,
          agent: 'cleanCode'
        });
      }
    }

    // Add security recommendations
    if (securityResults.success && securityResults.recommendations) {
      securityResults.recommendations.forEach(rec => {
        recommendations.push({
          ...rec,
          agent: 'security'
        });
      });
    }

    // Add combined recommendations
    recommendations.push({
      category: 'Integration',
      priority: 'low',
      title: 'Set up automated agent monitoring',
      description: 'Implement regular automated code and security analysis',
      agent: 'manager'
    });

    // Sort by priority
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    return recommendations.sort((a, b) => 
      (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
    );
  }

  // Calculate overall score from both agents
  calculateOverallScore(cleanCodeResults, securityResults) {
    const cleanCodeScore = cleanCodeResults.success ? (cleanCodeResults.summary?.qualityScore || 0) : 0;
    const securityScore = securityResults.success ? (securityResults.summary?.securityScore || 0) : 0;

    // Weight security slightly higher than code quality
    const weightedScore = (cleanCodeScore * 0.4) + (securityScore * 0.6);
    
    return Math.round(weightedScore);
  }

  // Calculate overall health status
  calculateOverallHealth(cleanCodeSummary, securitySummary) {
    const cleanScore = cleanCodeSummary.qualityScore || 0;
    const securityScore = securitySummary.securityScore || 0;
    const criticalIssues = (cleanCodeSummary.criticalIssues || 0) + (securitySummary.criticalIssues || 0);

    if (criticalIssues > 0) return 'Critical - Immediate attention required';
    if (cleanScore < 60 || securityScore < 60) return 'Poor - Significant improvements needed';
    if (cleanScore < 80 || securityScore < 80) return 'Fair - Some improvements recommended';
    if (cleanScore < 90 || securityScore < 90) return 'Good - Minor improvements possible';
    return 'Excellent - Well maintained codebase';
  }

  // Get quality status from score
  getQualityStatus(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  }

  // Get latest analysis results
  getLatestAnalysis() {
    return this.lastAnalysis;
  }

  // Get analysis history
  getAnalysisHistory() {
    return [...this.analysisHistory];
  }

  // Get agent status
  getAgentStatus() {
    return {
      cleanCodeAgent: {
        name: this.cleanCodeAgent.name,
        version: this.cleanCodeAgent.version,
        lastRun: this.cleanCodeAgent.lastScanTime
      },
      securityAgent: {
        name: this.securityAgent.name,
        version: this.securityAgent.version,
        lastRun: this.securityAgent.lastScanTime
      },
      manager: {
        lastAnalysis: this.lastAnalysis?.timestamp,
        totalAnalyses: this.analysisHistory.length
      }
    };
  }

  // Schedule regular analysis (placeholder for future implementation)
  scheduleRegularAnalysis(intervalHours = 24) {
    logger.info(`Scheduling regular analysis every ${intervalHours} hours`);
    
    // In a real implementation, this would set up a recurring job
    // For now, just log the intention
    return {
      scheduled: true,
      interval: intervalHours,
      nextRun: new Date(Date.now() + (intervalHours * 60 * 60 * 1000)).toISOString()
    };
  }

  // Generate agent dashboard data
  generateDashboardData() {
    const latest = this.getLatestAnalysis();
    if (!latest) {
      return {
        hasData: false,
        message: 'No analysis data available. Run agents first.'
      };
    }

    const summary = latest.summary;
    
    return {
      hasData: true,
      lastAnalysis: latest.timestamp,
      overallScore: latest.overallScore,
      overallHealth: summary.overallHealth,
      metrics: {
        codeQuality: {
          score: summary.codeQuality.score,
          status: summary.codeQuality.status,
          issues: summary.codeQuality.issues,
          criticalIssues: summary.codeQuality.criticalIssues
        },
        security: {
          score: summary.security.score,
          status: summary.security.status,
          issues: summary.security.issues,
          criticalIssues: summary.security.criticalIssues
        }
      },
      topRecommendations: latest.recommendations.slice(0, 5),
      trends: this.calculateTrends()
    };
  }

  // Calculate trends from analysis history
  calculateTrends() {
    if (this.analysisHistory.length < 2) {
      return {
        codeQuality: 'stable',
        security: 'stable',
        overall: 'stable'
      };
    }

    const recent = this.analysisHistory.slice(-2);
    const [previous, current] = recent;

    const codeQualityTrend = this.getTrend(
      previous.summary?.codeQuality?.score || 0,
      current.summary?.codeQuality?.score || 0
    );

    const securityTrend = this.getTrend(
      previous.summary?.security?.score || 0,
      current.summary?.security?.score || 0
    );

    const overallTrend = this.getTrend(
      previous.overallScore || 0,
      current.overallScore || 0
    );

    return {
      codeQuality: codeQualityTrend,
      security: securityTrend,
      overall: overallTrend
    };
  }

  // Get trend direction
  getTrend(previous, current) {
    const difference = current - previous;
    if (Math.abs(difference) < 2) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }
}

// Create singleton instance
const agentManager = new AgentManager();

export default agentManager;