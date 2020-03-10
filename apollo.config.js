module.exports = {
  client: {
    service: {
      name: "lcoal server",
      localSchemaFile: "modules/graphql/codegen/schema.json"
    },
    includes: ["./pages/**/*.{ts,tsx}"]
  }
}
