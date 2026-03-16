import Loan from "../models/Loan.js";
import { calculateEMI } from "../services/emiCalculator.js";

// @desc    Create new loan
// @route   POST /api/loans
// @access  Customer
export const createLoan = async (req, res) => {
  try {
    const { amount, interestRate, tenure } = req.body;

    if (!amount || !interestRate || !tenure) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emi = calculateEMI(amount, interestRate, tenure);
    const totalPayable = emi * tenure;
    const remainingAmount = totalPayable;

    const loan = await Loan.create({
      customer: req.user._id,
      amount,
      interestRate,
      tenure,
      emi,
      totalPayable,
      remainingAmount,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Failed to create loan" });
  }
};

// @desc    Approve or reject loan
// @route   PUT /api/loans/:id/status
// @access  Admin / Agent
export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = status;
    loan.approvedBy = req.user._id;
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update loan status" });
  }
};

// @desc    Get loans
// @route   GET /api/loans
// @access  All (role-based)
export const getLoans = async (req, res) => {
  try {
    let loans;

    if (req.user.role === "customer") {
      loans = await Loan.find({ customer: req.user._id });
    } else {
      loans = await Loan.find().populate("customer", "name email");
    }

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};
