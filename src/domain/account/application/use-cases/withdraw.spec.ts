import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { WithdrawUseCase } from "./withdraw";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: WithdrawUseCase;

describe("Withdraw", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new WithdrawUseCase(inMemoryAccountRepository);
	});

	it("should be able to withdraw money", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ amount: 50, destination: account.id });

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toMatchObject({
			origin: {
				id: account.id.toString(),
				balance: account.balance,
			},
		});
	});

	it("should not be able to withdraw from a non-existent account", async () => {
		const result = sut.execute({
			amount: 50,
			destination: "non-existent-account-id",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Account not found",
		});
	});

	it("should not be able to withdraw from an account with insufficient funds", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ amount: 150, destination: account.id });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Insufficient funds",
		});
	});

	it("should not be able to withdraw an invalid amount", async () => {
		const account = makeAccount({ balance: 100 });

		inMemoryAccountRepository.save(account);

		const result = sut.execute({ amount: -50, destination: account.id });

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Invalid withdraw amount",
		});
	});
});
