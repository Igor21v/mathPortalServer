const fileService = require('../services/fileService')
const fs = require('fs')
const Theme = require('../models/Theme')
const path = require('path')


class ThemeController {

    async createTheme(req, res) {
        try {
            const { name, discription, order, isPublic, hasPicture } = req.body
            const theme = new Theme({ name, discription, order, isPublic, hasPicture })
            await theme.save()
            const folderDir = path.join(req.filePath, 'themes', theme.id)
            fs.mkdirSync(folderDir)
            return res.json('Создание темы успешно завершено')
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getTheme(req, res) {
        try {
            const { showThemes, searchTheme, searchThemeID } = req.query
            console.log("showAll: " + showThemes + " searchTheme: " + searchTheme)
            if (searchThemeID) {
                const theme = await Theme.findById(searchThemeID)
                console.log('Тема найдена' + theme)
                return res.json(theme)
            }
            let themes
            switch (showThemes) {
                case 'all':
                    themes = await Theme.find().sort({ order: 1 })
                    break
                case 'onlyPublic':
                    themes = await Theme.find({ isPublic: "true" }).sort({ order: 1 })
                    break
                case 'onlyDev':
                    themes = await Theme.find({ isPublic: "false" }).sort({ order: 1 })
                    break
            }
            themes = themes.map(theme => {
                theme = JSON.parse(JSON.stringify(theme))
                if (fs.existsSync(path.join(req.filePath, 'themes', theme._id))) {
                    theme.files = fs.readdirSync(path.join(req.filePath, 'themes', theme._id))
                }
                    return theme
            }
            )
            if (searchTheme) {
                themes = themes.filter(theme => theme.name.toLowerCase().includes(searchTheme.toLowerCase()) ||
                    theme.discription.toLowerCase().includes(searchTheme.toLowerCase()))
            }
            console.log('3333' + themes)
            return res.json(themes)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get themes" })
        }
    }

    async postFile(req, res) {
        const file = req.files.file
        try {
            let filePath = path.join(req.filePath, 'themes', req.body.themeId, file.name);
            if (fs.existsSync(filePath)) {
                return res.status(400).json({ message: 'File already exist' })
            }
            /* fs.writeFileSync(filePath, file.data) */
            await file.mv(filePath)
            return res.json("Post file OK")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not post file" })
        }
    }
    async postPicture(req, res) {
        const file = req.files.file
        try {
            let filePath = path.join(req.filePath, 'themes', "themePicture", req.body.themeId + ".jpg");
            /* fs.writeFileSync(filePath, file.data) */
            await file.mv(filePath)
            return res.json("Post file OK")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not post file" })
        }
    }

    async deleteFile(req, res) {
        const { themeId, nameFile } = req.body
        try {
            let filePath = path.join(req.filePath, 'themes', themeId, nameFile);
            fs.unlinkSync(filePath)
            return res.json("Delete file OK")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not delete file" })
        }
    }

    async deleteTheme(req, res) {
        const { id } = req.query
        try {
            console.log(id)
            const theme = await Theme.findOne({ _id: id })
            console.log(theme)
            await theme.remove()
            let filePath = path.join(req.filePath, 'themes', id);
            console.log(filePath)
            fs.rmSync(filePath, { recursive: true })
            return res.json("Delete theme OK")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not delete theme" })
        }
    }



}

module.exports = new ThemeController()
