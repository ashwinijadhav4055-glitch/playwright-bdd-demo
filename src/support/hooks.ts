import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

BeforeAll(async function () {
  console.log('🚀 Starting Test Suite...');
});

AfterAll(async function () {
  console.log('✅ Test Suite Completed!');
});

Before({ tags: '@ui' }, async function (this: CustomWorld) {
  await this.initBrowser();
});

Before({ tags: '@api' }, async function (this: CustomWorld) {
  await this.initApiContext();
});

After({ tags: '@ui' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    if (this.page && !this.page.isClosed()) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }
  await this.closeBrowser();
});

After({ tags: '@api' }, async function (this: CustomWorld) {
  await this.closeApiContext();
});