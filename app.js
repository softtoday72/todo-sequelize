const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const port = 3000

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
const routes = require('./routes')
const db = require('./models')
const Todo = db.Todo
const User = db.User
const flash = require('connect-flash')

app.engine('hbs', exphbs({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})