import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountRepository } from "@/domain/account/application/repositories/account-repository";
import { Account } from "@/domain/account/enterprise/entities/account";
import { AppModule } from "@/infra/app.module";

describe("Event (E2E)", () => {
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

	test("[POST] /event", async () => {
		const response = await request(app.getHttpServer()).post("/event").send({
			type: "deposit",
			destination: "1",
			amount: 100,
		});

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual({
			destination: {
				id: "1",
				balance: 100,
			},
		});
	});

	test("[POST] /event", async () => {
		database.save(Account.create({ balance: 100 }, "1"));

		const response = await request(app.getHttpServer()).post("/event").send({
			type: "deposit",
			destination: "1",
			amount: 100,
		});

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual({
			destination: {
				id: "1",
				balance: 200,
			},
		});
	});

	test("[POST] /event", async () => {
		database.reset();
		database.save(Account.create({ balance: 100 }, "1"));

		const response = await request(app.getHttpServer()).post("/event").send({
			type: "withdraw",
			origin: "1",
			amount: 100,
		});

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual({
			origin: {
				id: "1",
				balance: 0,
			},
		});
	});

	test("[POST] /event", async () => {
		database.reset();

		const response = await request(app.getHttpServer()).post("/event").send({
			type: "withdraw",
			origin: "1",
			amount: 100,
		});

		expect(response.status).toBe(404);
		expect(response.text).toEqual("0");
	});

	test("[POST] /event", async () => {
		database.reset();

		database.save(Account.create({ balance: 100 }, "1"));

		const response = await request(app.getHttpServer()).post("/event").send({
			type: "transfer",
			origin: "1",
			destination: "2",
			amount: 100,
		});

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual({
			origin: {
				id: "1",
				balance: 0,
			},
			destination: {
				id: "2",
				balance: 100,
			},
		});
	});

	test("[POST] /event", async () => {
		database.reset();

		const response = await request(app.getHttpServer()).post("/event").send({
			type: "transfer",
			origin: "1",
			destination: "2",
			amount: 100,
		});

		expect(response.status).toBe(404);
		expect(response.text).toEqual("0");
	});
});
