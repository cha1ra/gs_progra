export class GrammerView{
    constructor(props){
        // this.code = props.code;

        this.init();
    }

    init(){
        this.loadAceSettings();
        this.bindDomElement();
    }

    getEditorString(){

    }


    bindDomElement(){
        this.$translation = $('#translation');
    }
}
export default GrammerView