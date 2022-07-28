const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../config/errors");

//************ Get all jobs *************/
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({
    message: "Success",
    count: jobs.length,
    jobs: jobs,
  });
};

//************ Get a single job *************/
const getJob = async (req, res) => {
  const {
    user: { userId: userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    message: "Success",
    job: job,
  });
};

//************ Create a job *************/
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    message: "Success",
    job: job,
  });
};

//************* Update a job **************/
const updateJob = async (req, res) => {
  const {
    body: { company: company, position: position },
    user: { userId: userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate({
    _id: jobId,
    createdBy: userId,
  }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    message: 'success',
    job: job
  });
};

//************* Delete a job **************/
const deleteJob = async (req, res) => {
  const {
    user: { userId: userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    message: "success"
  })
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
