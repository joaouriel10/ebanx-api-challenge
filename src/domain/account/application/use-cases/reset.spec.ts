import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { ResetUseCase } from "./reset";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: ResetUseCase;

describe("Reset", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new ResetUseCase(inMemoryAccountRepository);
	});

	it("should be able to reset", async () => {
		const result = sut.execute();

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAccountRepository.items).toHaveLength(0);
	});
});
