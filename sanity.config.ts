
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './src/schemas' // We'll create this

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio', // This will be the route for your studio in Next.js
  name: 'side_brain_cms',
  title: 'Side Brain CMS',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(), // For GROQ query testing
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft', // We can set up Next.js draft mode later
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
