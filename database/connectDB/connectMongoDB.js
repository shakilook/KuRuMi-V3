module.exports = async function (uriConnect) {
	const mongoose = require("mongoose");

	const threadModel = require("../models/mongodb/thread.js");
	const userModel = require("../models/mongodb/user.js");
	const dashBoardModel = require("../models/mongodb/userDashBoard.js");
	const globalModel = require("../models/mongodb/global.js");

	try {
		await mongoose.connect(uriConnect); // ✅ FIXED (no options)

		console.log("✅ MongoDB Connected");
	} catch (err) {
		console.error("❌ MongoDB Connection Error:", err);
	}

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel
	};
};
