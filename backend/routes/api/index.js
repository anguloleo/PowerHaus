const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const gymsRouter = require('./gyms.js');
const classesRouter = require('./classes.js');
const repairRequestsRouter = require('./repairrequests.js')
const { restoreUser } = require("../../utils/auth.js");


router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/gyms', gymsRouter);
router.use('/classes', classesRouter);
router.use('/repair-requests', repairRequestsRouter);


module.exports = router;