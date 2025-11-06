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

// Donation create validation
export const donationCreateValidation = validate([
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

// Donation status update validation
export const donationStatusUpdateValidation = validate([
  param('donationId')
    .trim()
    .notEmpty().withMessage('Donation ID is required')
    .isMongoId().withMessage('Invalid donation ID format'),

  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    // Align with Donation model enum: ['pending', 'received', 'distributed']
    .isIn(['pending', 'received', 'distributed']).withMessage('Invalid status value')
]);

// Campaign ID param validation
export const campaignIdParamValidation = validate([
  param('campaignId')
    .trim()
    .notEmpty().withMessage('Campaign ID is required')
    .isMongoId().withMessage('Invalid campaign ID format')
]);