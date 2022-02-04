import { createRequire } from 'module'
const require = createRequire(import.meta.url);

var express = require('express');
var router = express.Router();

import { createProject, getProjects,getProjectById,deleteProject,updateProject,getProjectByUserId,deleteProjectFromAllTables,getProjectByName,verifyRequest,sendReq} from '../controllers/project.controller.mjs';

// /api/projects/
router.post('/creation',createProject);
router.get('/', getProjects);
// /api/projects/:projectId
router.post('/id',getProjectById);
router.post('/name',getProjectByName);
router.post('/sendReq',sendReq);
router.post('/verifyRequest',verifyRequest);
router.post('/deleteAll',deleteProjectFromAllTables);

router.get('/users/:UserId',getProjectByUserId);
router.delete('/:id',deleteProject);
router.put('/:id',updateProject);
export default router;
