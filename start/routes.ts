import router from '@adonisjs/core/services/router'
const AuthController = () => import('../app/controllers/auth_controller.js')

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router
  .post('/logout', [AuthController, 'logout'])
  .middleware(() => import('#middleware/auth_middleware'))
