const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const classesRouter = require('./classes.js')
const gymsRouter = require('./gyms.js')
const { restoreUser } = require("../../utils/auth.js");


router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/classes', classesRouter);
router.use('/gyms', gymsRouter);


module.exports = router;