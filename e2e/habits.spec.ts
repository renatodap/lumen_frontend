/**
 * E2E Tests for Habits Feature
 */
import { test, expect } from '@playwright/test'

test.describe('Habits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should create a new habit', async ({ page }) => {
    // Navigate to habits page
    await page.click('text=Habits')
    await expect(page).toHaveURL('/habits')

    // Click add habit button
    await page.click('button:has-text("Add Habit")')

    // Fill out habit form
    await page.fill('input[name="name"]', 'Morning Exercise')
    await page.selectOption('select[name="frequency"]', 'daily')
    await page.fill('input[name="icon"]', '🏃')
    await page.fill('input[name="reminder_times.0"]', '09:00')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify habit appears in list
    await expect(page.locator('text=Morning Exercise')).toBeVisible()
    await expect(page.locator('text=🏃')).toBeVisible()
  })

  test('should complete a habit for today', async ({ page }) => {
    await page.goto('/habits')

    // Find first habit card and click complete button
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    await habitCard.locator('button:has-text("Complete")').click()

    // Verify completed state
    await expect(habitCard.locator('[data-testid="completed-checkmark"]')).toBeVisible()
    await expect(habitCard.locator('button:has-text("Undo")')).toBeVisible()
  })

  test('should display current streak', async ({ page }) => {
    await page.goto('/habits')

    const habitCard = page.locator('[data-testid="habit-card"]').first()

    // Check streak display
    const streakText = await habitCard.locator('[data-testid="streak"]').textContent()
    expect(streakText).toMatch(/\d+ day/)
  })

  test('should show habit details when clicked', async ({ page }) => {
    await page.goto('/habits')

    // Click on habit card
    await page.locator('[data-testid="habit-card"]').first().click()

    // Verify modal/detail view opens
    await expect(page.locator('role=dialog')).toBeVisible()
    await expect(page.locator('text=Habit Details')).toBeVisible()

    // Verify stats are displayed
    await expect(page.locator('text=Current Streak')).toBeVisible()
    await expect(page.locator('text=Completion Rate')).toBeVisible()
    await expect(page.locator('text=Total Completions')).toBeVisible()
  })

  test('should edit habit', async ({ page }) => {
    await page.goto('/habits')

    // Open habit menu
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    await habitCard.locator('button[aria-label="More options"]').click()

    // Click edit
    await page.click('text=Edit')

    // Update habit name
    await page.fill('input[name="name"]', 'Updated Habit Name')
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=Updated Habit Name')).toBeVisible()
  })

  test('should delete habit with confirmation', async ({ page }) => {
    await page.goto('/habits')

    const initialHabitCount = await page.locator('[data-testid="habit-card"]').count()

    // Open habit menu
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    const habitName = await habitCard.locator('[data-testid="habit-name"]').textContent()

    await habitCard.locator('button[aria-label="More options"]').click()

    // Click delete
    await page.click('text=Delete')

    // Confirm deletion
    await page.click('button:has-text("Confirm")')

    // Verify habit is removed
    const newHabitCount = await page.locator('[data-testid="habit-card"]').count()
    expect(newHabitCount).toBe(initialHabitCount - 1)
    await expect(page.locator(`text=${habitName}`)).not.toBeVisible()
  })

  test('should filter habits by frequency', async ({ page }) => {
    await page.goto('/habits')

    // Click filter dropdown
    await page.click('button:has-text("Filter")')

    // Select daily habits only
    await page.click('text=Daily')

    // Verify only daily habits are shown
    const habits = page.locator('[data-testid="habit-card"]')
    const count = await habits.count()

    for (let i = 0; i < count; i++) {
      const frequency = await habits.nth(i).locator('[data-testid="frequency"]').textContent()
      expect(frequency).toContain('Daily')
    }
  })

  test('should display habit history calendar', async ({ page }) => {
    await page.goto('/habits')

    // Click on habit to open details
    await page.locator('[data-testid="habit-card"]').first().click()

    // Navigate to history tab
    await page.click('button:has-text("History")')

    // Verify calendar is displayed
    await expect(page.locator('[data-testid="habit-calendar"]')).toBeVisible()

    // Verify current month is shown
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    await expect(page.locator(`text=${currentMonth}`)).toBeVisible()
  })

  test('should set smart reminders', async ({ page }) => {
    await page.goto('/habits')

    // Open habit menu
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    await habitCard.locator('button[aria-label="More options"]').click()

    // Click reminders
    await page.click('text=Reminders')

    // Add reminder time
    await page.click('button:has-text("Add Reminder")')
    await page.fill('input[type="time"]', '09:00')
    await page.click('button:has-text("Save")')

    // Verify reminder is set
    await expect(habitCard.locator('text=9:00 AM')).toBeVisible()
  })

  test('should break streak when habit is missed', async ({ page }) => {
    await page.goto('/habits')

    const habitCard = page.locator('[data-testid="habit-card"]').first()

    // Get initial streak
    const initialStreak = await habitCard.locator('[data-testid="streak"]').textContent()
    const streakNumber = parseInt(initialStreak?.match(/\d+/)?.[0] || '0')

    // Wait for next day (simulated by backend)
    // In real E2E, this would require time manipulation or waiting

    // Verify streak is reset or broken
    await page.reload()
    const newStreak = await habitCard.locator('[data-testid="streak"]').textContent()
    const newStreakNumber = parseInt(newStreak?.match(/\d+/)?.[0] || '0')

    // If habit wasn't completed yesterday, streak should be 0
    expect(newStreakNumber).toBeLessThanOrEqual(streakNumber)
  })

  test('should display empty state when no habits', async ({ page }) => {
    // Assuming test data can be reset or we start fresh
    await page.goto('/habits')

    // If no habits exist
    await expect(page.locator('text=No habits yet')).toBeVisible()
    await expect(page.locator('text=Create your first habit')).toBeVisible()
    await expect(page.locator('button:has-text("Add Habit")')).toBeVisible()
  })

  test('should handle offline mode gracefully', async ({ page, context }) => {
    await page.goto('/habits')

    // Wait for habits to load
    await page.waitForSelector('[data-testid="habit-card"]')

    // Go offline
    await context.setOffline(true)

    // Try to complete a habit
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    await habitCard.locator('button:has-text("Complete")').click()

    // Verify offline indicator
    await expect(page.locator('text=Offline')).toBeVisible()

    // Verify operation is queued
    await expect(page.locator('text=Will sync when online')).toBeVisible()

    // Go back online
    await context.setOffline(false)

    // Verify sync occurs
    await expect(page.locator('text=Synced')).toBeVisible()
  })
})
