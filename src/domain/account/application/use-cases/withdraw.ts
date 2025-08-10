import { type Either, left, right } from "@/core/either";
import type { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";
import { InsufficientFundsError } from "./errors/insufficient-funds-error";
import { InvalidWithdrawAmountError } from "./errors/invalid-withdraw-amount-error";

type WithdrawProps = {
	destination: number;
	amount: number;
};

type WithdrawResponse = Either<
	AccountNotFoundError | InvalidWithdrawAmountError | InsufficientFundsError,
	{
		destination: {
			id: string;
			balance: number;
		};
	}
>;

export class WithdrawUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute({ amount, destination }: WithdrawProps): WithdrawResponse {
		const account = this.accountRepository.findById(destination);

		if (!account) {
			return left(new AccountNotFoundError());
		}

		if (amount <= 0) {
			return left(new InvalidWithdrawAmountError());
		}
		if (account.balance < amount) {
			return left(new InsufficientFundsError());
		}

		account.balance -= amount;

		return right({
			destination: {
				id: account.id.toString(),
				balance: account.balance,
			},
		});
	}
}
