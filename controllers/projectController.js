var Project = require('../models/project');

async function getEvents (req, res) {
	// TODO: check if userId exists in the projectId
	var events;

	try{
		events = await Project.getEvents(req.param('userId'));
		res.status(200).json({events});
	} catch (error) {
		res.status(400).json({error});
	}
}

async function putEvents (req, res) {
	// TODO: check if the user is the project owner
	try{
		await Project.putEvents(req.body.eventId, req.body.update);
		res.status(200);
	} catch (error) {
		res.status(400).json({error});
	}
}



module.exports = {
	getEvents,
	putEvents,
	// createEvents,
	// deleteEvents,
	// getProject,
	// putProject,
	// createProject,
	// deleteProject,
	// inviteUser
}