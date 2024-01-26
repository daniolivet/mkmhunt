
import { IController } from "../Domain/IController";
import { GetCardOffersUseCase } from "../Application/GetCardOffersUseCase";

export class GetCardOffersController implements IController {

    public constructor(
        private readonly getCardOffersUseCase: GetCardOffersUseCase
    ) {}

    /**
     * Execute the use case.
     */
    public execute(): void
    {
        this.getCardOffersUseCase.execute();
    }

}
