import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

export type AccountProps = {
	id?: string;
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

	set balance(value: number) {
		this.props.balance = value;
	}

	touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<AccountProps, "createdAt">, id?: string) {
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
