var express = require('express');
var router = express.Router();
var parser = require('body-parser');
var projectController = require('../controllers/projectController');
var url = require('url');  

/* project/event */
// check uuid in session firstly for every methods


/**
 * PUT: 
 * req: projectId, eventId, userId, update(json)
 *
 * res: N/A
 */
router.put('/event/owner', function(req, res){
	projectController.putEventOwner(req, res);
}); //done

/**
 * POST: 
 * req: projectId, userId, event(json)
 *
 * res: eventId
 */
router.post('/events', function(req, res){
	projectController.createEvents(req, res);
}); // done

/**
 * DELETE: 
 * req: projectId, eventId
 *
 * res: end
 */
router.delete('/events', function(req, res){
	projectController.deleteEvents(req, res);
}); // done

/**
 * GET /projects
 * req: projectId, userId
 *
 * res: project
 			project..
 			memberId[]
 			events[]
 */
router.get('/', function(req, res){
	projectController.getProject(req, res);
}); // done

/**
 * PUT: 
 * req: projectId, userId, update(json)
 *
 * res: project(json)
 */
router.put('/', function(req, res){
	projectController.putProject(req, res);
}); // done

/**
 * POST: 
 * req: userId, project(json)
 *
 * res: projectId
 */
router.post('/', function(req, res){
	projectController.createProject(req, res);
}); // done

/**
 * DELETE: 
 * req: projectId, projectId
 *
 * res: end
 */
router.delete('/', function(req, res){
	projectController.deleteProject(req, res);
});

/**
 * DELETE: 
 * req: projectId, userId, invitedId
 *
 * res: end
 */
// router.post('/invite', function(req, res){
// 	projectController.inviteUser;
// });

router.delete('/members', function(req, res){
	projectController.deleteMembers(req, res);
})


module.exports = router;