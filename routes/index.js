const authRouter = require("./auth.routes")
const fileRouter = require("./file.routes")
const themeRouter = require("./theme.routes")
const userRoutes = require("./user.routes")
const messageRoutes = require("./message.routes")

const routes = [
 {path: "/api/auth", rout: authRouter},
 {path: "/api/files", rout: fileRouter},
 {path: "/api/theme", rout: themeRouter},
 {path: "/api/user", rout: userRoutes},
 {path: "/api/message", rout: messageRoutes},
]

module.exports = routes