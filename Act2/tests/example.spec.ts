import { test, expect } from '@playwright/test';

const pageURL = 'https://demo.playwright.dev/todomvc/#/'

test('Add task',{tag : ['@add']},async ({ page }) => {
  await page.goto(pageURL);

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  //Locator 1. getByrole
  await expect(page.getByRole('heading', {name: 'todos'})).toBeVisible(); 
  
  
  //Locator 2. getByPlaceholder
  const text = page.getByPlaceholder('What needs to be done?');

  //Insert two tasks
  await text.fill('Testing homework');
  await text.press('Enter');

  await text.fill('See Mexico become world champion');
  await text.press('Enter');
  
  //Verify the creation of two tasks.
  const list =  page.getByTestId('todo-item');
  await expect(list).toHaveCount(2);

  //Verify that the content of the tasks matches the ones created.
  await expect(list.nth(0)).toContainText('Testing homework');
  await expect(list.nth(1)).toContainText('See Mexico become world champion');

  //The page counter for active task should indicate that there are 2 tasks.
  //Locator 3. getByTestId
  await expect (page.getByTestId('todo-count')).toContainText('2');
});


test('Complete tasks',{tag : ['@complete']},async ({ page }) => {
  test.slow();
  await page.goto(pageURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const text = page.getByPlaceholder('What needs to be done?');
  
  //Create a test task
  await text.fill('Active task: Testing homework');
  await text.press('Enter');

  await text.fill('Completed task : See Mexico become world champion'); 
  await text.press('Enter');
  
  //Locator 4. getByLabel
  await page.getByLabel('Toggle Todo').nth(1).check();
  //Only one remaining active task should stay
  await expect.soft(page.getByTestId('todo-count')).toContainText('1');
  //But we should expect to have 2 tasks (one completed and another one is active)
  await expect.soft(page.getByRole('listitem')).toHaveCount(2);

  //Clicking in the active tasks section
  await page.getByRole('link', { name: 'Active' }).click();
  
  //Locator 5. getByText
  await expect(page.getByText('Active task')).toBeVisible(); //The active task should be visible while the completed should not.
  await expect(page.getByText('Completed task')).not.toBeVisible();
});

// test('t4', async ({ page }) => {
//   await page.goto(' https://demo.playwright.dev/todomvc/#/');
// });

// test('t5', async ({ page }) => {
//   await page.goto(' https://demo.playwright.dev/todomvc/#/');
// });
