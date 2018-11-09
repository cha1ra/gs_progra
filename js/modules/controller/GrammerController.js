import GrammerModel from "../model/GrammerModel.js";
import VariableModel from "../model/VariableModel.js";
import GrammerView from "../view/GrammerView.js"

export class TranslateController{
    constructor(props){
        console.log('props : ' + props.for);
        // this.codes = props;

        this.init();

        // const result = this.gm.translateToLanguage(this.codes);
        // this.gv.appendText(result);

        this.translateEachCords();

        

    }

    init(){
        this.gv = new GrammerView();
        this.gm = new GrammerModel();
    }

    getCode(){

    }

    translateEachCords(){
        const codes = this.gv.getCodes().split('\n');
        codes.forEach((el, i) => {
            //console.log(el);
            this.gv.appendText(this.gm.translateToLanguage(el, i));
        });
    }
}

/*----------------------------------
Class Test
----------------------------------*/

const varArr = new VariableModel({
    name: 'hoge1',
    type: 'hoge2',
    val: 'hoge3'
});





/*----------------------------------
ルール決め is 大事

while.if.for文があったら{}を一括りにする
;があったら一文とみなす

----------------------------------*/









function debug(desc, ex){
    console.log('Debug :' + desc);
    console.log(ex);
}






export default TranslateController

/*
新しく学んだこと
let val = code.replace(/\s/g,'');
*/