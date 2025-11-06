import pkg from 'express-validator';
const { body, param, validationResult } = pkg;

// Helper to run validations and format errors
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      error: {
        message: 'Validation failed',
        status: 400,
        timestamp: new Date().toISOString(),
        details: formattedErrors
      }
    });
  };
};

// Auth validations
export const registerValidation = validate([
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
  
  body('role')
    .optional()
    .trim()
    .isIn(['donor', 'ngo', 'admin']).withMessage('Invalid role specified')
]);

// Campaign validations
export const campaignValidation = validate([
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  
  body('goalAmount')
    .notEmpty().withMessage('Goal amount is required')
    .isFloat({ min: 0.01 }).withMessage('Goal amount must be a positive number')
    .toFloat(),
  
  body('endDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('End date must be in the future');
      }
      return true;
    })
]);

// Donation validations
export const donationValidation = validate([
  body('campaignId')
    .trim()
    .notEmpty().withMessage('Campaign ID is required')
    .isMongoId().withMessage('Invalid campaign ID format'),
  
  body('donationType')
    .trim()
    .notEmpty().withMessage('Donation type is required')
    .isIn(['money', 'items']).withMessage('Donation type must be either "money" or "items"'),
  
  body('amount')
    .if(body('donationType').equals('money'))
    .notEmpty().withMessage('Amount is required for money donations')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number')
    .toFloat(),
  
  body('itemDetails')
    .if(body('donationType').equals('items'))
    .trim()
    .notEmpty().withMessage('Item details are required for item donations')
    .isLength({ min: 10, max: 1000 }).withMessage('Item details must be between 10 and 1000 characters')
]);

// Campaign update validation (similar to creation but all fields optional)
export const campaignUpdateValidation = validate([
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  
  body('goalAmount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Goal amount must be a positive number')
    .toFloat(),
  
  body('endDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('End date must be in the future');
      }
      return true;
    })
]);

// ID parameter validation for routes with :id
export const idParamValidation = validate([
  param('id')
    .trim()
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('Invalid ID format')
]);