import {MicadoBackendApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import { EventCronUnpublishService } from './services';

export {MicadoBackendApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new MicadoBackendApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  const cronService: EventCronUnpublishService = await app.get("services.EventCronUnpublishService")
  await cronService.start()

  return app;
}
