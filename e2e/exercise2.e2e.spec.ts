import { test, expect, request, defineConfig } from '@playwright/test';
import * as fs from 'fs';

test("Execute complete test E2E", async ( { request , page} ) => {

    const apiUrl = "https://api.club-administration.qa.qubika.com/api/auth/register"

    const payload = {
        email: `prueba_${Date.now()}@gmail.com`,
        password: "prueba3123",
        roles: ["ROLE_ADMIN"]
      }      

      const response = await request.post(apiUrl, {
        data: payload,
        headers:{
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnF1YmlrYUBxdWJpa2EuY29tIiwiaWF0IjoxNzY0MjA3NjI3LCJleHAiOjE3NjQyOTQwMjd9.qCvEp-iN3iyN19TZBWlmZiw_QOxRu9Hs4WtyJt5zdJBnokl2ztnT2ehHLRAW5mirqimkc_3GgvIAxSM7UuOtFA"
        }
      });
    
      expect(response.status()).toBe(201);
      fs.writeFileSync('credentials.json', JSON.stringify(payload, null, 2));
      console.log(`Usuario creado: ${payload.email}`);

      await page.goto("https://club-administration.qa.qubika.com");      
      await page.waitForTimeout(3000);

      await page.getByPlaceholder("Usuario o correo electrónico").fill(payload.email)
      await page.getByPlaceholder("Contraseña").fill(payload.password)      
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/dashboard/);
      await expect(page.locator("text=Dashboard")).toBeVisible();      
      console.log(`Correct Login ${payload.email}`);

    
      await page.click('text= Tipos de Categorias');
      console.log(`Listado de cat`);
      await page.waitForTimeout(1000);
      await page.locator('button.btn.btn-primary:has-text("Adicionar")').click();     
      
      const nombreCat = `Categoria_${Date.now()}`;
      await expect(page.locator('h1.mat-dialog-title')).toHaveText('Adicionar tipo de categoría');
      const inputCat = page.locator('#input-username');
      await expect(inputCat).toBeVisible();
      await inputCat.fill(nombreCat);

      const btnAceptarCat = page.getByRole('button', { name: 'Aceptar' });      
      await expect(btnAceptarCat).toBeEnabled();
      await btnAceptarCat.click();
      console.log(`Nueva cat insertada`);
      
      const nombreSubCat = `Subcategoria_${Date.now()}`;
      await page.locator('button.btn.btn-primary:has-text("Adicionar")').click();
      await expect(page.locator('h1.mat-dialog-title')).toHaveText('Adicionar tipo de categoría');
      const inputSubCat = page.locator('#input-username');
      await expect(inputSubCat).toBeVisible();
      await inputSubCat.fill(nombreSubCat);
      
      await page.click('label[for="customCheckMain"]');      
      await expect(page.locator('#customCheckMain')).toBeChecked();      
      
      await page.locator('.ng-placeholder', { hasText: 'Seleccione la categoría padre' }).click();
      const parentName = 'En05SW';        
      await page.locator('.ng-option-label', { hasText: parentName }).click();      
      await expect(page.locator('.ng-value-label')).toContainText(parentName);
      
      const btnAceptarSubCat = page.getByRole('button', { name: 'Aceptar' }); 
      await expect(btnAceptarSubCat).toBeEnabled();
      await btnAceptarSubCat.click();

      console.log(`Nueva Subcat insertada`);

      console.log("🎉 TEST E2E COMPLETO Y EXITOSO");

      
});