const fs = require('fs')

class themeService {

    getTheme(themeId) {
        return new Promise((resolve, rejects) => {
            try {
                let theme = await Theme.findById(themeId)
                console.log('Тема найдена ' + theme.id)
                console.log('Путь ' + fs.existsSync(path.join(req.filePath, 'themes', theme._id)))
                theme = JSON.parse(JSON.stringify(theme))
                if (fs.existsSync(path.join(req.filePath, 'themes', theme._id))) {
                    theme.files = fs.readdirSync(path.join(req.filePath, 'themes', theme._id))
                } else {
                    theme.files = []
                }
                console.log('3333 ' + theme)
            } catch (error) {

            }

        }
        )}

}

module.exports = new themeService()