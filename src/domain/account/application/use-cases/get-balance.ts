import { type Either, left, right } from "@/core/either";
import type { AccountRepository } from "../repositories/account-repository";
import { AccountNotFoundError } from "./errors/account-not-found-error";

type GetBalanceProps = { accountId: string };

type GetBalanceResponse = Either<
	AccountNotFoundError,
	{
		balance: number;
	}
>;

export class GetBalanceUseCase {
	constructor(private accountRepository: AccountRepository) {}

	public execute({ accountId }: GetBalanceProps): GetBalanceResponse {
		const account = this.accountRepository.findById(accountId);

		if (!account) {
			return left(new AccountNotFoundError());
		}

		return right({ balance: account.balance });
	}
}
