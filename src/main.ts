import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './db/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DAX Assignment')
    .setDescription('The dax assignment API description')
    .setVersion('1.0')
    .addTag('DAX')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

    // seeding data in roles & module table
    const seederService = app.get(SeedService);

    // Truncate table
    await seederService.truncateRoles();
    await seederService.truncatePrivileges();
  
    // Run the seeding logic
    await seederService.seedRoles();
    await seederService.seedPrivileges();


  await app.listen(process.env.APP_PORT);
}
bootstrap();
