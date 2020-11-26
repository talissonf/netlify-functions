const sass = require('sass')
const path = require('path')
const fs = require('fs')
const themesPath = path.resolve(__dirname, '../../../node_modules/@ecomplus/storefront-template/template/scss/themes/')

exports.handler = async (event) => {
  console.log(event)
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    }
  }

  const { custom, bootswatch } = event.queryStringParameters
  let style = ''
  let boostrapVars = fs.readFileSync(path.resolve(__dirname, '../../../node_modules/@ecomplus/storefront-twbs/scss/_variables.scss'))
  boostrapVars += ''

  ;[bootswatch, custom].forEach((theme) => {
    ;['_variables.scss', '_custom.scss'].forEach((file) => {
      try {
        const filePath = path.resolve(`${themesPath}/${theme}/${file}`)
        boostrapVars += fs.readFileSync(filePath).toString('utf8')
      } catch (error) {
        // todo
        console.error('Theme not found: ', theme, error.toString())
      }
    })
  })

  style += sass.renderSync({
    data: boostrapVars
  }).css.toString()

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/css'
    },
    statusCode: 200,
    body: style,
  }
}