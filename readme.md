# Typescript support
Install dependencies
```
npm i typescript ts-loader -D
```
webpack configuration in webpack.config.js
```
// ts loader for typescript
{
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
},
resolve: {
    extensions: [
        //required for ts imports
        ".tsx", ".ts", 
        //required for js imports (mostly in webpack dev self dependency)
        '.js']
}
```
# Less support
Install dependencies
```
npm i less less-loader css-loader style-loader -D
```
Create tsexternals.d.ts with following content
```
declare module '*.less'
```
tsconfig configurations
```
"includes" : ["./tsexternals.d.ts"],
```
webpack configurations.
```
// less support for project
// chain less -> css loader (module support) -> style loader (inject styles tag into DOM)
{
    test: /\.less$/,
    include: [path.join(__dirname, "/src")],
    use: [
        {loader: "style-loader"},
        {
        loader: "css-loader",
        options: {
            sourceMap: true,
            modules: true,
            localIdentName: "[local]___[hash:base64:5]"
        }
        },
        {loader: "less-loader"}
    ]
},
```

# Antd support
Install dependencies
```
npm i @voplus/antd ts-import-plugin -D
```
webpack configurations
```
// Add following to beginning of webpack.config.js
const tsImportPlugin = require('ts-import-plugin');

// Add following options to ts-loader rules
options: 
{
    getCustomTransformers: () => ({
    before: [ tsImportPlugin({
        libraryDirectory: 'es',
        libraryName: '@voplus/antd',
        style: true}) 
    ]})
}

// As antd does not support css module (https://segmentfault.com/q/1010000011170368)
// Add following additional less loader 
// less support for antd
// javascriptEnabled are required for antd
{
    test: /\.less$/,
    include: [path.join(__dirname, "/node_modules/@voplus/antd")],
    use: [
        {loader: "style-loader"},
        {loader: "css-loader"},
        {loader: "less-loader", options:  { javascriptEnabled: true}}
    ]
}   
```

Override antd style reference
https://stackoverflow.com/questions/44817981/how-to-override-antd-style-with-dva

## Theme
### Override less variables
modify '/src/style/theme.js'

### Override antd styles in components with modular less
modular css/less will generate a unique class name and make it difficult to override antd class styles.
We can use :global to overcome this. Code below demonstrated how to do this.

```
// Less
.componentClass {
    :global {
        //override ant styles under componentClass
        .ant-btn-primary {
            background-color: @success-color;
        }    
    }
}
```
```
// TS
<component className={styles.componentClass}>
    <Button type="primary">Button display with success color instead of primary color.</Button>
</component>
```

# Test Setup
https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f

"skipBabel" must set to true if allowSyntheticDefaultImports is true in tsconfig.json. Otherwise debugging with VSCode will have source map issues.
5 Dec 2018 : The above seems no longer needed after updated ts-jest.

# Library Build
Modify package.json
```
"main": "lib/index.js",
"build" : "webpack --config webpack.prod.js && tsc --outDir lib"
```

Modify tsconfig.json
1. Remove "allowJs"
2. Add "declaration" : true

# Knowledges
## test
[28 Jul 2018] 
* jest skipBabel need set to true otherwise will have strange sourcemap issues.
* tsconfig need following configuration otherwise awync await may not work
    "target": "es6",
    "allowSyntheticDefaultImports":false,
    "esModuleInterop":false