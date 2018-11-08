/*----------------------------------
Class Definition
----------------------------------*/

class Variable{
    constructor(props){
        this.name = porps.name
        this.type = props.type
        this.val = props.val
    }

    get name(){ return this._name }
    get type(){ return this._type }
    get val(){ return this._val }
    set name(v){ this._name = v }
    set type(v){ this._type = v }
    set val(v){ this._val = v }
}



/*----------------------------------
ACE API
----------------------------------*/


var editor = ace.edit('editor');
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript")

editor.setValue(`
let i = 0;
i = i + 2;
i += 2;
console.log(i);
const j = 'へーい';
console.log(j);
var testFlag = false;

if(i>3){
    testFlag = true;
}


`);
//debug('editor.getValue()',editor.getValue());
//debug('editor.getLine(0)',editor.session.getLine(0));
//debug('editor.session.getLength()',editor.session.getLength());

for(let i=0; i<editor.session.getLength(); i++){
    const code = editor.session.getLine(i);
    translateController(code);
    console.log('変数調査: ' + translateController(code));
}


/*----------------------------------
Translate Rule Definition (Controller)
----------------------------------*/

function translateController(code){
    var result;
    var flag = isVariableExist(code);
    // var, let, const があったら変数宣言と見なす
    if(flag!=false){
        const operand = code.replace(/\s/g,'').split('=');
        const leftOpe = operand[0].slice(flag.length,operand[0].length);
        const rightOpe = operand[1].replace(';','');
        result = `変数(${flag}) ${leftOpe} に ${rightOpe} が代入されました。`;
    }
    return result;
    
    function isVariableExist(code){
        let result = code.slice(0,5);
        if(result == 'const')return result;
        result = code.slice(0,3);
        if(result == 'var' || result == 'let')return result;
        return false;
    }

    function separateOperand(){

    }


}








/*----------------------------------
ルール決め is 大事

while.if.for文があったら{}を一括りにする
;があったら一文とみなす




----------------------------------*/









function debug(desc, ex){
    console.log('Debug :' + desc);
    console.log(ex);
}








/*
新しく学んだこと
let val = code.replace(/\s/g,'');
*/