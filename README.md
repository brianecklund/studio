# Side Brain - Brand & Project Management Portal

This is a Next.js application for Side Brain Studios and their clients to manage brand assets, track projects, and collaborate seamlessly. It uses Next.js, React, ShadCN UI, Tailwind CSS, Sanity.io for content management, and Genkit for AI features.

## Getting Started

Follow these steps to get your local development environment up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js), or yarn/pnpm

### 1. Installation

Clone the repository (if you haven't already) and install the project dependencies:

```bash
npm install
```

### 2. Sanity.io Setup

This project uses Sanity.io as a headless CMS to manage data for clients, brand kits, assets, etc.

*   **Create/Login to Sanity Account:** If you don't have one, create an account at [sanity.io](https://sanity.io).
*   **Initialize Sanity Project (if not done):**
    If you haven't connected this project to a Sanity backend, run the following command in your project's root directory:
    ```bash
    npx sanity init
    ```
    *   Log in or create a Sanity account.
    *   Choose to **"Create new project"**.
    *   Give your project a name.
    *   Select the **"Clean project with no predefined schemas"** template (as schemas are defined within this Next.js app).
    *   Choose your preferred dataset configuration (e.g., dataset name "production", visibility "public" or "private").
    *   When asked for the "Project output path," you can accept the default.
    *   Note down your **Project ID** and **Dataset name**.
*   **Configure Environment Variables:**
    Create a `.env` file in the root of your project (or rename `.env.example` if one exists) and add your Sanity project details:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR_SANITY_PROJECT_ID"
    NEXT_PUBLIC_SANITY_DATASET="YOUR_SANITY_DATASET_NAME"
    NEXT_PUBLIC_SANITY_API_VERSION="2024-05-15" # Use a recent date

    # Optional: For write operations from server-side or authenticated reads.
    # Get this from manage.sanity.io -> API -> Tokens
    # SANITY_API_WRITE_TOKEN="YOUR_SANITY_API_TOKEN_WITH_WRITE_PERMISSIONS"
    ```
    Replace `YOUR_SANITY_PROJECT_ID` and `YOUR_SANITY_DATASET_NAME` with the actual values from your Sanity project.

## Running the Application

### 1. Next.js Development Server

To run the main Next.js application (which includes the embedded Sanity Studio):

```bash
npm run dev
```

This will typically start the server on `http://localhost:9002` (as defined in `package.json`).

*   **Access the Side Brain App:** Open your browser and navigate to `http://localhost:9002`.
*   **Access the Embedded Sanity Studio:** Navigate to `http://localhost:9002/studio`. Log in with your Sanity credentials to manage content.

### 2. Sanity Studio & Schema Management

*   **Embedded Studio:** As mentioned above, the Sanity Studio is embedded and accessible at `/studio` when the Next.js dev server is running.
*   **Standalone Local Sanity Studio (Optional):** For focused schema development or if you prefer the standalone Sanity dev experience:
    ```bash
    npm run sanity:dev
    ```
    This usually starts the studio on `http://localhost:3333`.
*   **Deploying Schema/Configuration Changes:** After making changes to your content schemas (located in `src/schemas/`) or `sanity.config.ts`, you need to deploy these changes to your Sanity project in the cloud:
    ```bash
    npm run sanity:deploy
    ```
    If the Sanity CLI is not installed globally (`npm install -g @sanity/cli`), you can use `npx sanity deploy`.

### 3. Genkit Development Server (for AI Features)

If you are working with AI features powered by Genkit, you'll need to run the Genkit server in a separate terminal:

*   To start Genkit:
    ```bash
    npm run genkit:dev
    ```
*   To start Genkit with auto-reloading on file changes:
    ```bash
    npm run genkit:watch
    ```

## Available Scripts

*   `npm run dev`: Starts the Next.js development server (Turbopack enabled, port 9002).
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server (after running `build`).
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript to check for type errors.
*   `npm run sanity:dev`: Starts the local Sanity Studio development server.
*   `npm run sanity:deploy`: Deploys your Sanity Studio configuration and schemas.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with watch mode.

## Next Steps

Once the application is running and Sanity is configured:
1.  Open the embedded Sanity Studio (`/studio`) and define your content:
    *   Create "Client" documents.
    *   Create "Brand Kit" documents, linking them to clients.
    *   Start adding "Asset" documents, linking them to Brand Kits or Clients.
2.  Begin replacing the `mock-data.ts` usage in the application pages (`src/app/(app)/dashboard/page.tsx`, etc.) with actual data fetched from Sanity using the client at `src/lib/sanity/client.ts`.
```