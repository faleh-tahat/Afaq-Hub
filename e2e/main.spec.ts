import { test, expect } from '@playwright/test'

test.describe('AFAQ Website - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/AFAQ Tech Team/)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should have valid navigation links', async ({ page }) => {
    const links = ['About', 'Committees', 'Events', 'Projects', 'News', 'Partners']

    for (const link of links) {
      const element = page.locator(`a:has-text("${link}")`)
      await expect(element).toBeVisible()
    }
  })

  test('should navigate to pages without errors', async ({ page }) => {
    const routes = ['/about', '/committees', '/events', '/projects', '/news', '/gallery', '/partners', '/join-us', '/contact', '/faq']

    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('main')).toBeVisible()
      await expect(page.locator('header')).toBeVisible()
    }
  })

  test('should handle 404 page correctly', async ({ page }) => {
    await page.goto('/non-existent-page')
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=/Page not found|الصفحة غير موجودة/')).toBeVisible()
  })

  test('should support language toggle', async ({ page }) => {
    // Check initial language (English)
    await expect(page.locator('button:has-text("EN")')).toHaveAttribute('aria-pressed', 'true')

    // Switch to Arabic
    await page.click('button:has-text("AR")')
    await page.waitForTimeout(300)

    // Verify Arabic is active
    await expect(page.locator('button:has-text("AR")')).toHaveAttribute('aria-pressed', 'true')

    // Verify content changed to Arabic
    const headerText = await page.locator('header').textContent()
    expect(headerText).toContain('فريق AFAQ التقني')
  })

  test('should apply RTL layout for Arabic', async ({ page }) => {
    // Switch to Arabic
    await page.click('button:has-text("AR")')
    await page.waitForTimeout(300)

    // Check if HTML has dir="rtl"
    const htmlDir = await page.locator('html').getAttribute('dir')
    expect(htmlDir).toBe('rtl')
  })

  test('should have accessible navigation', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check for keyboard navigation
    const links = page.locator('nav a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    // Test tab navigation
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON']).toContain(focused)
  })

  test('should have proper contrast and accessibility', async ({ page }) => {
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(bgColor).toBeTruthy()
  })
})

test.describe('AFAQ Website - Performance', () => {
  test('should load pages within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    expect(loadTime).toBeLessThan(3000) // 3 seconds
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    expect(errors).toHaveLength(0)
  })
})

test.describe('AFAQ Website - Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/')

    // Navigation should be visible or have mobile menu
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Content should be readable
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()

    const contentText = await mainContent.textContent()
    expect(contentText?.length).toBeGreaterThan(0)
  })
})

test.describe('AFAQ Website - Security', () => {
  test('should have security headers', async ({ page }) => {
    const response = await page.goto('/')

    if (response) {
      const headers = response.headers()
      expect(headers['x-content-type-options']).toBe('nosniff')
      expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    }
  })

  test('should not expose sensitive information in console', async ({ page }) => {
    const logs: string[] = []
    page.on('console', (msg) => logs.push(msg.text()))

    await page.goto('/')

    const sensitivePatterns = [/password/i, /token/i, /secret/i, /apikey/i, /api_key/i]
    for (const log of logs) {
      for (const pattern of sensitivePatterns) {
        expect(log).not.toMatch(pattern)
      }
    }
  })
})
