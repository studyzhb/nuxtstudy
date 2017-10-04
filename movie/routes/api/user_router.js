const router = require('koa-router')();

let userController=require('../../app/controllers/user_controller')

router.get('/getUser',userController.getUser);

router.post('/registerUser',userController.registerUser);

module.exports=router;