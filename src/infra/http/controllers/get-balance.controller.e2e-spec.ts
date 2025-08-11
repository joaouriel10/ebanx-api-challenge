import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountRepository } from "@/domain/account/application/repositories/account-repository";
import { Account } from "@/domain/account/enterprise/entities/account";
import { AppModule } from "@/infra/app.module";

describe("Get Balance (E2E)", () => {
	let app: INestApplication;
	let database: AccountRepository;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		database = moduleRef.get<AccountRepository>(AccountRepository);
		await app.init();
	});

	test("[GET] /balance", async () => {
		const response = await request(app.getHttpServer()).get(
			"/balance?account_id=1",
		);

		expect(response.status).toBe(404);
		expect(response.text).toBe("0");
	});

	test("[GET] /balance", async () => {
		database.save(Account.create({ balance: 100 }, "1"));

		const response = await request(app.getHttpServer()).get(
			"/balance?account_id=1",
		);

		expect(response.status).toBe(200);
		expect(response.text).toBe("100");
	});
});
