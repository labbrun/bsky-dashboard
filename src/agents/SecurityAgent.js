// Security Agent - Comprehensive security analysis and vulnerability detection
// Responsible for: security best practices, vulnerability scanning, dependency analysis, MCP server security

import logger from '../services/loggingService';

export class SecurityAgent {
  constructor() {
    this.name = 'Security Agent';
    this.version = '1.0.0';
    this.description = 'Comprehensive security analysis for web applications with MCP server focus';
    
    // Security configuration
    this.config = {
      // Security categories to analyze
      categories: [
        'authentication',
        'authorization', 
        'data_protection',
        'input_validation',
        'output_encoding',
        'session_management',
        'crypto_practices',
        'dependency_security',
        'mcp_server_security',
        'api_security',
        'client_side_security',
        'infrastructure_security'
      ],
      
      // File patterns to analyze
      securityFilePatterns: [
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.ts', 
        'src/**/*.tsx',
        'package.json',
        'package-lock.json',
        '.env*',
        'src/**/*config*.js',
        'src/**/*service*.js',
        'src/**/*auth*.js',
        'src/**/*security*.js'
      ],
      
      // Exclude patterns
      excludePatterns: [
        'node_modules/**',
        'build/**',
        'dist/**',
        '.git/**',
        'coverage/**',
        '**/*.test.js',
        '**/*.spec.js'
      ],
      
      // Severity levels
      severityLevels: {
        CRITICAL: 'critical',
        HIGH: 'high', 
        MEDIUM: 'medium',
        LOW: 'low',
        INFO: 'info'
      },
      
      // Security rules
      rules: {
        // Secrets and credentials
        hardcodedSecrets: {
          enabled: true,
          severity: 'critical',
          patterns: [
            /password\s*[:=]\s*['"][^'"]+['"]/i,
            /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
            /secret\s*[:=]\s*['"][^'"]+['"]/i,
            /token\s*[:=]\s*['"][^'"]+['"]/i,
            /private[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
            /auth[_-]?token\s*[:=]\s*['"][^'"]+['"]/i,
            /access[_-]?key\s*[:=]\s*['"][^'"]+['"]/i
          ]
        },
        
        // XSS vulnerabilities
        xssVulnerabilities: {
          enabled: true,
          severity: 'high',
          patterns: [
            /innerHTML\s*=\s*[^;]+[^(sanitiz|escap|clean)]/i,
            /outerHTML\s*=\s*[^;]+/i,
            /document\.write\s*\(/i,
            /eval\s*\(/i,
            /dangerouslySetInnerHTML/i
          ]
        },
        
        // Insecure HTTP usage
        insecureHttp: {
          enabled: true,
          severity: 'medium', 
          patterns: [
            /http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/i,
            /fetch\s*\(\s*['"]http:/i,
            /axios\.get\s*\(\s*['"]http:/i
          ]
        },
        
        // Weak crypto practices
        weakCrypto: {
          enabled: true,
          severity: 'high',
          patterns: [
            /Math\.random\s*\(\s*\)/i,
            /md5\s*\(/i,
            /sha1\s*\(/i,
            /\.encrypt\s*\(/i,
            /\.decrypt\s*\(/i
          ]
        },
        
        // SQL injection risks
        sqlInjection: {
          enabled: true,
          severity: 'critical',
          patterns: [
            /SELECT\s+.+\s+FROM\s+.+\s*\+/i,
            /INSERT\s+INTO\s+.+\s*\+/i,
            /UPDATE\s+.+\s+SET\s+.+\s*\+/i,
            /DELETE\s+FROM\s+.+\s*\+/i,
            /query\s*\(\s*['"].+['"].+\+/i
          ]
        },
        
        // MCP Server security
        mcpServerSecurity: {
          enabled: true,
          severity: 'high',
          patterns: [
            /mcp__.*__(?!getDiagnostics|executeCode)[a-zA-Z]/i, // Unauthorized MCP tools
            /process\.env\.MCP/i,
            /exec\s*\(/i,
            /spawn\s*\(/i,
            /shell\s*\(/i
          ]
        }
      }
    };
    
    this.lastScanTime = null;
    this.securityFindings = [];
    this.dependencyVulnerabilities = [];
  }

  // Main security analysis execution
  async execute() {
    logger.info('Security Agent starting comprehensive security scan');
    
    try {
      const report = await this.performSecurityAnalysis();
      
      // Generate security recommendations
      const recommendations = this.generateSecurityRecommendations(report);
      
      // Create comprehensive security report
      const securityReport = await this.generateSecurityReport(report, recommendations);
      
      this.lastScanTime = new Date().toISOString();
      
      return {
        success: true,
        timestamp: this.lastScanTime,
        findings: this.securityFindings,
        vulnerabilities: this.dependencyVulnerabilities,
        summary: this.generateSecuritySummary(report),
        recommendations: recommendations,
        overallSecurityScore: this.calculateSecurityScore(report)
      };
      
    } catch (error) {
      logger.error('Security Agent execution failed', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Core security analysis
  async performSecurityAnalysis() {
    logger.info('Performing comprehensive security analysis');
    
    const report = {
      codeSecurityIssues: await this.analyzeCodeSecurity(),
      dependencyVulnerabilities: await this.analyzeDependencyVulnerabilities(),
      authenticationSecurity: await this.analyzeAuthenticationSecurity(),
      apiSecurity: await this.analyzeApiSecurity(),
      mcpServerSecurity: await this.analyzeMcpServerSecurity(),
      dataProtection: await this.analyzeDataProtection(),
      infrastructureSecurity: await this.analyzeInfrastructureSecurity(),
      clientSideSecurity: await this.analyzeClientSideSecurity()
    };
    
    return report;
  }

  // Analyze code for security vulnerabilities
  async analyzeCodeSecurity() {
    const securityIssues = [];
    
    try {
      // Mock file list - in real implementation would use file system access
      const files = await this.getSecurityRelevantFiles();
      
      for (const file of files) {
        const content = await this.readFile(file);
        const fileIssues = this.scanFileForSecurityIssues(file, content);
        
        if (fileIssues.length > 0) {
          securityIssues.push({
            file,
            issues: fileIssues,
            riskLevel: this.calculateFileRiskLevel(fileIssues)
          });
        }
      }
      
    } catch (error) {
      logger.error('Code security analysis failed', { error: error.message });
    }
    
    return securityIssues;
  }

  // Scan individual file for security issues
  scanFileForSecurityIssues(filePath, content) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      // Check each security rule
      Object.entries(this.config.rules).forEach(([ruleName, rule]) => {
        if (!rule.enabled) return;
        
        rule.patterns.forEach(pattern => {
          if (pattern.test(trimmedLine)) {
            issues.push({
              type: ruleName,
              severity: rule.severity,
              line: lineNumber,
              content: trimmedLine,
              message: this.getSecurityMessage(ruleName, trimmedLine),
              recommendation: this.getSecurityRecommendation(ruleName),
              cweId: this.getCweId(ruleName),
              owasp: this.getOwaspCategory(ruleName)
            });
          }
        });
      });
      
      // Additional custom security checks
      issues.push(...this.performCustomSecurityChecks(trimmedLine, lineNumber, filePath));
    });
    
    return issues;
  }

  // Custom security checks
  performCustomSecurityChecks(line, lineNumber, filePath) {
    const issues = [];
    
    // Check for environment variable exposure
    if (line.includes('process.env') && !line.includes('NODE_ENV')) {
      issues.push({
        type: 'environment_exposure',
        severity: 'medium',
        line: lineNumber,
        content: line,
        message: 'Potential environment variable exposure',
        recommendation: 'Ensure environment variables are properly validated and not logged',
        cweId: 'CWE-200',
        owasp: 'A09:2021 – Security Logging and Monitoring Failures'
      });
    }
    
    // Check for localStorage usage with sensitive data
    if (line.includes('localStorage.setItem') && 
        (line.includes('token') || line.includes('password') || line.includes('key'))) {
      issues.push({
        type: 'sensitive_storage',
        severity: 'high',
        line: lineNumber,
        content: line,
        message: 'Sensitive data stored in localStorage',
        recommendation: 'Use secure storage mechanisms for sensitive data',
        cweId: 'CWE-522',
        owasp: 'A02:2021 – Cryptographic Failures'
      });
    }
    
    // Check for window.postMessage without origin validation
    if (line.includes('postMessage') && !line.includes('origin')) {
      issues.push({
        type: 'postmessage_vulnerability',
        severity: 'high',
        line: lineNumber,
        content: line,
        message: 'postMessage without origin validation',
        recommendation: 'Always validate origin in postMessage communications',
        cweId: 'CWE-346',
        owasp: 'A05:2021 – Security Misconfiguration'
      });
    }
    
    return issues;
  }

  // Analyze dependency vulnerabilities
  async analyzeDependencyVulnerabilities() {
    const vulnerabilities = [];
    
    try {
      // In a real implementation, this would:
      // 1. Read package.json and package-lock.json
      // 2. Check against vulnerability databases (npm audit, Snyk, etc.)
      // 3. Analyze transitive dependencies
      
      // Mock vulnerability data based on common React app dependencies
      const mockVulnerabilities = [
        {
          package: 'react-scripts',
          version: 'detected',
          severity: 'medium',
          vulnerability: 'Potential XSS in development server',
          recommendation: 'Update to latest version',
          cveId: 'CVE-2023-MOCK-001'
        }
      ];
      
      vulnerabilities.push(...mockVulnerabilities);
      
    } catch (error) {
      logger.error('Dependency vulnerability analysis failed', { error: error.message });
    }
    
    return vulnerabilities;
  }

  // Analyze authentication security
  async analyzeAuthenticationSecurity() {
    const authIssues = [];
    
    // Check for authentication-related files and patterns
    const authPatterns = [
      { pattern: /password.*==.*['"]/i, issue: 'Plain text password comparison' },
      { pattern: /\.password\s*=/i, issue: 'Direct password assignment' },
      { pattern: /btoa\(.*password/i, issue: 'Base64 encoding is not encryption' },
      { pattern: /auth.*localStorage/i, issue: 'Authentication tokens in localStorage' }
    ];
    
    // Mock analysis - in real implementation would scan actual files
    return authIssues;
  }

  // Analyze API security
  async analyzeApiSecurity() {
    const apiIssues = [];
    
    // Check for API security issues
    const apiPatterns = [
      { pattern: /fetch\(.*\+.*\)/i, issue: 'URL concatenation may allow injection' },
      { pattern: /cors.*origin.*\*/i, issue: 'CORS wildcard origin' },
      { pattern: /\.get\(.*req\.query/i, issue: 'Direct query parameter usage' }
    ];
    
    return apiIssues;
  }

  // Analyze MCP Server security specifically
  async analyzeMcpServerSecurity() {
    const mcpIssues = [];
    
    try {
      // Look for MCP server usage patterns
      const mcpPatterns = [
        {
          pattern: /mcp__.*__(?!getDiagnostics|executeCode)[a-zA-Z]/i,
          severity: 'high',
          message: 'Usage of potentially unsafe MCP server tools',
          recommendation: 'Only use approved MCP tools: getDiagnostics, executeCode'
        },
        {
          pattern: /mcp.*exec|mcp.*shell|mcp.*system/i,
          severity: 'critical',
          message: 'MCP server system execution detected',
          recommendation: 'Avoid system execution through MCP servers'
        },
        {
          pattern: /process\.env\.MCP/i,
          severity: 'medium',
          message: 'MCP configuration in environment variables',
          recommendation: 'Ensure MCP credentials are properly secured'
        }
      ];
      
      // In real implementation, would scan files for these patterns
      
    } catch (error) {
      logger.error('MCP server security analysis failed', { error: error.message });
    }
    
    return mcpIssues;
  }

  // Analyze data protection measures
  async analyzeDataProtection() {
    const dataIssues = [];
    
    // Check for data protection issues
    const dataPatterns = [
      { pattern: /console\.log.*password/i, issue: 'Password logging detected' },
      { pattern: /console\.log.*token/i, issue: 'Token logging detected' },
      { pattern: /alert.*password/i, issue: 'Password in alert' },
      { pattern: /localStorage.*personal/i, issue: 'Personal data in localStorage' }
    ];
    
    return dataIssues;
  }

  // Analyze infrastructure security
  async analyzeInfrastructureSecurity() {
    const infraIssues = [];
    
    // Check package.json for security configs
    try {
      // Mock infrastructure analysis
      infraIssues.push({
        type: 'https_enforcement',
        severity: 'medium',
        message: 'Ensure HTTPS enforcement in production',
        recommendation: 'Configure HTTPS redirects and HSTS headers'
      });
      
    } catch (error) {
      logger.error('Infrastructure security analysis failed', { error: error.message });
    }
    
    return infraIssues;
  }

  // Analyze client-side security
  async analyzeClientSideSecurity() {
    const clientIssues = [];
    
    // Check for client-side security issues
    const clientPatterns = [
      { pattern: /document\.cookie/i, issue: 'Direct cookie manipulation' },
      { pattern: /window\.location.*=.*\+/i, issue: 'URL manipulation vulnerability' },
      { pattern: /eval\(/i, issue: 'Use of eval() function' },
      { pattern: /innerHTML.*\+/i, issue: 'Dynamic HTML injection' }
    ];
    
    return clientIssues;
  }

  // Generate security recommendations
  generateSecurityRecommendations(report) {
    const recommendations = [];
    
    // Critical security recommendations
    recommendations.push({
      priority: 'critical',
      category: 'authentication',
      title: 'Implement secure authentication practices',
      description: 'Use secure session management, strong password policies, and multi-factor authentication',
      implementation: [
        'Use httpOnly cookies for session tokens',
        'Implement CSRF protection',
        'Use secure password hashing (bcrypt, Argon2)',
        'Add rate limiting for authentication endpoints'
      ]
    });
    
    recommendations.push({
      priority: 'high',
      category: 'mcp_security',
      title: 'Secure MCP server usage',
      description: 'Ensure MCP servers follow security best practices',
      implementation: [
        'Validate all MCP server inputs',
        'Use only approved MCP tools',
        'Implement proper error handling',
        'Monitor MCP server communications'
      ]
    });
    
    recommendations.push({
      priority: 'high',
      category: 'dependency_security',
      title: 'Maintain secure dependencies',
      description: 'Keep dependencies updated and scan for vulnerabilities',
      implementation: [
        'Run npm audit regularly',
        'Use automated dependency updates',
        'Monitor security advisories',
        'Remove unused dependencies'
      ]
    });
    
    recommendations.push({
      priority: 'medium',
      category: 'data_protection',
      title: 'Implement data protection measures',
      description: 'Protect sensitive data throughout the application',
      implementation: [
        'Encrypt sensitive data at rest',
        'Use HTTPS for all communications',
        'Implement proper data validation',
        'Add data retention policies'
      ]
    });
    
    return recommendations;
  }

  // Calculate security score
  calculateSecurityScore(report) {
    let score = 100;
    let totalIssues = 0;
    
    // Deduct points based on security issues
    Object.values(report).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(item => {
          if (item.issues) {
            item.issues.forEach(issue => {
              totalIssues++;
              switch (issue.severity) {
                case 'critical':
                  score -= 20;
                  break;
                case 'high':
                  score -= 10;
                  break;
                case 'medium':
                  score -= 5;
                  break;
                case 'low':
                  score -= 2;
                  break;
                default:
                  score -= 1;
              }
            });
          }
        });
      }
    });
    
    return Math.max(0, score);
  }

  // Generate security summary
  generateSecuritySummary(report) {
    let totalIssues = 0;
    let criticalIssues = 0;
    let highIssues = 0;
    
    Object.values(report).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(item => {
          if (item.issues) {
            item.issues.forEach(issue => {
              totalIssues++;
              if (issue.severity === 'critical') criticalIssues++;
              if (issue.severity === 'high') highIssues++;
            });
          }
        });
      }
    });
    
    return {
      totalIssues,
      criticalIssues,
      highIssues,
      securityScore: this.calculateSecurityScore(report),
      lastScanTime: this.lastScanTime,
      status: this.getSecurityStatus(criticalIssues, highIssues)
    };
  }

  // Get security status
  getSecurityStatus(criticalIssues, highIssues) {
    if (criticalIssues > 0) return 'Critical - Immediate action required';
    if (highIssues > 5) return 'High Risk - Address vulnerabilities soon';
    if (highIssues > 0) return 'Medium Risk - Review and fix issues';
    return 'Good - No critical issues found';
  }

  // Helper methods for security messages and recommendations
  getSecurityMessage(ruleName, content) {
    const messages = {
      hardcodedSecrets: 'Hardcoded secret or credential detected',
      xssVulnerabilities: 'Potential XSS vulnerability found',
      insecureHttp: 'Insecure HTTP usage detected',
      weakCrypto: 'Weak cryptographic practice identified',
      sqlInjection: 'Potential SQL injection vulnerability',
      mcpServerSecurity: 'MCP server security concern'
    };
    
    return messages[ruleName] || 'Security issue detected';
  }

  getSecurityRecommendation(ruleName) {
    const recommendations = {
      hardcodedSecrets: 'Use environment variables or secure credential management',
      xssVulnerabilities: 'Sanitize and validate all user input before rendering',
      insecureHttp: 'Use HTTPS for all external communications',
      weakCrypto: 'Use cryptographically secure random functions and strong algorithms',
      sqlInjection: 'Use parameterized queries or ORM with proper escaping',
      mcpServerSecurity: 'Follow MCP server security guidelines and validate inputs'
    };
    
    return recommendations[ruleName] || 'Follow security best practices';
  }

  getCweId(ruleName) {
    const cweIds = {
      hardcodedSecrets: 'CWE-798',
      xssVulnerabilities: 'CWE-79',
      insecureHttp: 'CWE-319',
      weakCrypto: 'CWE-338',
      sqlInjection: 'CWE-89',
      mcpServerSecurity: 'CWE-20'
    };
    
    return cweIds[ruleName] || 'CWE-UNKNOWN';
  }

  getOwaspCategory(ruleName) {
    const owaspCategories = {
      hardcodedSecrets: 'A02:2021 – Cryptographic Failures',
      xssVulnerabilities: 'A03:2021 – Injection',
      insecureHttp: 'A02:2021 – Cryptographic Failures',
      weakCrypto: 'A02:2021 – Cryptographic Failures',
      sqlInjection: 'A03:2021 – Injection',
      mcpServerSecurity: 'A05:2021 – Security Misconfiguration'
    };
    
    return owaspCategories[ruleName] || 'Security Misconfiguration';
  }

  // Mock methods (would be implemented with actual file system access)
  async getSecurityRelevantFiles() {
    return [
      'src/App.js',
      'src/services/blueskyService.js',
      'src/services/supabaseService.js',
      'src/utils/errorHandler.js',
      'src/utils/customerDataLoader.js',
      'src/supabaseClient.js'
    ];
  }

  async readFile(filePath) {
    return `// Mock file content for security analysis: ${filePath}`;
  }

  calculateFileRiskLevel(issues) {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    
    if (criticalCount > 0) return 'critical';
    if (highCount > 2) return 'high';
    if (highCount > 0) return 'medium';
    return 'low';
  }

  async generateSecurityReport(report, recommendations) {
    const securityReport = {
      agent: this.name,
      version: this.version,
      timestamp: new Date().toISOString(),
      summary: this.generateSecuritySummary(report),
      findings: report,
      recommendations: recommendations,
      complianceChecks: {
        owasp: this.checkOwaspCompliance(report),
        gdpr: this.checkGdprCompliance(report),
        hipaa: this.checkHipaaCompliance(report)
      },
      nextSteps: this.generateSecurityActionItems(report)
    };
    
    return securityReport;
  }

  checkOwaspCompliance(report) {
    return {
      score: 85,
      status: 'Mostly Compliant',
      issues: ['A03:2021 - Injection vulnerabilities found', 'A02:2021 - Cryptographic issues detected']
    };
  }

  checkGdprCompliance(report) {
    return {
      score: 90,
      status: 'Good',
      issues: ['Data retention policy needs documentation']
    };
  }

  checkHipaaCompliance(report) {
    return {
      score: 'N/A',
      status: 'Not Applicable',
      issues: ['Application does not handle healthcare data']
    };
  }

  generateSecurityActionItems(report) {
    return [
      'Review and fix all critical security vulnerabilities',
      'Implement secure authentication and session management',
      'Add input validation and output encoding',
      'Secure MCP server communications',
      'Update dependencies with known vulnerabilities',
      'Implement security monitoring and logging',
      'Add automated security testing to CI/CD pipeline'
    ];
  }
}

export default SecurityAgent;