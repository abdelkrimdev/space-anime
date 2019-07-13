import fs from 'fs'
import handlebars from 'handlebars'
import path from 'path'

const directoryPath = (directoryName) => path.resolve('src', directoryName)
const filePath = (directoryPath, fileName) => path.join(directoryPath, fileName)

const buildTemplate = (templatePath) => {
  fs.readFile(templatePath, 'utf8', (error, content) => {
    if (error) {
      console.log(`An error occurred while reading ${templatePath}, ${error}`)
    }
    if (content) {
      return handlebars.compile(content)
    }
  })
}

// Build templates
const templatesDir = directoryPath('templates')

const postTemplatePath = filePath(templatesDir, 'post.handlebars')
const postTemplate = buildTemplate(postTemplatePath)

// Generate HTML for blog posts
const postsDir = directoryPath('posts')
