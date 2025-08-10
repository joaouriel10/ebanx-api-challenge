import { type Either, left, right } from "@/core/either";
import type { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";
import { InvalidDepositAmountError } from "./errors/invalid-deposit-amount-error";

type DepositProps = {
	destination: number;
	amount: number;
};

type DepositResponse = Either<
	AccountNotFoundError | InvalidDepositAmountError,
	{
		destination: {
			id: string;
			balance: number;
		};
	}
>;

export class DepositUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute({ amount, destination }: DepositProps): DepositResponse {
		const account = this.accountRepository.findById(destination);

		if (!account) {
			return left(new AccountNotFoundError());
		}

		if (amount <= 0) {
			return left(new InvalidDepositAmountError());
		}

		account.balance += amount;

		return right({
			destination: {
				id: account.id.toString(),
				balance: account.balance,
			},
		});
	}
}
