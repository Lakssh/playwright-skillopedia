import { Reporter, FullResult, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface ExtentTest {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'ERROR';
  duration: number;
  startTime: number;
  logs: string[];
  error?: string;
  attachments: Array<{ name: string; path: string }>;
}

interface ExtentSuite {
  name: string;
  tests: ExtentTest[];
  startTime: number;
  duration: number;
}

/**
 * Custom Extent HTML Reporter for Playwright
 * Generates beautiful HTML reports with test execution details
 */
export default class ExtentReporter implements Reporter {
  private outputDir = 'extent-report';
  private suites: ExtentSuite[] = [];
  private currentSuite: ExtentSuite | null = null;
  private currentTest: ExtentTest | null = null;
  private startTime = Date.now();

  constructor(options?: { outputFolder?: string }) {
    if (options?.outputFolder) {
      this.outputDir = options.outputFolder;
    }
    this.ensureOutputDir();
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onBegin() {
    console.log(`Extent Reporter: Starting test execution`);
  }

  onSuite(suite: Suite) {
    // Track all suites, not just top-level
    this.currentSuite = {
      name: suite.title || 'Default Suite',
      tests: [],
      startTime: Date.now(),
      duration: 0,
    };
    this.suites.push(this.currentSuite);
  }

  onTestBegin(test: TestCase) {
    // Ensure we have a current suite
    if (!this.currentSuite) {
      this.currentSuite = {
        name: test.file || 'Default Suite',
        tests: [],
        startTime: Date.now(),
        duration: 0,
      };
      this.suites.push(this.currentSuite);
    }
    
    this.currentTest = {
      name: test.title,
      status: 'PASS',
      duration: 0,
      startTime: Date.now(),
      logs: [],
      attachments: [],
    };
  }

  onTestEnd(_test: TestCase, result: TestResult) {
    if (this.currentTest && this.currentSuite) {
      this.currentTest.duration = result.duration;

      if (result.status === 'passed') {
        this.currentTest.status = 'PASS';
      } else if (result.status === 'failed') {
        this.currentTest.status = 'FAIL';
        if (result.error) {
          this.currentTest.error = result.error.message;
          this.currentTest.logs.push(`Error: ${result.error.message}`);
        }
      } else if (result.status === 'skipped') {
        this.currentTest.status = 'SKIP';
      }

      // Capture attachments
      if (result.attachments && result.attachments.length > 0) {
        result.attachments.forEach((attachment) => {
          this.currentTest!.attachments.push({
            name: attachment.name,
            path: attachment.path || '',
          });
        });
      }

      this.currentSuite.tests.push(this.currentTest);
      this.currentTest = null;
    }
  }

  onEnd(_result: FullResult) {
    const totalDuration = Date.now() - this.startTime;

    // Calculate statistics
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    this.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        totalTests++;
        if (test.status === 'PASS') passedTests++;
        else if (test.status === 'FAIL') failedTests++;
        else if (test.status === 'SKIP') skippedTests++;
      });
    });

    const html = this.generateHTML({
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      totalDuration,
    });

    const reportPath = path.join(this.outputDir, 'index.html');
    fs.writeFileSync(reportPath, html);
    console.log(`Extent Report generated: ${reportPath}`);
  }

  private generateHTML(stats: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    totalDuration: number;
  }): string {
    const passRate = stats.totalTests > 0 ? ((stats.passedTests / stats.totalTests) * 100).toFixed(2) : 0;
    const durationSeconds = (stats.totalDuration / 1000).toFixed(2);

    let testRows = '';
    this.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        const statusClass = test.status === 'PASS' ? 'pass' : test.status === 'FAIL' ? 'fail' : 'skip';
        const statusIcon = test.status === 'PASS' ? '✓' : test.status === 'FAIL' ? '✗' : '⊘';

        testRows += `
        <tr class="${statusClass}">
          <td><span class="status-badge ${statusClass}">${statusIcon}</span> ${test.name}</td>
          <td>${suite.name}</td>
          <td><span class="status ${statusClass}">${test.status}</span></td>
          <td>${test.duration}ms</td>
        </tr>
        ${
          test.error
            ? `<tr class="error-row"><td colspan="4"><pre>${this.escapeHTML(test.error)}</pre></td></tr>`
            : ''
        }
        `;
      });
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extent HTML Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .stat-card h3 {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .stat-card .value {
      font-size: 2.5em;
      font-weight: bold;
      color: #333;
    }
    .stat-card.pass {
      border-left-color: #10b981;
    }
    .stat-card.pass .value {
      color: #10b981;
    }
    .stat-card.fail {
      border-left-color: #ef4444;
    }
    .stat-card.fail .value {
      color: #ef4444;
    }
    .stat-card.skip {
      border-left-color: #f59e0b;
    }
    .stat-card.skip .value {
      color: #f59e0b;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #6366f1 100%);
      border-radius: 4px;
    }
    .content {
      padding: 40px;
    }
    .content h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    thead {
      background: #f3f4f6;
      border-bottom: 2px solid #e5e7eb;
    }
    th {
      padding: 15px;
      text-align: left;
      color: #374151;
      font-weight: 600;
      font-size: 0.9em;
      text-transform: uppercase;
    }
    td {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    tr.error-row {
      background: #fef2f2;
    }
    tr.error-row pre {
      background: #fee;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      color: #c41e3a;
      font-size: 0.85em;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      margin-right: 8px;
    }
    .status-badge.pass {
      background: #10b981;
    }
    .status-badge.fail {
      background: #ef4444;
    }
    .status-badge.skip {
      background: #f59e0b;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .status.pass {
      background: #d1fae5;
      color: #065f46;
    }
    .status.fail {
      background: #fee2e2;
      color: #991b1b;
    }
    .status.skip {
      background: #fef3c7;
      color: #92400e;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid #e5e7eb;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Extent HTML Report</h1>
      <p>Playwright Automation Test Results</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="value">${stats.totalTests}</div>
      </div>
      <div class="stat-card pass">
        <h3>Passed</h3>
        <div class="value">${stats.passedTests}</div>
      </div>
      <div class="stat-card fail">
        <h3>Failed</h3>
        <div class="value">${stats.failedTests}</div>
      </div>
      <div class="stat-card skip">
        <h3>Skipped</h3>
        <div class="value">${stats.skippedTests}</div>
      </div>
      <div class="stat-card">
        <h3>Pass Rate</h3>
        <div class="value">${passRate}%</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${passRate}%"></div>
        </div>
      </div>
      <div class="stat-card">
        <h3>Duration</h3>
        <div class="value">${durationSeconds}s</div>
      </div>
    </div>

    <div class="content">
      <h2>Test Execution Details</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Suite</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${testRows}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Extent HTML Report for Playwright</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private escapeHTML(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
