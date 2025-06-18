
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    projectId: projectId || 'YOUR_PROJECT_ID', // Fallback, update .env
    dataset: dataset || 'production', // Fallback, update .env
  },
  // If you embedded your studio at a different path, update here
  // project: {
  //   basePath: '/studio'
  // }
})
