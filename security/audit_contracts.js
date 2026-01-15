const { exec } = require('child_process');
const fs = require('fs');
const LoggerUtils = require('../utils/logger');

class ContractAuditor {
  static async runSlitherAudit(contractPath) {
    return new Promise((resolve, reject) => {
      exec(`slither ${contractPath} --json slither_report.json`, (error, stdout, stderr) => {
        if (error) {
          LoggerUtils.logError('Slither Audit Failed', error);
          reject(error);
        } else {
          const report = JSON.parse(fs.readFileSync('slither_report.json', 'utf8'));
          LoggerUtils.logInfo('Slither Audit Complete', { vulnerabilities: report.length });
          resolve(report);
        }
      });
    });
  }

  static async runMythrilAudit(contractPath) {
    return new Promise((resolve, reject) => {
      exec(`myth analyze ${contractPath} --solc-json mythril_report.json`, (error, stdout, stderr) => {
        if (error) {
          LoggerUtils.logError('Mythril Audit Failed', error);
          reject(error);
        } else {
          const report = JSON.parse(fs.readFileSync('mythril_report.json', 'utf8'));
          LoggerUtils.logInfo('Mythril Audit Complete', { issues: report.length });
          resolve(report);
        }
      });
    });
  }

  static generateAuditSummary(slitherReport, mythrilReport) {
    const summary = {
      totalVulnerabilities: slitherReport.length + mythrilReport.length,
      highRisk: [...slitherReport, ...mythrilReport].filter(v => v.severity === 'high').length,
      recommendations: [
        "Use OpenZeppelin libraries for reentrancy guards",
        "Implement quantum-resistant hashing",
        "Regular audits post-deployment"
      ]
    };
    fs.writeFileSync('security/audit_summary.json', JSON.stringify(summary, null, 2));
    LoggerUtils.logInfo('Audit Summary Generated', summary);
    return summary;
  }
}

// Example
(async () => {
  const slither = await ContractAuditor.runSlitherAudit('contracts/GaiaDAO.sol');
  const mythril = await ContractAuditor.runMythrilAudit('contracts/GaiaDAO.sol');
  ContractAuditor.generateAuditSummary(slither, mythril);
})();
