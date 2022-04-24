const fs = require('fs')
const Theme = require('../models/Theme')
const path = require('path')

class themeService {

    getTheme(req) {
        return  new Promise(async(resolve, rejects) => {
            try {
                const { searchThemeID } = req.query
                let theme = await Theme.findById(searchThemeID)
                theme = JSON.parse(JSON.stringify(theme))
                if (fs.existsSync(path.join(req.filePath, 'themes', theme._id))) {
                    theme.files = fs.readdirSync(path.join(req.filePath, 'themes', theme._id))
                } else {
                    theme.files = []
                }
                return resolve(theme)
            } catch (error) {
                return rejects({message: 'Get theme error'})
            }

        }
        )}

}

module.exports = new themeService()