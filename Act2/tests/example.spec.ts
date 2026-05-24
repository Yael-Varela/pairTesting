import { test, expect } from '@playwright/test';

const pageURL = 'https://demo.playwright.dev/todomvc/#/'

test('Add task',{tag : ['@add']},async ({ page }) => {
  await page.goto(pageURL);
  
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
  const list =  page.getByRole('listitem');
  await expect(list).toHaveCount(2);

  //Verify that the content of the tasks matches the ones created.
  await expect(list.nth(0)).toContainText('Testing homework');
  await expect(list.nth(1)).toContainText('See Mexico become world champion');

  //The page counter should indicate that there are 2 tasks.
  //Locator 3. getByTestId
  await expect (page.getByTestId('todo-count')).toContainText('2');
});


test('Complete tasks',{tag : ['@complete']},async ({ page }) => {
  test.slow();
  await page.goto(pageURL);
  const text = page.getByPlaceholder('What needs to be done?');
  //Create a test task
  await text.fill('Testing homework');
  await text.press('Enter');

});

// test('t4', async ({ page }) => {
//   await page.goto(' https://demo.playwright.dev/todomvc/#/');
// });

// test('t5', async ({ page }) => {
//   await page.goto(' https://demo.playwright.dev/todomvc/#/');
// });
