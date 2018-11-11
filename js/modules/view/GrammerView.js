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

        $('#grammer').on('click',()=>{
            console.log('html' + $(this).text());
        })

        // $(document).on({
        //     'mouseenter' : ()=>{
        //         $(this).html('background-color');
        //     },
        //     'mouseleave' : ()=>{
        //         $(this).css('background-color', "#white")
        //     }
        // },'#grammer > p');
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
let test = 1;
test = 3;
        `);
    }

    getCodes(){
        return this.editor.getValue();
    }

}
export default GrammerView