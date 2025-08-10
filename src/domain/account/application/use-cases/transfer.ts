import { type Either, left, right } from "@/core/either";
import type { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";
import { InsufficientFundsError } from "./errors/insufficient-funds-error";
import { InvalidTransferAmountError } from "./errors/invalid-transfer-amount-error";

type TransferProps = {
	origin: string;
	destination: string;
	amount: number;
};

type TransferResponse = Either<
	AccountNotFoundError | InsufficientFundsError | InvalidTransferAmountError,
	{
		origin: {
			id: string;
			balance: number;
		};
		destination: {
			id: string;
			balance: number;
		};
	}
>;

export class TransferUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute({
		origin,
		amount,
		destination,
	}: TransferProps): TransferResponse {
		const account = this.accountRepository.findById(origin);

		if (!account) {
			return left(new AccountNotFoundError());
		}

		const accountDestination = this.accountRepository.findById(destination);

		if (!accountDestination) {
			return left(new AccountNotFoundError());
		}

		if (amount <= 0) {
			return left(new InvalidTransferAmountError());
		}

		if (account.balance < amount) {
			return left(new InsufficientFundsError());
		}

		account.balance -= amount;
		accountDestination.balance += amount;

		this.accountRepository.update(account);
		this.accountRepository.update(accountDestination);

		return right({
			origin: {
				id: account.id.toString(),
				balance: account.balance,
			},
			destination: {
				id: accountDestination.id.toString(),
				balance: accountDestination.balance,
			},
		});
	}
}
