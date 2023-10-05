const Admin = require("../models/ClinicAdmin");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const HealthPackage = require("../models/HealthPackage");

// View All Packages
const getPackages = async (req, res) => {
	const packages = await HealthPackage.find({});
	res.status(200).json(packages);
};

// Update Package
const updatePackage = async (req, res) => {
	try {
		const { id } = req.params;
		const filter = { _id: id };

		const packageExists = await HealthPackage.findOne(filter);
		if (!packageExists) {
			throw new Error("This package does not exist");
		}
		const update = req.body;
		const updatedPackage = await HealthPackage.updateOne(filter, update);
		res.status(200).json(updatedPackage);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// add Package
const addPackage = async (req, res) => {
	try {
		const { name } = req.body;
		// Check if the package already exists
		//$or: [{ name }]
		const packageExists = await HealthPackage.findOne({ name: name.toLowerCase() });
		if (packageExists) {
			throw new Error("A package with this name already exists");
		}
		const addedPackage = {
			...req.body,
			name: name.toLowerCase(),
		};
		const package = await HealthPackage.create(addedPackage);

		res.status(200).json(package);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// delete Package
const deletePackage = async (req, res) => {
	try {
		const { id } = req.params;
		const filter = { _id: id };

		const deletedPackage = await HealthPackage.deleteOne(filter);
		res.status(200).json(deletedPackage);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// Add an Admin
const addAdmin = async (req, res) => {
	try {
		const adminData = req.body;

		const existingAdmin = await Admin.findOne({ email: adminData.username });

		if (existingAdmin) {
			res.status(400).json({ error: "Admin with this username already exists" });
		}

		const newAdmin = new Admin(adminData);
		await newAdmin.save();

		res.status(200).json({ message: "Admin added successfully", admin: newAdmin });
	} catch (error) {
		res.status(500).json({ error: "Failed to add the admin" });
	}
};

// Delete a specific Admin
const deleteAdmin = async (req, res) => {
	try {
		const { id } = req.params;

		const admin = await Admin.findOne({ _id: id });

		if (admin) {
			await admin.remove();
			res.status(200).json({ message: "Admin deleted successfully" });
		} else {
			res.status(404).json({ error: "Admin not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to delete the admin" });
	}
};

// Delete a specific Patient
const deletePatient = async (req, res) => {
	try {
		const { id } = req.params;

		const patient = await Patient.findOne({ _id: id });

		if (patient) {
			await patient.remove();
			res.status(200).json({ message: "Patient deleted successfully" });
		} else {
			res.status(404).json({ error: "Patient not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to delete the patient" });
	}
};

// Delete a specific Doctor
const deleteDoctor = async (req, res) => {
	try {
		const { id } = req.params;

		const doctor = await Doctor.findOne({ _id: id });

		if (doctor) {
			await doctor.remove();
			res.status(200).json({ message: "Doctor deleted successfully" });
		} else {
			res.status(404).json({ error: "Doctor not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to delete the doctor" });
	}
};

// Get all doctor applications
const getApplications = async (req, res) => {
	try {
		const applications = await Doctor.find({
			$or: [{ registrationStatus: "pending" }, { registrationStatus: "declined" }],
		}).toArray();
		res.status(200).json(applications);
	} catch (error) {
		console.log("Error fetching doctor applications");
		res.status(500).json({ error: "Could not find any applications" });
	}
};

// View Doctor Application Info
const getApplicationInfo = async (req, res) => {
	try {
		const { id } = req.params;
		const application = await Doctor.findOne({ _id: id });

		res.status(200).json(application);
	} catch (error) {
		res.status(500).json({ error: "Could not retrieve application" });
	}
};

// Handle doctor application
const handleApplication = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const filter = { _id: id };
		const update = { $set: { registrationStatus: status } };

		const handledApplication = Doctor.updateOne(filter, update);

		res.status(200).json({ response: "Successfully handled application" });
	} catch (error) {
		res.status(500).json({ error: "Could not update application status" });
	}
};

module.exports = {
	getPackages,
	updatePackage,
	addPackage,
	deletePackage,
	getApplications,
	getApplicationInfo,
	handleApplication,
	addAdmin,
	deleteAdmin,
	deletePatient,
	deleteDoctor,
};