import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { TransferUseCase } from "./transfer";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: TransferUseCase;

describe("Transfer", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new TransferUseCase(inMemoryAccountRepository);
	});

	it("should be able to transfer money", async () => {
		const account = makeAccount({ balance: 100 }, 1);
		const accountDestination = makeAccount({ balance: 0 }, 2);

		inMemoryAccountRepository.save(account);
		inMemoryAccountRepository.save(accountDestination);

		const result = sut.execute({
			amount: 50,
			destination: accountDestination.id,
			origin: account.id,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value).toMatchObject({
			origin: {
				id: account.id.toString(),
				balance: account.balance,
			},
			destination: {
				id: accountDestination.id.toString(),
				balance: accountDestination.balance,
			},
		});
	});

	it("should not be able to withdraw from a non-existent origin account", async () => {
		const accountDestination = makeAccount({ balance: 0 });
		inMemoryAccountRepository.save(accountDestination);

		const result = sut.execute({
			amount: 50,
			destination: accountDestination.id,
			origin: 888,
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Account not found",
		});
	});

	it("should not be able to withdraw from a non-existent destination account", async () => {
		const account = makeAccount({ balance: 0 });
		inMemoryAccountRepository.save(account);

		const result = sut.execute({
			amount: 50,
			destination: 999,
			origin: account.id,
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Account not found",
		});
	});

	it("should not be able to withdraw from an account with insufficient funds", async () => {
		const account = makeAccount({ balance: 100 });
		const accountDestination = makeAccount({ balance: 0 });

		inMemoryAccountRepository.save(account);
		inMemoryAccountRepository.save(accountDestination);

		const result = sut.execute({
			amount: 150,
			destination: account.id,
			origin: account.id,
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Insufficient funds",
		});
	});

	it("should not be able to withdraw an invalid amount", async () => {
		const account = makeAccount({ balance: 100 });
		const accountDestination = makeAccount({ balance: 0 });

		inMemoryAccountRepository.save(account);
		inMemoryAccountRepository.save(accountDestination);

		const result = sut.execute({
			amount: -50,
			destination: account.id,
			origin: account.id,
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toMatchObject({
			message: "Invalid transfer amount",
		});
	});
});
