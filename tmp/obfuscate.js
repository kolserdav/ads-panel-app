const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const buildDir = fs.readdirSync(path.resolve(__dirname, '../build/static/js'));

buildDir.map(item => {
  const re = /\.js$/;
  if (re.exec(item)) {
    const srcFilePath = path.resolve(__dirname, `../build/static/js/${item}`);
    const data = fs.readFileSync(srcFilePath).toString();
    const reEm = /uyem.ru@gmail.com/;
    if (reEm.exec(data)) {
      const result = JavaScriptObfuscator.obfuscate(data, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        shuffleStringArray: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayIndexShift: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 4,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
      });
      fs.writeFileSync(srcFilePath, result); 
    }  
  }
})
