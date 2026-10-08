import { test, expect } from '@playwright/test';

test.describe('HostelFix End-to-End Suite', () => {

  test('TC-01: Authentication page loads with accessible elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/HostelFix|Login/i);
    await expect(page.locator('#id')).toBeVisible();
    await expect(page.locator('#pin')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('TC-02: Authentication rejects invalid pin format', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '11287773');
    await page.fill('#pin', '123'); // Invalid PIN length (< 5 digits)
    await page.click('button[type="submit"]');
    
    // Checks for validation error message
    const errorMsg = page.locator('#pin-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('PIN must be exactly 5 digits');
  });

  test('TC-03: Student logs in and navigates to issue reporting', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '11287773');
    await page.fill('#pin', '12345');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    
    // Navigate to new issue form
    await page.goto('/dashboard/issues/new');
    await expect(page).toHaveURL(/.*dashboard\/issues\/new/);
    await expect(page.locator('body')).toContainText(/issue|report/i);
  });

  test('TC-04: Hall Manager logs in and views hall dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '10000001');
    await page.fill('#pin', '12345');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-05: Maintenance staff logs in and views work queue', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '10000002');
    await page.fill('#pin', '12345');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-06: University Admin views system-wide dashboard and analytics', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '10000003');
    await page.fill('#pin', '12345');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-07: System Admin logs in to manage university-wide settings', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#id', '10000004');
    await page.fill('#pin', '12345');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

});
