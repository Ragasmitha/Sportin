const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// @desc Create opportunity (coach only)
const createOpportunity = async (req, res) => {
  const { title, description, sport, location, deadline, type } = req.body;

  try {
    const opportunity = await Opportunity.create({
      title,
      description,
      sport,
      location,
      deadline,
      type,
      postedBy: req.user._id
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all opportunities
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('postedBy', 'name role sport location')
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single opportunity
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'name role sport location')
      .populate('applicants', 'name email sport');
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Apply to opportunity (athlete only)
const applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    const alreadyApplied = await Application.findOne({
      opportunity: req.params.id,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied' });
    }

    await Application.create({
      opportunity: req.params.id,
      applicant: req.user._id
    });

    opportunity.applicants.push(req.user._id);
    await opportunity.save();

    res.status(201).json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get applicants for an opportunity (coach only)
const getApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ opportunity: req.params.id })
      .populate('applicant', 'name email sport location profilePhoto');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOpportunity, getOpportunities, getOpportunityById, applyToOpportunity, getApplicants };