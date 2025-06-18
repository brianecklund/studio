
import {config} from 'dotenv';
config(); // Load .env file variables into process.env

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './src/schemas' // Path relative to project root

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Explicitly check if the environment variables are loaded.
// This helps in debugging if the .env file is missing or not loaded correctly.
if (!projectId) {
  throw new Error(
    "Sanity config error: `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set. " +
    "Please ensure it is defined in your .env file at the project root " +
    "and that the .env file is being loaded correctly."
  );
}
if (!dataset) {
  throw new Error(
    "Sanity config error: `NEXT_PUBLIC_SANITY_DATASET` is not set. " +
    "Please ensure it is defined in your .env file at the project root " +
    "and that the .env file is being loaded correctly."
  );
}

export default defineConfig({
  basePath: '/studio', // This will be the route for your studio in Next.js
  name: 'side_brain_cms',
  title: 'Side Brain CMS',
  projectId, // Use the resolved projectId
  dataset,   // Use the resolved dataset
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
