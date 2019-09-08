import fs from 'fs'
import handlebars from 'handlebars'
import path from 'path'

const SOURCE_DIRECTORY = 'src'
const srcDirectoryPath = (directoryName) => path.resolve(SOURCE_DIRECTORY, directoryName)

const DISTRIBUTION_DIRECTORY = 'dist'
const distDirectoryPath = (directoryName) => path.resolve(DISTRIBUTION_DIRECTORY, directoryName)

const readDirectory = (directoryPath) => {
  try {
    return fs.readdirSync(directoryPath, { encoding: 'utf8' })
  } catch (error) {
    console.log(`An error occurred while listing ${directoryPath}, ${error}`)
  }
}

const createDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)){
    try {
      fs.mkdirSync(directoryPath, { recursive: true })
      console.log(`Successfully created ${directoryPath}`)
    } catch (error) {
      console.log(`An error occurred while creating ${directoryPath}, ${error}`)
    }
  }
}

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
