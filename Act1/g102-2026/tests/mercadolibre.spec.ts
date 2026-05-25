import { test, firefox, BrowserContext } from '@playwright/test';

test.describe("Browser Context", () => {
  test("mercado libre playwright ", async () => {

    const browser = await firefox.launch();
    const context: BrowserContext = await browser.newContext();
    console.log('browser:', browser.contexts().length);
    const page = await context.newPage();
    await page.goto('https://www.mercadolibre.com.mx/');

    // getByRole()
    const searchInput = await page.getByRole('combobox');
    await searchInput.fill('Laptop');

    // getByText()
    const categoriesText = await page.getByText('Categorías');

    // getByLabel()
    const labelInput = await page.getByLabel('Buscar');

    // getByPlaceholder()
    const placeholderInput = await page.getByPlaceholder('Buscar productos, marcas y más…');

    // getByAltText()
    const logo = await page.getByAltText('Mercado Libre');

    // getByTitle()
    const titleElement = await page.getByTitle(/Mercado Libre/i);

    // getByTestId()
    // mercadoLibre no contiene test ids públicos
    await page.waitForTimeout(5000);
    await context.close();
    await browser.close();

  });
});