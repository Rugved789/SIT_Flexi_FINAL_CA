// Simple request validators for core endpoints.
// These are lightweight and avoid adding new dependencies.

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  if (!['donor','ngo','admin'].includes(role)) {
    // allow undefined role for defaulting, but if provided it must be valid
    if (role !== undefined && role !== null && role !== '') {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }
  }
  // basic email format sanity check
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  next();
};

export const validateCampaign = (req, res, next) => {
  const { title, description, goalAmount } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }
  if (goalAmount === undefined || goalAmount === null || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
    return res.status(400).json({ message: 'goalAmount must be a positive number.' });
  }
  next();
};

export const validateDonation = (req, res, next) => {
  const { campaignId, amount, donationType, itemDetails } = req.body;
  if (!campaignId) return res.status(400).json({ message: 'campaignId is required.' });
  if (!donationType || !['money','items'].includes(donationType)) return res.status(400).json({ message: 'donationType must be either "money" or "items".' });
  if (donationType === 'money') {
    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ message: 'amount must be a positive number for money donations.' });
  } else {
    // items
    if (!itemDetails || String(itemDetails).trim().length === 0) return res.status(400).json({ message: 'itemDetails is required for item donations.' });
  }
  next();
};
