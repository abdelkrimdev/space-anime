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

const readFile = (filePath, contentReader) => {
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
    return contentReader && contentReader(fileContent)
  } catch (error) {
    console.log(`An error occurred while reading ${filePath}, ${error}`)
  }
}

const writeFile = (filePath, content) => {
  fs.writeFile(filePath, content, { encoding: 'utf8' }, error => {
    if (error) {
      console.log(`An error occurred while writing ${filePath}, ${error}`)
    }
    else {
      console.log(`Successfully wrote ${filePath}`)
    }
  })
}

// Build templates
const templatesDir = directoryPath('templates')

const postTemplatePath = filePath(templatesDir, 'post.handlebars')
const postTemplate = buildTemplate(postTemplatePath)

// Generate HTML for blog posts
const postsDir = directoryPath('posts')
