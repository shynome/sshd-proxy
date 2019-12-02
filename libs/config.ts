
import path from 'path'
export const apps_filepath = path.join(process.cwd(), "data/app.json")

export const dev = !/production/i.test(process.env.NODE_ENV)
