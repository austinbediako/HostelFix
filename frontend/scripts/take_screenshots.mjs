import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const screenshotDir = '/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function capture() {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Capture Login Page
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to Login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '01_login_page.png') });
  console.log('Saved 01_login_page.png');

  // Helper for logging in and screenshotting
  async function testLogin(roleName, id, pin, actions) {
    console.log(`Testing login for ${roleName} (${id})...`);
    const roleContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const p = await roleContext.newPage();
    await p.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await p.fill('#id', id);
    await p.fill('#pin', pin);
    await p.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    try {
      await p.waitForURL(url => url.pathname.includes('/dashboard'), { timeout: 10000 });
      await p.waitForLoadState('networkidle');
      console.log(`Successfully reached dashboard for ${roleName}: ${p.url()}`);
    } catch (e) {
      console.log(`Wait for dashboard URL warning for ${roleName}: ${e.message}`);
    }
    
    if (actions) {
      await actions(p);
    }
    await roleContext.close();
  }

  // 2. Student Flow
  await testLogin('Student', '11287773', '12345', async (p) => {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(screenshotDir, '02_student_dashboard.png') });
    console.log('Saved 02_student_dashboard.png');

    // Go to New Issue page
    await p.goto('http://localhost:3000/dashboard/issues/new', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    await p.screenshot({ path: path.join(screenshotDir, '03_student_report_issue.png') });
    console.log('Saved 03_student_report_issue.png');

    // Go to Issues List
    await p.goto('http://localhost:3000/dashboard/issues', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    await p.screenshot({ path: path.join(screenshotDir, '04_student_issues_list.png') });
    console.log('Saved 04_student_issues_list.png');

    // Check if there are any issues to view details
    const firstIssue = await p.$('a[href^="/dashboard/issues/"]');
    if (firstIssue) {
      await firstIssue.click();
      await p.waitForLoadState('networkidle');
      await p.waitForTimeout(1000);
      await p.screenshot({ path: path.join(screenshotDir, '05_issue_detail_view.png') });
      console.log('Saved 05_issue_detail_view.png');
    }
  });

  // 3. Hall Manager Flow
  await testLogin('Hall Manager', '10000001', '12345', async (p) => {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(screenshotDir, '06_hall_manager_dashboard.png') });
    console.log('Saved 06_hall_manager_dashboard.png');

    await p.goto('http://localhost:3000/dashboard/issues', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    await p.screenshot({ path: path.join(screenshotDir, '07_hall_manager_issues.png') });
    console.log('Saved 07_hall_manager_issues.png');
  });

  // 4. Maintenance Staff Flow
  await testLogin('Maintenance Staff', '10000002', '12345', async (p) => {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(screenshotDir, '08_maintenance_dashboard.png') });
    console.log('Saved 08_maintenance_dashboard.png');
  });

  // 5. University Admin Flow
  await testLogin('University Admin', '10000003', '12345', async (p) => {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(screenshotDir, '09_university_admin_dashboard.png') });
    console.log('Saved 09_university_admin_dashboard.png');

    // Try analytics or reports if available
    try {
      await p.goto('http://localhost:3000/dashboard/analytics', { waitUntil: 'networkidle' });
      await p.waitForTimeout(1000);
      await p.screenshot({ path: path.join(screenshotDir, '10_admin_analytics.png') });
      console.log('Saved 10_admin_analytics.png');
    } catch (e) {
      console.log('No analytics page or error:', e.message);
    }
  });

  // 6. System Admin Flow
  await testLogin('System Admin', '10000004', '12345', async (p) => {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(screenshotDir, '11_system_admin_dashboard.png') });
    console.log('Saved 11_system_admin_dashboard.png');
  });

  await browser.close();
  console.log('Finished capturing all screenshots successfully!');
}

capture().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
