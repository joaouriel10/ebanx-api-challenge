import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";

describe("Reset (E2E)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	test("[POST] /reset", async () => {
		const response = await request(app.getHttpServer()).post("/reset");

		expect(response.status).toBe(200);
		expect(response.text).toBe("OK");
	});
});
