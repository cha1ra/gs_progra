export class GrammerView{
    constructor(props){
        // this.code = props.code;
        this.onSendCallBack = props.onSendCallBack;
        //console.log(this.onSendCallBack);
        this.init();
    }

    init(){
        this.loadAceSettings();
        this.bindDomElement();
        this.handleEvents();
    }

    getEditorString(){

    }


    bindDomElement(){
        this.$grammer = $('#grammer');
    }

    handleEvents(){
        this.editor.getSession().on('change', (e)=>{
            if(e.lines[0]==';'){
                console.log('[Comment];の入力を検知=====');
                this.onSendCallBack();
                return false;
            }
        });

        $(window).keydown((e)=>{
            if(event.shiftKey){
                if(e.keyCode == 13){
                    console.log('[Comment]Shift + Enterの入力を検知=====');
                    this.onSendCallBack();
                    return false;
                }
            }
        })
    }

    clearText(){
        console.log('[Message]メッセージの内容を削除します=====')
        this.$grammer.empty();
    }

    appendText(text){
        this.$grammer.append(text);
    }

    changeFunctionText(funcName,text){
        $('.' + funcName).html(`「${text}」`);
    }

    loadAceSettings(){
        /*----------------------------------
        ACE API
        ----------------------------------*/

        this.editor = ace.edit('editor');
        this.editor.setTheme("ace/theme/twilight");
        this.editor.session.setMode("ace/mode/javascript");

        this.editor.setValue(`
//if文を作るどー
let test = 0;
if(test >= 0){
    test += 14;
}
test = 2;

printOnConsoleByThisFunction(test);

function printOnConsoleByThisFunction(val){
    console.log('hello, ' + val);
    let k = 0;
    k += 1;
}

console.log('this');

let j = 2;
j++;

j = 3;
j += 4;

        `);
    }

    getCodesArray(){
        return this.editor.getValue().split('\n');
    }

}
export default GrammerView