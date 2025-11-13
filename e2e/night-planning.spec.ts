/**
 * E2E Tests for Night Planning Flow
 */
import { test, expect } from '@playwright/test'

test.describe('Night Planning Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full planning flow', async ({ page }) => {
    // Start planning
    await page.click('button:has-text("Plan Tomorrow")')

    // Step 1: Review Inbox
    await expect(page.locator('text=Review Inbox')).toBeVisible()
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()

    // Check off reviewed items
    const inboxItems = page.locator('[data-testid="inbox-item"]')
    const count = await inboxItems.count()
    for (let i = 0; i < Math.min(3, count); i++) {
      await inboxItems.nth(i).locator('input[type="checkbox"]').check()
    }

    await page.click('button:has-text("Next")')

    // Step 2: Calendar View
    await expect(page.locator('text=Calendar View')).toBeVisible()
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()

    // Verify tomorrow's date is displayed
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    await expect(page.locator(`text=${tomorrowStr}`)).toBeVisible()

    await page.click('button:has-text("Next")')

    // Step 3: Task Assignment
    await expect(page.locator('text=Assign Tasks')).toBeVisible()
    await expect(page.locator('text=Step 3 of 4')).toBeVisible()

    // Drag task to 2-day horizon
    const task = page.locator('[data-testid="unassigned-task"]').first()
    const twoDay = page.locator('[data-testid="2-day-horizon"]')
    await task.dragTo(twoDay)

    await page.click('button:has-text("Next")')

    // Step 4: Win Condition
    await expect(page.locator('text=Set Win Condition')).toBeVisible()
    await expect(page.locator('text=Step 4 of 4')).toBeVisible()

    // Fill win condition
    await page.fill(
      'textarea[name="win_condition"]',
      'Complete morning workout and finish project report'
    )

    // Complete planning
    await page.click('button:has-text("Complete Planning")')

    // Verify completion
    await expect(page.locator('text=Planning Complete')).toBeVisible()
    await expect(page.locator('text=Ready for tomorrow')).toBeVisible()
  })

  test('should allow going back to previous steps', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Go to step 2
    await page.click('button:has-text("Next")')
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()

    // Go back to step 1
    await page.click('button:has-text("Back")')
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()
    await expect(page.locator('text=Review Inbox')).toBeVisible()
  })

  test('should save progress automatically', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Make changes in step 1
    const checkbox = page.locator('[data-testid="inbox-item"]').first().locator('input[type="checkbox"]')
    await checkbox.check()

    // Go to step 2
    await page.click('button:has-text("Next")')

    // Go back to step 1
    await page.click('button:has-text("Back")')

    // Verify checkbox is still checked
    await expect(checkbox).toBeChecked()
  })

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Try to proceed to step 4 without setting tasks
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')

    // Try to complete without win condition
    await page.click('button:has-text("Complete Planning")')

    // Verify validation error
    await expect(page.locator('text=Win condition is required')).toBeVisible()
  })

  test('should show acceptance criteria in step 4', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Navigate to step 4
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')

    // Verify acceptance criteria are shown
    await expect(page.locator('text=Acceptance Criteria')).toBeVisible()
    await expect(page.locator('[data-testid="criteria-item"]')).toHaveCount(3)
  })

  test('should handle canceling planning flow', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Click cancel
    await page.click('button:has-text("Cancel")')

    // Verify confirmation dialog
    await expect(page.locator('text=Cancel planning?')).toBeVisible()
    await page.click('button:has-text("Yes, cancel")')

    // Verify returned to main view
    await expect(page.locator('button:has-text("Plan Tomorrow")')).toBeVisible()
  })

  test('should integrate with calendar events', async ({ page }) => {
    // Assuming user has connected calendar
    await page.click('button:has-text("Plan Tomorrow")')

    // Go to step 2
    await page.click('button:has-text("Next")')

    // Verify calendar events are shown
    const calendarEvents = page.locator('[data-testid="calendar-event"]')
    await expect(await calendarEvents.count()).toBeGreaterThan(0)

    // Verify time blocks are displayed
    const event = page.locator('[data-testid="calendar-event"]').first()
    await expect(event.locator('[data-testid="event-time"]')).toBeVisible()
    await expect(event.locator('[data-testid="event-title"]')).toBeVisible()
  })

  test('should display task blocking conflicts', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Navigate to step 3
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')

    // Try to assign blocked task
    const blockedTask = page.locator('[data-testid="blocked-task"]').first()
    const twoDay = page.locator('[data-testid="2-day-horizon"]')

    await blockedTask.dragTo(twoDay)

    // Verify blocking warning
    await expect(page.locator('text=This task is blocked')).toBeVisible()
    await expect(page.locator('text=Complete dependencies first')).toBeVisible()
  })

  test('should suggest optimal task distribution', async ({ page }) => {
    await page.click('button:has-text("Plan Tomorrow")')

    // Navigate to step 3
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')

    // Click auto-assign
    await page.click('button:has-text("Auto-Assign")')

    // Verify tasks are distributed
    const twoDayTasks = page.locator('[data-testid="2-day-horizon"] [data-testid="task-card"]')
    await expect(await twoDayTasks.count()).toBeGreaterThan(0)
    const sevenDayTasks = page.locator('[data-testid="7-day-horizon"] [data-testid="task-card"]')
    await expect(await sevenDayTasks.count()).toBeGreaterThan(0)
  })

  test('should show planning history', async ({ page }) => {
    // Complete a planning session first
    await page.click('button:has-text("Plan Tomorrow")')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')
    await page.fill('textarea[name="win_condition"]', 'Test win condition')
    await page.click('button:has-text("Complete Planning")')

    // Go back to main view
    await page.click('button:has-text("Done")')

    // Open planning history
    await page.click('button[aria-label="Planning history"]')

    // Verify history is shown
    await expect(page.locator('text=Planning History')).toBeVisible()
    const sessions = page.locator('[data-testid="planning-session"]')
    await expect(await sessions.count()).toBeGreaterThan(0)

    // Verify date and completion status
    const session = page.locator('[data-testid="planning-session"]').first()
    await expect(session.locator('[data-testid="session-date"]')).toBeVisible()
    await expect(session.locator('[data-testid="completion-badge"]')).toBeVisible()
  })
})
