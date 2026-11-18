import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test, type Page } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiHar = path.join(__dirname, 'hars', 'backend.har');

const bunName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';
const orderNumber = 12345;
const bunId = '643d69a5c3f7b9001cfa0941';
const fillingId = '643d69a5c3f7b9001cfa0945';

const addIngredient = async (page: Page, name: string): Promise<void> => {
  const ingredientCard = page.getByRole('listitem').filter({ hasText: name });
  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

const openConstructor = async (page: Page): Promise<void> => {
  await page.routeFromHAR(apiHar, {
    url: '**/api/**',
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

  test('открывает модальное окно с деталями выбранного ингредиента', async ({
    page,
  }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();

    const ingredientModal = page.getByRole('dialog');

    await expect(ingredientModal).toBeVisible();
    await expect(
      ingredientModal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(ingredientModal.getByRole('heading', { name: bunName })).toBeVisible();
    await expect(ingredientModal.getByText('Калории, ккал')).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();
    const ingredientModal = page.getByRole('dialog');
    await expect(ingredientModal).toBeVisible();

    await ingredientModal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(ingredientModal).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('link').filter({ hasText: bunName }).click();
    const ingredientModal = page.getByRole('dialog');
    await expect(ingredientModal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 },
    });

    await expect(ingredientModal).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('создает заказ, очищает конструктор и закрывает окно заказа', async ({
    page,
  }) => {
    await authorizeUser(page);

    let orderRequestBody: { ingredients: string[] } | undefined;
    let authorizationHeader: string | undefined;

    page.on('request', (request) => {
      if (request.url().endsWith('/api/orders') && request.method() === 'POST') {
        orderRequestBody = request.postDataJSON() as { ingredients: string[] };
        authorizationHeader = request.headers().authorization;
      }
    });

    await openConstructor(page);
    await expect(page.getByText('Test User')).toBeVisible();

    await addIngredient(page, bunName);
    await addIngredient(page, fillingName);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderModal = page.getByRole('dialog');

    await expect(orderModal).toBeVisible();
    await expect(orderModal.getByText(String(orderNumber))).toBeVisible();
    await expect(orderModal.getByText('идентификатор заказа')).toBeVisible();
    await expect(orderModal.getByText('Ваш заказ начали готовить')).toBeVisible();

    expect(orderRequestBody?.ingredients).toEqual([bunId, fillingId, bunId]);
    expect(authorizationHeader).toBe('Bearer test-access-token');

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await orderModal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(orderModal).toBeHidden();
  });
});
