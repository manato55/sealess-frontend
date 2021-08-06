require('dotenv').config({ path: `./.env.${process.env.ENVIRONMENT}` })

module.exports = {
  reactStrictMode: true,
  // trailingSlash: true,
}
