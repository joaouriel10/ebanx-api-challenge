import { Controller, HttpCode, Post } from "@nestjs/common";
import { ResetUseCase } from "@/domain/account/application/use-cases/reset";

@Controller("/reset")
export class ResetController {
	constructor(private reset: ResetUseCase) {}

	@Post()
	@HttpCode(200)
	async handle() {
		this.reset.execute();

		return "OK";
	}
}
