import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test, type Page } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ingredientsHar = path.join(__dirname, 'fixtures', 'ingredients.har');

const bunName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';
const orderNumber = 12345;

const addIngredient = async (page: Page, name: string): Promise<void> => {
  const ingredientCard = page.getByRole('listitem').filter({ hasText: name });
  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

const openConstructor = async (page: Page): Promise<void> => {
  await page.routeFromHAR(ingredientsHar, {
    url: '**/api/ingredients',
    notFound: 'abort',
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  await expect(page.getByText(bunName)).toBeVisible();
};

const authorizeUser = async (page: Page): Promise<void> => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      }),
    });
  });
};

test.describe('Конструктор бургера', () => {
  test('добавляет булку и начинку из списка в конструктор', async ({ page }) => {
    await openConstructor(page);

    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });

    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(constructor.getByText(fillingName)).toBeVisible();
  });

  test('открывает модальное окно с деталями ингредиента', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: bunName })).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page
      .locator('[class*="modal-overlay__overlay"]')
      .click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('создает заказ, очищает конструктор и закрывает окно заказа', async ({
    page,
  }) => {
    await authorizeUser(page);

    let orderRequestBody: { ingredients: string[] } | undefined;
    let authorizationHeader: string | undefined;

    await page.route('**/api/orders', async (route) => {
      const request = route.request();
      orderRequestBody = request.postDataJSON() as { ingredients: string[] };
      authorizationHeader = request.headers().authorization;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный бургер',
          order: {
            _id: 'test-order-id',
            status: 'done',
            name: 'Краторный бургер',
            createdAt: '2026-11-15T08:00:00.000Z',
            updatedAt: '2026-11-15T08:00:00.000Z',
            number: orderNumber,
            ingredients: [
              '643d69a5c3f7b9001cfa0941',
              '643d69a5c3f7b9001cfa0945',
              '643d69a5c3f7b9001cfa0941',
            ],
          },
        }),
      });
    });

    await openConstructor(page);
    await expect(page.getByText('Test User')).toBeVisible();

    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(String(orderNumber))).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

    expect(orderRequestBody?.ingredients).toEqual([
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0945',
      '643d69a5c3f7b9001cfa0941',
    ]);
    expect(authorizationHeader).toBe('Bearer test-access-token');

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByText(String(orderNumber))).toBeHidden();
    await expect(page.getByText('идентификатор заказа')).toBeHidden();
  });
});
