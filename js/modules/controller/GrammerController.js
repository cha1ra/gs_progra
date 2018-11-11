import GrammerModel from "../model/GrammerModel.js";
import VariableModel from "../model/VariableModel.js";
import GrammerView from "../view/GrammerView.js"
// import GraphicController from './GraphicController.js';

export class TranslateController{
    constructor(props){
        console.log('props : ' + props.for);
        // this.codes = props;
        this.bindMethods();
        this.init();

        // const result = this.gm.translateToLanguage(this.codes);
        // this.gv.appendText(result);

        this.translateEachCords();

        

    }

    init(){
        this.gv = new GrammerView({
            onSendCallBack: this.translateEachCords
        });
        this.gm = new GrammerModel();
        this.vm = {}
    }

    bindMethods(){
        this.translateEachCords = this.translateEachCords.bind(this);
    }


    /*----------------------------------
    Grammer Controller
    ----------------------------------*/

    translateEachCords(){
        this.gv.clearText();
        const codes = this.gv.getCodes().split('\n');
        codes.forEach((el, i) => {
            //console.log(el);
            try{
                this.gv.appendText(this.gm.translateToText(el, i));
            }
            catch(e){
                console.log(e);
            }
        });
    }


    /*----------------------------------
    Graphic Controller
    ----------------------------------*/

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