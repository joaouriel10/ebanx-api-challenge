import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Account } from "../../enterprise/entities/account";
import { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";
import { InvalidDepositAmountError } from "./errors/invalid-deposit-amount-error";

type DepositProps = {
	destination: string;
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

@Injectable()
export class DepositUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute({ amount, destination }: DepositProps): DepositResponse {
		const account = this.accountRepository.findById(destination);

		if (!account) {
			const newAccount = Account.create(
				{
					balance: amount,
				},
				destination,
			);

			this.accountRepository.save(newAccount);

			return right({
				destination: {
					id: newAccount.id.toString(),
					balance: newAccount.balance,
				},
			});
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
