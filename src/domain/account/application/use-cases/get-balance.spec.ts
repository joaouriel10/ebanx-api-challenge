import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { GetBalanceUseCase } from "./get-balance";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: GetBalanceUseCase;

describe("Get Balance", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new GetBalanceUseCase(inMemoryAccountRepository);
	});

	it("should be able to get the balance", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ accountId: account.id });

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toMatchObject({
			balance: account.balance,
		});
	});

	it("should not be able to get a non-existent account", async () => {
		const result = sut.execute({ accountId: "non-existent-account-id" });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Account not found",
		});
	});
});
