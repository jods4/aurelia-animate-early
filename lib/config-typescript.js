System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [ "dom", "es2017" ]
  },
  map: {
    typescript: 'node_modules/typescript/lib/typescript.js',
    "aurelia-animator-css": "node_modules/aurelia-animator-css/dist/system/aurelia-animator-css.js"
  },
  packages: {
    "src": {
      defaultJSExtensions: true,
      defaultExtension: "ts"
    }
  }
});