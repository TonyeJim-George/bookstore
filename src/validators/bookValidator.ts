import { body } from "express-validator";

export const bookValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long")
    .trim().escape(),
  
//   body("author")
//     .notEmpty()
//     .withMessage("Author is required")
//     .isString().withMessage("Author must be a string")
//     .isLength({ max: 50 })
//     .withMessage("Author must be at most 50 characters long")
//     .trim().escape(),
  
  body("publish_date")
    .optional()
    .isISO8601()
    .withMessage("Published date must be a valid date"),
  
  body("genre")
    .notEmpty().withMessage('Genre is required')
    .isString().withMessage('Genre must be a string')
    .trim().escape(),

    body("author_id")
    .notEmpty().withMessage("Author ID is required") 
    .isInt().withMessage("Author ID must be an integer")
];