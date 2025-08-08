import {
	Account,
	type AccountProps,
} from "@/domain/account/enterprise/entities/account";

export function makeAccount(override: Partial<AccountProps> = {}, id?: number) {
	const account = Account.create(
		{
			balance: 0,
			...override,
		},
		id,
	);

	return account;
}
