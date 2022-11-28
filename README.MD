npm init --yes
npm install @apollo/server graphql
npm install --save-dev typscript @types/node

create a tsconfig.json file.....touch tsconfig.json
This enables you to configure how TypeScript will compile your code.
add to tsconfig.json
{
  "compilerOptions": {
    "rootDirs": ["src"],
    "outDir": "dist",
    "lib": ["es2020"],
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "types": ["node"]
  }
}


add this to package.json we need to compile typescript and run it
This script tells TS to compile into JS before using node and run that compiled code.
Setting type to module loads your JS files as ES modules and enables you to use top-level await calls
You can run npm start, which should compile and run your empty index.js file
{
  // ...etc.
  "type": "module",
  "scripts": {
    "compile": "tsc",
    "start": "npm run compile && node ./dist/index.js"
  }
  // other dependencies
}
