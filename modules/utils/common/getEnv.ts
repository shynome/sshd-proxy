export const getEnv = (name: string) => {
  if (process.browser) {
    return undefined
  }
  return process.env[name]
}
