const express = require("express");
const res = require("express/lib/response");
const authenticate = require("../authenticate");
const promotionRouter = express.Router();
const Promotion = require("../models/promotion");

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete(authenticate.verifyUser, (req, res) => {
    Promotion.deleteMany().then((promotions) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotions);
    });
  });

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
