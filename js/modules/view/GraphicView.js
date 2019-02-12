export class GraphicView{
    constructor(props){
        // this.code = props.code;
        this.onSendCallBack = props.onSendCallBack;
        this.init();
    }

    init(){
        this.bindDomElement();
    }

    getEditorString(){

    }


    bindDomElement(){
        this.$graphic = $('#graphic');
    }

    clearGraphicDiv(){
        console.log('[Message]Graphicの内容を削除します=====')
        this.$graphic.empty();
    }

    // appendToGraphicDiv(text){
    //     this.$graphic.append(text);
    // }

    appendVariable(variable){
        console.log(variable);
        for(let key in variable){
            this.$graphic.append(`<p>${key} : ${variable[key].val}</p>`);
        }
    }

    appendText(text){
        this.$graphic.append(text);
    }

    

}
export default GraphicView