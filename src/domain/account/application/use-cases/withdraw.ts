import { Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";
import { InsufficientFundsError } from "./errors/insufficient-funds-error";
import { InvalidWithdrawAmountError } from "./errors/invalid-withdraw-amount-error";

type WithdrawProps = {
	destination: string;
	amount: number;
};

type WithdrawResponse = Either<
	AccountNotFoundError | InvalidWithdrawAmountError | InsufficientFundsError,
	{
		origin: {
			id: string;
			balance: number;
		};
	}
>;

@Injectable()
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
			origin: {
				id: account.id.toString(),
				balance: account.balance,
			},
		});
	}
}
