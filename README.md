It is the educational project from Epam Campus Frontend Specialization

This repository contains the source code for the Capstone project. The application is built using TypeScript and SCSS, and it features a fully automated development environment.

To set up and run project, ensure you have Node.js installed on your computer.

First, download and install all the required tools (including TypeScript, SASS compiler, and linters) by running:
npm install

Once the installation is complete, start the project by running:
npm run dev

This project uses concurrently to run three parallel processes automatically:
SASS Compilation: It watches your src/scss directory and compiles your styles into dist/css/main.css on the fly.
TypeScript Compilation: It watches your .ts files and instantly compiles them into executable JavaScript.
Live Server: It launches a local development server on http://localhost:3000 and opens src/index.html in your default browser. Any changes you make to your code will automatically reload the page.

While npm run dev is all you need for active development, the following scripts are available for maintaining code quality and building for production:
npm run build: Compiles the SCSS and TypeScript once (without watching for future changes), readying the files in the dist folder.
npm run lint: Runs both ESLint (for TypeScript) and Stylelint (for SCSS) to check your code against formatting and quality standards.
npm run lint:scss: Runs Stylelint specifically for your stylesheets and automatically attempts to fix formatting issues (--fix).