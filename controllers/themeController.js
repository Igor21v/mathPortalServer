const fs = require('fs')
const Theme = require('../models/Theme')
const path = require('path')
const themeService = require('../services/themeService')


class ThemeController {

    async createTheme(req, res) {
        try {
            const { name, discription } = req.body
            let theme = new Theme({ name, discription })
            await theme.save()
            const folderDir = path.join(req.filePath, 'themes', theme.id)
            fs.mkdirSync(folderDir)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async editTheme(req, res) {
        try {
            /* const { Theme } = req.body */
            let theme = await Theme.findById(req.body._id)
            console.log(theme)
            for (let key in req.body) {
                theme[key] = req.body[key]
            }
            console.log('new object: ' + theme)
            await theme.save()
            return res.json('Изменение темы успешно завершено')
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getTheme(req, res) {
        try {
            const theme = await themeService.getTheme(req)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get theme" })
        }
    }

    async getListThemes(req, res) {
        try {
            const { showThemes, searchTheme } = req.query
            let themes
            switch (showThemes) {
                case 'all':
                    themes = await Theme.find().sort({ order: -1 })
                    break
                case 'onlyPublic':
                    themes = await Theme.find({ isPublic: "true" }).sort({ order: -1 })
                    break
                case 'onlyDev':
                    themes = await Theme.find({ isPublic: "false" }).sort({ order: -1 })
                    break
            }
            if (searchTheme) {
                themes = themes.filter(theme => theme.name.toLowerCase().includes(searchTheme.toLowerCase()) ||
                    theme.discription.toLowerCase().includes(searchTheme.toLowerCase()))
            }
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
                return res.status(400).json({ message: 'Ошибка при добавлении: файл ' + file.name + ' уже существует' })
            }
            /* fs.writeFileSync(filePath, file.data) */
            await file.mv(filePath)
            const theme = await themeService.getTheme(req)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not post file" })
        }
    }
    async postPicture(req, res) {
        const file = req.files.file
        try {
            let theme = await Theme.findById(req.body.themeId)
            if (theme.pictureName !== 'default') {
                let filePath = path.join(req.filePath, 'themes', "themePicture", theme.pictureName + ".jpg");
                fs.unlinkSync(filePath)
            }
            theme.pictureName = req.body.themeId + Date.now()
            let filePath = path.join(req.filePath, 'themes', "themePicture", theme.pictureName + ".jpg");
            await file.mv(filePath)
            await theme.save()
            theme = await themeService.getTheme(req)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not post picture" })
        }
    }
    async deletePicture(req, res) {
        try {
            console.log('req.body.theme._id ' + req.query.themeId)
            let theme = await Theme.findById(req.query.themeId)
            if (theme.pictureName !== 'default') {
                let filePath = path.join(req.filePath, 'themes', "themePicture", theme.pictureName + ".jpg");
                fs.unlinkSync(filePath)
                theme.pictureName = 'default'
                await theme.save()
                theme = await themeService.getTheme(req)
            }
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not delete picture" })
        }
    }

    async deleteFile(req, res) {
        const { themeId, nameFile } = req.query
        try {
            let filePath = path.join(req.filePath, 'themes', themeId, nameFile);
            console.log('filePath: ' + filePath)
            fs.unlinkSync(filePath)
            const theme = await themeService.getTheme(req)
            return res.json(theme)
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
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath, { recursive: true })
            }
            return res.json("Тема успешно удалена")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Ошибка при удалении темы" })
        }
    }



}

module.exports = new ThemeController()
