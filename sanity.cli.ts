
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
// Ensure this value in .env is valid: lowercase, numbers, underscores, dashes.
// Common valid names are 'production', 'development', 'staging'.
// Avoid spaces, uppercase letters, or starting with a tilde for standard user datasets.
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET 

export default defineCliConfig({
  api: {
    projectId: projectId || 'YOUR_PROJECT_ID', // Fallback, update .env
    dataset: dataset || 'production', // Fallback, ensure this is simple and valid like 'production'
  },
  // If you embedded your studio at a different path, update here
  // project: {
  //   basePath: '/studio'
  // }
})
