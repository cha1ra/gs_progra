import GrammerController from "./modules/controller/GrammerController.js"

// for(let i=0; i<editor.session.getLength(); i++){
//     const code = editor.session.getLine(i);
//     //translateController(code);
//     //console.log('変数調査: ' + translateController(code));
// }

const gmc = new GrammerController(reservedWords);