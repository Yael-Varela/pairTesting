import { test, expect } from '@playwright/test';

const pageURL = 'https://demo.playwright.dev/todomvc/#/'

test('T1: Add tasks',{tag : ['@add']},async ({ page }) => {
  await page.goto(pageURL);
  expect(await page.title()).toBeTruthy();


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


test('T2: Complete tasks',{tag : ['@complete']},async ({ page }) => {
  test.slow();
  await page.goto(pageURL);

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
  await expect.soft(page.getByTestId('todo-item')).toHaveCount(2);

  //Clicking in the active tasks section
  await page.getByRole('link', { name: 'Active' }).click();
  
  //Locator 5. getByText
  await expect(page.getByText('Active task')).toBeVisible(); //The active task should be visible while the completed should not.
  await expect(page.getByText('Completed task')).not.toBeVisible();
});

test('T3: Edit tasks',{tag : ['@edit']},async ({ page }) => {
  test.fixme(false, 'Issue: false fixme test probe'); 
  await page.goto(pageURL);
  expect (page.url()).toContain('todomvc');

  //Insert a task
  const text = page.getByPlaceholder('What needs to be done?');
  await text.fill('This is the original third test'); //Original text
  await text.press('Enter');

  //Edit this task
  const textField = page.getByText('This is the original third test');
  // Double click to edit
  await textField.dblclick(); 

  //This field will be changed
  const inputField = page.locator('input.edit');
  await expect(inputField).toBeEditable();
  await expect(inputField).toBeVisible();
  
  await inputField.fill('This task was edited'); //Edited test
  await inputField.press('Enter');

  //The original text should not be visible since it was changed.
  await expect(page.getByText('This is the original third test')).not.toBeVisible();
});

test('T4: Delete tasks',{tag : ['@delete']},async ({ page }) => {
  test.fixme(false, 'Issue: false fixme test probe'); 
  await page.goto(pageURL);
  //Insert a task
  const text = page.getByPlaceholder('What needs to be done?');
  await text.fill('Delete this test');
  await text.press('Enter');
  const item = page.getByTestId('todo-item').first();
  await expect(item.getByTestId('todo-title')).toHaveText('Delete this test');

  //To delete an item it's needed to hover over it, since it will reveal the destroy button.
  await item.hover();
  //Delete
  await item.getByRole('button', {name: 'Delete'}).click();

  //Verification of a correct deletion
  await expect.soft(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByText('Delete this test')).not.toBeVisible();
});

test('T5: Clear completed tasks',{tag : ['@clear']},async ({ page }) => {
  await page.goto(pageURL);
  await expect(page).toHaveTitle(/TodoMVC/);
  const text = page.getByPlaceholder('What needs to be done?');

  //Insert two tasks
  await text.fill('Clear 1');
  await text.press('Enter');

  await text.fill('Clear 2');
  await text.press('Enter');
  //Complete the tasks
  await page.getByLabel('Toggle Todo').nth(0).check();
  await page.getByLabel('Toggle Todo').nth(1).check();
  
  await expect(page.locator('li.completed')).toHaveCount(2);
  await expect.soft(page.getByTestId('todo-count')).toContainText('0');

  //Clear
  const clear = page.getByRole('button', { name: 'Clear completed' });
  await expect(clear).toBeVisible();
  await clear.click();

  //There shouldn't be any tasks in the todo items
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(clear).not.toBeVisible();
});
