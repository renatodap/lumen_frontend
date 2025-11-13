/**
 * E2E Tests for Tasks and Horizon System
 */
import { test, expect } from '@playwright/test'

test.describe('Tasks and Horizon System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks')
  })

  test('should create new task', async ({ page }) => {
    // Click add task button
    await page.click('button:has-text("Add Task")')

    // Fill task form
    await page.fill('input[name="title"]', 'Complete project report')
    await page.fill('textarea[name="notes"]', 'Include Q4 metrics and analysis')
    await page.selectOption('select[name="horizon"]', '2-day')

    // Set due date
    await page.click('input[name="due_date"]')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.fill('input[name="due_date"]', tomorrow.toISOString().split('T')[0])

    // Submit
    await page.click('button[type="submit"]')

    // Verify task appears in 2-day horizon
    const twoDaySection = page.locator('[data-testid="2-day-horizon"]')
    await expect(twoDaySection.locator('text=Complete project report')).toBeVisible()
  })

  test('should display tasks in correct horizons', async ({ page }) => {
    // Verify all three horizons are shown
    await expect(page.locator('[data-testid="2-day-horizon"]')).toBeVisible()
    await expect(page.locator('[data-testid="7-day-horizon"]')).toBeVisible()
    await expect(page.locator('[data-testid="future-horizon"]')).toBeVisible()

    // Verify horizon titles
    await expect(page.locator('text=Next 2 Days')).toBeVisible()
    await expect(page.locator('text=Next 7 Days')).toBeVisible()
    await expect(page.locator('text=Future')).toBeVisible()
  })

  test('should move task between horizons', async ({ page }) => {
    // Get task from 2-day horizon
    const task = page.locator('[data-testid="2-day-horizon"] [data-testid="task-card"]').first()
    const taskTitle = await task.locator('[data-testid="task-title"]').textContent()

    // Drag to 7-day horizon
    const sevenDay = page.locator('[data-testid="7-day-horizon"]')
    await task.dragTo(sevenDay)

    // Verify task moved
    await expect(page.locator('[data-testid="7-day-horizon"]').locator(`text=${taskTitle}`)).toBeVisible()
    await expect(page.locator('[data-testid="2-day-horizon"]').locator(`text=${taskTitle}`)).not.toBeVisible()
  })

  test('should complete task', async ({ page }) => {
    const task = page.locator('[data-testid="task-card"]').first()
    const taskTitle = await task.locator('[data-testid="task-title"]').textContent()

    // Click complete button
    await task.locator('button:has-text("Complete")').click()

    // Verify task is marked complete
    await expect(task.locator('[data-testid="completed-checkmark"]')).toBeVisible()

    // Verify task moves to completed section or disappears
    await expect(page.locator(`[data-testid="completed-tasks"] text=${taskTitle}`)).toBeVisible()
  })

  test('should handle task blocking', async ({ page }) => {
    // Create a task
    await page.click('button:has-text("Add Task")')
    await page.fill('input[name="title"]', 'Task A')
    await page.click('button[type="submit"]')

    // Create another task that blocks the first
    await page.click('button:has-text("Add Task")')
    await page.fill('input[name="title"]', 'Task B (blocks Task A)')

    // Set blocking relationship
    await page.click('button:has-text("Add Dependency")')
    await page.selectOption('select[name="blocks"]', 'Task A')
    await page.click('button[type="submit"]')

    // Verify blocking indicator on Task A
    const taskA = page.locator('text=Task A').first()
    await taskA.click()

    await expect(page.locator('text=Blocked by')).toBeVisible()
    await expect(page.locator('text=Task B')).toBeVisible()
  })

  test('should show empty state for future horizon', async ({ page }) => {
    // Assuming future horizon is empty in test data
    const futureSection = page.locator('[data-testid="future-horizon"]')

    // Verify empty state
    await expect(futureSection.locator('text=No future tasks')).toBeVisible()
    await expect(futureSection.locator('text=Tasks beyond 7 days will appear here')).toBeVisible()
  })

  test('should filter tasks by status', async ({ page }) => {
    // Click filter dropdown
    await page.click('button:has-text("Filter")')

    // Select completed tasks
    await page.click('text=Completed')

    // Verify only completed tasks shown
    const tasks = page.locator('[data-testid="task-card"]')
    const count = await tasks.count()

    for (let i = 0; i < count; i++) {
      await expect(tasks.nth(i).locator('[data-testid="completed-checkmark"]')).toBeVisible()
    }
  })

  test('should search tasks', async ({ page }) => {
    // Enter search query
    await page.fill('input[placeholder="Search tasks..."]', 'report')

    // Verify filtered results
    const tasks = page.locator('[data-testid="task-card"]')
    const count = await tasks.count()

    for (let i = 0; i < count; i++) {
      const title = await tasks.nth(i).locator('[data-testid="task-title"]').textContent()
      expect(title?.toLowerCase()).toContain('report')
    }
  })

  test('should edit task', async ({ page }) => {
    // Click on task to open details
    await page.locator('[data-testid="task-card"]').first().click()

    // Click edit button
    await page.click('button:has-text("Edit")')

    // Update task
    await page.fill('input[name="title"]', 'Updated Task Title')
    await page.fill('textarea[name="notes"]', 'Updated notes')

    // Save
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=Updated Task Title')).toBeVisible()
  })

  test('should delete task', async ({ page }) => {
    const initialCount = await page.locator('[data-testid="task-card"]').count()

    // Click on task
    const task = page.locator('[data-testid="task-card"]').first()
    const taskTitle = await task.locator('[data-testid="task-title"]').textContent()
    await task.click()

    // Click delete
    await page.click('button:has-text("Delete")')

    // Confirm deletion
    await page.click('button:has-text("Confirm")')

    // Verify task removed
    const newCount = await page.locator('[data-testid="task-card"]').count()
    expect(newCount).toBe(initialCount - 1)
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible()
  })

  test('should auto-adjust horizons based on due date', async ({ page }) => {
    // Create task with due date in 3 days
    await page.click('button:has-text("Add Task")')
    await page.fill('input[name="title"]', 'Task with due date')

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    await page.fill('input[name="due_date"]', threeDaysFromNow.toISOString().split('T')[0])

    await page.click('button[type="submit"]')

    // Task should appear in 7-day horizon (3 days is within 7)
    await expect(
      page.locator('[data-testid="7-day-horizon"]').locator('text=Task with due date')
    ).toBeVisible()
  })

  test('should show overdue indicator', async ({ page }) => {
    // Assuming test data includes overdue tasks
    const overdueTask = page.locator('[data-testid="overdue-task"]').first()

    // Verify overdue indicator
    await expect(overdueTask.locator('[data-testid="overdue-badge"]')).toBeVisible()
    await expect(overdueTask.locator('text=Overdue')).toBeVisible()

    // Verify red styling
    await expect(overdueTask).toHaveClass(/border-error/)
  })

  test('should bulk select and move tasks', async ({ page }) => {
    // Enable selection mode
    await page.click('button:has-text("Select")')

    // Select multiple tasks
    const tasks = page.locator('[data-testid="task-card"]')
    await tasks.nth(0).locator('input[type="checkbox"]').check()
    await tasks.nth(1).locator('input[type="checkbox"]').check()

    // Click bulk move
    await page.click('button:has-text("Move Selected")')

    // Select destination horizon
    await page.click('text=Future')

    // Verify tasks moved
    await expect(
      page.locator('[data-testid="future-horizon"] [data-testid="task-card"]')
    ).toHaveCount.greaterThanOrEqual(2)
  })
})
