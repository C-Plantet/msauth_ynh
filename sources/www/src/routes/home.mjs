import { createRequire } from 'module'
const require = createRequire(import.meta.url);

var express = require('express');
var router = express.Router();
import {getFile,create_DirectoryOrFile,update_DirectoryOrFile,delete_DirectoryOrFile} from '../controllers/file.controller.mjs';


router.post   ( '/editor' , getFile);
router.post   ( '/project', create_DirectoryOrFile);
router.put   ( '/project', update_DirectoryOrFile);
router.delete( '/project', delete_DirectoryOrFile);

export default router;
