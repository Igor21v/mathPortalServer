const fileService = require('../services/fileService')
const config = require('config')
const fs = require('fs')
const User = require('../models/User')
const File = require('../models/File')
const Theme = require('../models/Theme')
const Uuid = require('uuid')
const path = require('path')


class FileController {
      
    async createTheme(req, res) {
        try {
            const {name, discription, order, isPublic} = req.body
            const theme = new Theme({name, discription, order, isPublic})
            await theme.save()
            const file = {theme: theme.id}
            console.log(file)
            await fileService.createDir(req, file)
            return res.json(theme)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getTheme(req, res) {
        try {
            const {showAll} = req.body
            console.log(req.body)
            console.log(showAll)
            let themes
             if (showAll) {
                themes = await Theme.find().sort({order:1})              
                themes = themes.map( theme =>{
                    const files = JSON.parse(JSON.stringify(theme))
                    files.files=  fs.readdirSync(req.filePath) 
                    console.log(files);
                    return files
                }
                )

            } else { 
                themes = await Theme.find({isPublic: "true"}).sort({order:1})
            }
            return res.json(themes)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Can not get themes"})
        }
    }
}

module.exports = new FileController()
