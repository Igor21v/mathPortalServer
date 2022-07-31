const fs = require('fs')
const Theme = require('../models/Theme')
const path = require('path')
const themeService = require('../services/themeService')
const fsPromises = fs.promises;


class ThemeController {

    async createTheme(req, res) {
        try {
            const { name, discription } = req.body
            let theme = new Theme({ name, discription })
            await theme.save()
            const folderDir = path.join(req.filePath, 'themes', theme.id)
            await fsPromises.mkdir(folderDir)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async editTheme(req, res) {
        try {
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
            const { showThemes, searchTheme, page } = req.query
            const amountOfPage = 20
            let themeList
            let amount
            const findString = { $or: [{ name: new RegExp(`${searchTheme}`, 'i') }, { discription: new RegExp(`${searchTheme}`, 'i') }] }
            switch (showThemes) {
                case 'all':
                    if (searchTheme) {
                        themeList = await Theme.find(findString).sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find(findString).count()
                    } else {
                        themeList = await Theme.find().sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find().count()
                    }
                    break
                case 'onlyPublic':
                    if (page === 'all') {
                        themeList = await Theme.find({ $and: [{ isPublic: "true" }, findString] }).sort({ order: -1, _id: 1 })
                        amount = await Theme.find({ $and: [{ isPublic: "true" }, findString] }).count()
                        break
                    }
                    if (searchTheme) {
                        themeList = await Theme.find({ $and: [{ isPublic: "true" }, findString] }).sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find({ $and: [{ isPublic: "true" }, findString] }).count()
                    } else {
                        themeList = await Theme.find({ isPublic: "true" }).sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find({ isPublic: "true" }).count()
                    }
                    break
                case 'onlyDev':
                    if (searchTheme) {
                        themeList = await Theme.find({ $and: [{ isPublic: "false" }, findString] }).sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find({ $and: [{ isPublic: "false" }, findString] }).count()
                    } else {
                        themeList = await Theme.find({ isPublic: "false" }).sort({ order: -1, _id: 1 }).skip((page - 1) * amountOfPage).limit(amountOfPage)
                        amount = await Theme.find({ isPublic: "false" }).count()
                    }
                    break
            }
            console.log('amount  ' + JSON.stringify(amount))
            const response = {
                themeList,
                amount
            }
            return res.json(response)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get themes" })
        }
    }

    async postFile(req, res) {

        try {
            const file = req.files.file
            let filePath = path.join(req.filePath, 'themes', req.body.themeId, file.name);
            if (fs.existsSync(filePath)) {
                return res.status(400).json({ message: 'Ошибка при добавлении: файл ' + file.name + ' уже существует' })
            }
            await file.mv(filePath)
            const theme = await themeService.getTheme(req)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not post file" })
        }
    }
    async postPicture(req, res) {
        try {
            const file = req.files.file
            let theme = await Theme.findById(req.body.themeId)
            if (theme.pictureName !== 'default') {
                let filePath = path.join(req.filePath, 'themes', "themePicture", theme.pictureName + ".jpg");
                await fsPromises.unlink(filePath)
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
                await fsPromises.unlink(filePath)
                theme.pictureName = 'default'
                await theme.save()
            }
            theme = await themeService.getTheme(req)
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
            await fsPromises.unlink(filePath)
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
            const theme = await Theme.findOne({ _id: id })
            if (theme.pictureName !== 'default') {
                let filePathPicture = path.join(req.filePath, 'themes', "themePicture", theme.pictureName + ".jpg");
                await fsPromises.unlink(filePathPicture)
            }
            await theme.remove()
            let filePath = path.join(req.filePath, 'themes', id);
            if (fs.existsSync(filePath)) {
                await fsPromises.rm(filePath, { recursive: true })
            }
            return res.json("Тема успешно удалена")
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Ошибка при удалении темы" })
        }
    }



}

module.exports = new ThemeController()
