
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET // Ensure this value in .env is valid: lowercase, numbers, underscores, dashes.

export default defineCliConfig({
  api: {
    projectId: projectId || 'YOUR_PROJECT_ID', // Fallback, update .env
    dataset: dataset || 'production', // Fallback, update .env. 'production' is a valid default.
  },
  // If you embedded your studio at a different path, update here
  // project: {
  //   basePath: '/studio'
  // }
})
