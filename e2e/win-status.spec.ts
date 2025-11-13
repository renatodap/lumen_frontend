/**
 * E2E Tests for Win Status Feature
 */
import { test, expect } from '@playwright/test'

test.describe('Win Status', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/today')
  })

  test('should display win status for today', async ({ page }) => {
    // Verify win status widget is visible
    await expect(page.locator('[data-testid="win-status"]')).toBeVisible()

    // Verify components
    await expect(page.locator('text=Did I Win My Day?')).toBeVisible()
    await expect(page.locator('[data-testid="completion-percentage"]')).toBeVisible()
    await expect(page.locator('[data-testid="criteria-progress"]')).toBeVisible()
  })

  test('should update win status when completing criteria', async ({ page }) => {
    // Get initial completion percentage
    const initialPercentage = await page.locator('[data-testid="completion-percentage"]').textContent()
    const initialValue = parseInt(initialPercentage?.replace('%', '') || '0')

    // Complete a criteria item
    const criteriaItem = page.locator('[data-testid="criteria-item"]').first()
    await criteriaItem.locator('input[type="checkbox"]').check()

    // Verify percentage increased
    const newPercentage = await page.locator('[data-testid="completion-percentage"]').textContent()
    const newValue = parseInt(newPercentage?.replace('%', '') || '0')
    expect(newValue).toBeGreaterThan(initialValue)
  })

  test('should show win condition status', async ({ page }) => {
    // Verify win condition is displayed
    await expect(page.locator('[data-testid="win-condition"]')).toBeVisible()

    // Check if win condition is met
    const winCondition = page.locator('[data-testid="win-condition"]')
    const status = await winCondition.getAttribute('data-status')

    if (status === 'met') {
      await expect(winCondition.locator('[data-testid="checkmark"]')).toBeVisible()
      await expect(winCondition).toHaveClass(/bg-success/)
    } else {
      await expect(winCondition).not.toHaveClass(/bg-success/)
    }
  })

  test('should celebrate when day is won', async ({ page }) => {
    // Complete all criteria
    const criteriaItems = page.locator('[data-testid="criteria-item"]')
    const count = await criteriaItems.count()

    for (let i = 0; i < count; i++) {
      await criteriaItems.nth(i).locator('input[type="checkbox"]').check()
    }

    // Mark win condition as met
    await page.locator('[data-testid="win-condition-checkbox"]').check()

    // Verify celebration
    await expect(page.locator('[data-testid="win-celebration"]')).toBeVisible()
    await expect(page.locator('text=You won your day!')).toBeVisible()

    // Verify confetti or animation
    await expect(page.locator('[data-testid="confetti"]')).toBeVisible()
  })

  test('should show acceptance criteria progress', async ({ page }) => {
    const criteriaList = page.locator('[data-testid="criteria-list"]')

    // Verify all criteria are listed
    const items = page.locator('[data-testid="criteria-item"]')
    await expect(await items.count()).toBeGreaterThan(0)

    // Verify each item has checkbox and text
    const firstItem = items.first()
    await expect(firstItem.locator('input[type="checkbox"]')).toBeVisible()
    await expect(firstItem.locator('[data-testid="criteria-text"]')).toBeVisible()
  })

  test('should track daily streak', async ({ page }) => {
    // Navigate to stats section
    await page.click('button:has-text("Stats")')

    // Verify streak display
    await expect(page.locator('[data-testid="current-streak"]')).toBeVisible()
    await expect(page.locator('[data-testid="longest-streak"]')).toBeVisible()

    // Verify streak numbers
    const currentStreak = await page.locator('[data-testid="current-streak"]').textContent()
    expect(currentStreak).toMatch(/\d+ day/)
  })

  test('should show win rate statistics', async ({ page }) => {
    await page.click('button:has-text("Stats")')

    // Verify win rate
    await expect(page.locator('[data-testid="win-rate"]')).toBeVisible()

    // Verify percentage format
    const winRate = await page.locator('[data-testid="win-rate"]').textContent()
    expect(winRate).toMatch(/\d+%/)

    // Verify chart is displayed
    await expect(page.locator('[data-testid="win-rate-chart"]')).toBeVisible()
  })

  test('should display monthly calendar view', async ({ page }) => {
    await page.click('button:has-text("Calendar")')

    // Verify calendar is shown
    await expect(page.locator('[data-testid="win-calendar"]')).toBeVisible()

    // Verify current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    await expect(page.locator(`text=${currentMonth}`)).toBeVisible()

    // Verify won days are highlighted
    const wonDays = page.locator('[data-testid="won-day"]')
    await expect(wonDays.first()).toHaveClass(/bg-success/)
  })

  test('should add reflection for the day', async ({ page }) => {
    // Complete all criteria first
    const criteriaItems = page.locator('[data-testid="criteria-item"]')
    const count = await criteriaItems.count()
    for (let i = 0; i < count; i++) {
      await criteriaItems.nth(i).locator('input[type="checkbox"]').check()
    }

    // Click add reflection
    await page.click('button:has-text("Add Reflection")')

    // Write reflection
    await page.fill(
      'textarea[name="reflection"]',
      'Today was productive. Completed all tasks and maintained good energy.'
    )

    // Save reflection
    await page.click('button:has-text("Save")')

    // Verify reflection saved
    await expect(page.locator('text=Reflection saved')).toBeVisible()
  })

  test('should view past day win status', async ({ page }) => {
    await page.click('button:has-text("Calendar")')

    // Click on a past date
    const pastDay = page.locator('[data-testid="calendar-day"]').nth(5)
    await pastDay.click()

    // Verify day detail modal
    await expect(page.locator('role=dialog')).toBeVisible()

    // Verify date is shown
    await expect(page.locator('[data-testid="selected-date"]')).toBeVisible()

    // Verify criteria completion for that day
    await expect(page.locator('[data-testid="day-criteria"]')).toBeVisible()

    // Verify win status
    await expect(page.locator('[data-testid="day-won-status"]')).toBeVisible()
  })

  test('should show different criteria for different day types', async ({ page }) => {
    // Navigate to settings
    await page.click('button[aria-label="Settings"]')

    // Select laundry day
    await page.selectOption('select[name="day_type"]', 'laundry_day')

    // Go back to today view
    await page.click('text=Today')

    // Verify laundry-specific criteria
    await expect(page.locator('text=Do laundry')).toBeVisible()
  })

  test('should export win data', async ({ page }) => {
    await page.click('button:has-text("Stats")')

    // Click export button
    await page.click('button:has-text("Export Data")')

    // Verify download starts
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Download CSV")'),
    ])

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/win-data.*\.csv/)
  })

  test('should handle incomplete day at midnight', async ({ page }) => {
    // Simulate time near midnight
    // Note: This would require time manipulation in real implementation

    // Leave some criteria incomplete
    const criteriaItems = page.locator('[data-testid="criteria-item"]')
    const firstItem = criteriaItems.first()
    await firstItem.locator('input[type="checkbox"]').check()

    // Verify warning for incomplete day
    await expect(page.locator('text=Day not complete')).toBeVisible()
    await expect(page.locator('text=Complete remaining criteria')).toBeVisible()
  })

  test('should show win insights and trends', async ({ page }) => {
    await page.click('button:has-text("Stats")')
    await page.click('button:has-text("Insights")')

    // Verify insights are displayed
    await expect(page.locator('[data-testid="insights-panel"]')).toBeVisible()

    // Verify trend data
    await expect(page.locator('text=Best performing day')).toBeVisible()
    await expect(page.locator('text=Most skipped criteria')).toBeVisible()
    await expect(page.locator('text=Average completion time')).toBeVisible()
  })

  test('should compare with previous periods', async ({ page }) => {
    await page.click('button:has-text("Stats")')

    // Select comparison period
    await page.click('button:has-text("Compare")')
    await page.selectOption('select[name="period"]', 'last_month')

    // Verify comparison data
    await expect(page.locator('[data-testid="comparison-chart"]')).toBeVisible()

    // Verify improvement indicators
    const improvement = page.locator('[data-testid="improvement-indicator"]')
    await expect(improvement).toBeVisible()

    // Check if showing increase or decrease
    const hasIncrease = await improvement.locator('[data-testid="up-arrow"]').count()
    const hasDecrease = await improvement.locator('[data-testid="down-arrow"]').count()
    expect(hasIncrease + hasDecrease).toBeGreaterThan(0)
  })
})
