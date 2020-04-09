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

const buildFilePath = (directoryPath, fileName) => path.join(directoryPath, fileName)

const removeFileExtension = (fileName) => fileName.split('.')[0]

const compileTemplate = (templateContent) => handlebars.compile(templateContent)

const buildContent = (sourceDir, distributionDir, srcFileName, template)=> {
  const srcFilePath = buildFilePath(sourceDir, `${srcFileName}.json`)
  const distFilePath = buildFilePath(distributionDir, `${srcFileName}.html`)

  const content = readFile(srcFilePath, data => template(JSON.parse(data)))

  writeFile(distFilePath, content)
}

const generatePage = (pageName, pageTemplatePath) => {
  const contentDirectoryName = 'pages';
  const pagesSourceDir = srcDirectoryPath(contentDirectoryName)
  const pagesDistributionDir = distDirectoryPath(contentDirectoryName)
  
  const pageTemplate = readFile(pageTemplatePath, compileTemplate)

  createDirectory(pagesDistributionDir)
  buildContent(pagesSourceDir, pagesDistributionDir, pageName, pageTemplate)
}

const generatePosts = (postTemplatePath) => {
  const contentDirectoryName = 'posts';
  const postsSourceDir = srcDirectoryPath(contentDirectoryName)
  const postsDistributionDir = distDirectoryPath(contentDirectoryName)

  const postTemplate = readFile(postTemplatePath, compileTemplate)

  createDirectory(postsDistributionDir)
  readDirectory(postsSourceDir).forEach(post => {
    const postName = removeFileExtension(post)
    buildContent(postsSourceDir, postsDistributionDir, postName, postTemplate)
  })
}

/*---------------------------[Generate Blog Contents]---------------------------*/
const templatesDir = srcDirectoryPath('templates')

generatePage('catalogue', buildFilePath(templatesDir, 'catalogue.handlebars'))
generatePosts(buildFilePath(templatesDir, 'post.handlebars'))
/*------------------------------------[Done]------------------------------------*/
