export abstract class Entity<T> {
	private _id: number;
	protected props: T;

	get id() {
		return this._id;
	}

	protected constructor(props: T, id?: number) {
		this.props = props;
		this._id = id ?? 1;
	}

	public equals(entity: Entity<any>) {
		if (entity === this) {
			return true;
		}

		if (entity.id === this._id) {
			return true;
		}

		return false;
	}
}
