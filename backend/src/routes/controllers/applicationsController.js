const Application = require('../models/Application');

// Student creates application
exports.create = async (req, res) => {
  const {
    name,
    department,
    year,
    subject,
    body,
    phoneNumber
  } = req.body;

  const studentEmail = req.user.email;

  try {
    const app = new Application({
      studentEmail,
      name,
      department,
      year,
      subject,
      phoneNumber,
      content: body,          // map frontend "body" → backend "content"
      stage: 'advisor',       // default starting stage
      status: 'pending'       // default status
    });

    await app.save();
    res.status(201).json(app);
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// List applications
exports.list = async (req, res) => {
  try {
    let apps;
    if (req.user.role === 'student') {
      apps = await Application.find({ studentEmail: req.user.email });
    } else {
      apps = await Application.find();
    }
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update status (approve/reject/advance)
exports.updateStatus = async (req, res) => {
  const { action } = req.body;
  const { id } = req.params;

  try {
    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    const role = req.user.role;

    if (role === "advisor" && action === "approve") {
  app.advisorStatus = "approved";
  app.stage = "hod";
  app.status = "pending";
}
if (role === "hod" && action === "approve") {
  app.hodStatus = "approved";
  app.stage = "principal";
  app.status = "pending";
}
if (role === "principal" && action === "approve") {
  app.principalStatus = "approved";
  app.status = "approved"; // final
}


if (role === "advisor" && action === "reject") {
  app.advisorStatus = "rejected";
  app.status = "rejected";
}
if (role === "hod" && action === "reject") {
  app.hodStatus = "rejected";
  app.status = "rejected";
}
if (role === "principal" && action === "reject") {
  app.principalStatus = "rejected";
  app.status = "rejected";
}



    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




// Advisor views
exports.listAdvisorPending = async (req, res) => {
  const apps = await Application.find({ stage: "advisor", status: "pending" });
  res.json(apps);
};

exports.listAdvisorApproved = async (req, res) => {
  const apps = await Application.find({ advisorStatus: "approved" });
  res.json(apps);
};

exports.listAdvisorRejected = async (req, res) => {
  const apps = await Application.find({ advisorStatus: "rejected" });
  res.json(apps);
};

// HOD views
exports.listHODPending = async (req, res) => {
  const apps = await Application.find({ stage: "hod", status: "pending" });
  res.json(apps);
};

exports.listHODApproved = async (req, res) => {
  const apps = await Application.find({ hodStatus: "approved" });
  res.json(apps);
};

exports.listHODRejected = async (req, res) => {
  const apps = await Application.find({ hodStatus: "rejected" });
  res.json(apps);
};

// Principal views
exports.listPrincipalPending = async (req, res) => {
  const apps = await Application.find({ stage: "principal", status: "pending" });
  res.json(apps);
};

exports.listPrincipalApproved = async (req, res) => {
  const apps = await Application.find({ principalStatus: "approved" });
  res.json(apps);
};

exports.listPrincipalRejected = async (req, res) => {
  const apps = await Application.find({ principalStatus: "rejected" });
  res.json(apps);
};
