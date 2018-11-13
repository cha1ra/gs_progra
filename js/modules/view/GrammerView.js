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
                console.log(';を発見！');
                this.onSendCallBack();
            }
        });
    }

    clearText(){
        this.$grammer.empty();
    }

    appendText(text){
        this.$grammer.append(text);
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

printOnConsole(test);

function printOnConsole(val){
    console.log('hello, ' + val);
}
        `);
    }

    getCodes(){
        return this.editor.getValue();
    }

}
export default GrammerView