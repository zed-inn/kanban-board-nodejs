import { CardService } from "../services/CardService.js";
import { Service } from "../utils/services.js";

export class CardController {
  static MESSAGE = { FETCHED: "Cards fetched" };

  static readToDo = async (req, res) => {
    const page = Number(req.query?.page ?? 1);
    try {
      const result = await CardService.readToDo(page);

      if (result.type === Service.CODE.OK)
        return res.ok(this.MESSAGE.FETCHED, result.values);
      else if (result.reason === Service.ERROR.DB_ERR) return res.serverError();
      else return res.bad(result.reason, result.values);
    } catch (error) {
      return res.serverError();
    }
  };

  static readInProgress = async (req, res) => {
    const page = Number(req.query?.page ?? 1);
    try {
      const result = await CardService.readInProgress(page);

      if (result.type === Service.CODE.OK)
        return res.ok(this.MESSAGE.FETCHED, result.values);
      else if (result.reason === Service.ERROR.DB_ERR) return res.serverError();
      else return res.bad(result.reason, result.values);
    } catch (error) {
      return res.serverError();
    }
  };

  static readDone = async (req, res) => {
    const page = Number(req.query?.page ?? 1);
    try {
      const result = await CardService.readDone(page);

      if (result.type === Service.CODE.OK)
        return res.ok(this.MESSAGE.FETCHED, result.values);
      else if (result.reason === Service.ERROR.DB_ERR) return res.serverError();
      else return res.bad(result.reason, result.values);
    } catch (error) {
      return res.serverError();
    }
  };

  static readInitial = async (req, res) => {
    try {
      const resultTodo = await CardService.readToDo();
      const resultInProgress = await CardService.readInProgress();
      const resultDone = await CardService.readDone();

      const fullDone =
        resultTodo.type === Service.CODE.OK &&
        resultInProgress.type === Service.CODE.OK &&
        resultDone.type === Service.CODE.OK;

      if (fullDone)
        return res.ok(this.MESSAGE.FETCHED, {
          todoCards: resultTodo.values.cards,
          inProgressCards: resultInProgress.values.cards,
          doneCards: resultDone.values.cards,
        });
      else return res.serverError();
    } catch (error) {
      return res.serverError();
    }
  };
}
