import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { DepositUseCase } from "./deposit";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: DepositUseCase;

describe("Deposit", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new DepositUseCase(inMemoryAccountRepository);
	});

	it("should be able to deposit money", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ amount: 50, destination: account.id });

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toMatchObject({
			destination: {
				id: account.id.toString(),
				balance: account.balance,
			},
		});
	});

	it("should not be able to deposit to a non-existent account", async () => {
		const result = sut.execute({ amount: 50, destination: 999 });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Account not found",
		});
	});

	it("should not be able to deposit to a invalid deposit", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ amount: -50, destination: account.id });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Invalid deposit amount",
		});
	});
});
