import { expect, test } from "@playwright/test";

test("keyboard candidate flow reaches a demo confirmation", async ({ page }) => {
  await page.goto("/careers");

  const apply = page.getByRole("link", {
    name: "Apply for Full-Stack Engineer",
  });
  await apply.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/careers\/full-stack-engineer\/apply$/);
  await expect(
    page.getByRole("heading", {
      name: "Applying for: Full-Stack Engineer",
    }),
  ).toBeVisible();

  await page.getByLabel(/Full name/).fill("Ada Lovelace");
  await page.getByLabel(/Email/).fill("ada@example.com");
  await page.getByLabel(/GitHub URL/).fill("https://github.com/ada");
  await page.getByLabel(/Resume/).setInputFiles({
    name: "resume.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 prototype resume"),
  });
  await page.getByRole("button", { name: "Submit application" }).click();

  await expect(page).toHaveURL(/\/submitted\?/);
  await expect(
    page.getByRole("heading", { name: "Application submitted" }),
  ).toBeVisible();
  await expect(page.getByText("No resume was uploaded")).toBeVisible();
});

test("client validation blocks invalid required data", async ({ page }) => {
  await page.goto("/careers/full-stack-engineer/apply");
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page).toHaveURL(/\/apply$/);
});

test("double activation sends only one request", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/applications", async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        demo: true,
        applicationId: "DEMO-double-submit-test",
        jobSlug: "full-stack-engineer",
        jobTitle: "Full-Stack Engineer",
        submittedAt: "2026-10-02T12:00:00.000Z",
      }),
    });
  });

  await page.goto("/careers/full-stack-engineer/apply");
  await page.getByLabel(/Full name/).fill("Grace Hopper");
  await page.getByLabel(/Email/).fill("grace@example.com");
  await page.getByLabel(/Resume/).setInputFiles({
    name: "resume.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 resume"),
  });

  const submit = page.getByRole("button", { name: "Submit application" });
  await submit.dblclick();
  await expect(page).toHaveURL(/\/submitted\?/);
  expect(requests).toBe(1);
});