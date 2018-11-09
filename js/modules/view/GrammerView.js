export class GrammerView{
    constructor(props){
        // this.code = props.code;

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
let test = 12;
i = i + 2;
i += 2;
console.log(i);
const j = 'へーい';
console.log(j);
var testFlag = false;

if(i==3){
    testFlag = true;
}
        `);
    }

    getCodes(){
        return this.editor.getValue();
    }

}
export default GrammerView