import { Op } from "sequelize";
import { CARD_GROUPS } from "../constants/groups.config.js";
import db from "../db/pg.js";
import Card from "../models/Card.js";
import { Service } from "../utils/services.js";

export class CardService {
  static PER_PAGE = 30;

  static validate = ({ groupName, title, content, order }) => {
    const result = {
      isValid: false,
      reason: null,
      values: { title, content, groupName, order },
    };

    if (typeof title !== "string" || title.trim().length <= 0) {
      result.reason =
        "Invalid title; Title should be atleast contain one letter";
      delete result.values.title;
    }
    if (typeof content !== "string") {
      result.reason = "Invalid content";
      delete result.values.content;
    }
    if (!Object.values(CARD_GROUPS).includes(groupName)) {
      result.reason = "Invalid group; Must be 'To Do', 'In Progress' or 'Done'";
      delete result.values.groupName;
    }
    if (typeof order !== "number" || isNaN(order)) {
      result.reason = "Invalid order; could be null or a valid number";
      delete result.values.order;
    }

    if (!result.reason) {
      result.isValid = true;
      result.values.title = title.trim();
      result.values.content = content.trim();
    }
    return result;
  };

  // create card
  static create = async (groupName, title, content, order) => {
    const validationResult = this.validate({
      groupName,
      title,
      content,
      order,
    });
    if (!validationResult.isValid)
      return Service.result(
        Service.CODE.FAILED,
        validationResult.reason,
        validationResult.values
      );

    try {
      const card = await Card.create({ groupName, title, content, order });
      const cardJson = card.get({ plain: true });

      return Service.result(Service.CODE.OK, null, cardJson);
    } catch (error) {
      console.log(error);
      return Service.result(Service.CODE.FAILED, Service.ERROR.DB_ERR, {
        error,
      });
    }
  };

  static read = async (page = 1, groupName) => {
    if (typeof page !== "number" || isNaN(page) || page < 1) page = 1;

    try {
      const cards = await Card.findAll({
        where: { groupName },
        order: [["order", "desc"]],
        limit: this.PER_PAGE,
        offset: (page - 1) * this.PER_PAGE,
      });
      const cardJsons = cards.map((c) => {
        c = c.get({ plain: true });
        c.order = Number(c.order);
        return c;
      });

      return Service.result(Service.CODE.OK, null, { cards: cardJsons });
    } catch (error) {
      console.log(error);
      return Service.result(Service.CODE.FAILED, Service.ERROR.DB_ERR, {
        error,
      });
    }
  };

  static readToDo = async (page = 1) => this.read(page, CARD_GROUPS.toDo);
  static readInProgress = async (page = 1) =>
    this.read(page, CARD_GROUPS.inProgress);
  static readDone = async (page = 1) => this.read(page, CARD_GROUPS.done);

  // update card (values and position/order)
  static update = async (id, values = {}) => {
    try {
      return await db.transaction(async (transaction) => {
        const card = await Card.findByPk(id, { transaction });
        if (!card)
          return Service.result(Service.CODE.FAILED, "Invalid Id", {
            id,
            ...values,
          });

        const cardValues = { ...card.get({ plain: true }), ...values };
        const valuesToUpdate = {
          groupName: cardValues?.groupName,
          title: cardValues?.title,
          content: cardValues?.content,
          order: cardValues?.order,
        };

        const validationResult = this.validate({ ...valuesToUpdate });
        if (!validationResult.isValid)
          return Service.result(
            Service.CODE.FAILED,
            validationResult.reason,
            validationResult.values
          );

        await card.update({ ...validationResult.values }, { transaction });
        const cardJson = card.get({ plain: true });

        return Service.result(Service.CODE.OK, null, cardJson);
      });
    } catch (error) {
      console.log(error);
      return Service.result(Service.CODE.FAILED, Service.ERROR.DB_ERR, {
        error,
      });
    }
  };

  // delete card
  static delete = async (id) => {
    try {
      return await db.transaction(async (transaction) => {
        const card = await Card.findByPk(id, { transaction });
        if (!card)
          return Service.result(Service.CODE.FAILED, "Invalid Id", {
            id,
            groupName,
          });

        const cardJson = card.get({ plain: true });
        await card.destroy({ transaction });

        return Service.result(Service.CODE.OK, null, cardJson);
      });
    } catch (error) {
      console.log(error);
      return Service.result(Service.CODE.FAILED, Service.ERROR.DB_ERR, {
        error,
      });
    }
  };
}
