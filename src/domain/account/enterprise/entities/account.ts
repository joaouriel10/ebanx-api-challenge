import { Entity } from "@/core/entities/entity";
import type { Optional } from "@/core/types/optional";

export type AccountProps = {
	id?: number;
	balance: number;
	createdAt: Date;
	updatedAt?: Date | null;
};

export class Account extends Entity<AccountProps> {
	get balance() {
		return this.props.balance;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<AccountProps, "createdAt">, id?: number) {
		const account = new Account(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? null,
			},
			id,
		);

		return account;
	}
}
