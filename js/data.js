/*----------------------------------
Reserved Words Definition
ref. https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Reserved_Words
----------------------------------*/

const reservedWords = {
    const: 'var',
    let: 'var',
    var: 'var',

    if: 'ctrlsta' ,
    else: 'ctrlsta' ,

    break: 0 ,
    continue: 0 ,
    
    switch: 'ctrlsta' ,
    case: 'ctrlsta' ,

    do: 'ctrlsta' ,
    while: 'ctrlsta' ,

    function: 0 ,
    return: 0 ,

    for: 'ctrlsta' ,
    in: 'ctrlsta' ,

    try: 'ctrlsta' ,
    catch: 'ctrlsta' ,

    debugger: 0 ,
    default: 0 ,
    delete: 0 ,
    finally: 0 ,
    instanceof: 0 ,
    new: 0 , //右辺のみ
    public: 0 ,
    static: 0 ,
    this: 0 ,
    throw: 0 ,
    typeof: 0 ,
    void: 0 ,
    with: 0 ,
    
    class: 0 ,
    import: 0 ,
    export: 0 ,
    extends: 0 ,
    super: 0 ,
    
}

const objects = {
    console:{
        log:0
    }
}


const localization = {
    htmlMyPage:{
        'ja':'マイページ',
        'en':'My Page',
        'zh-cn':'个人主页'
    },
    htmlAbout:{
        'ja':'プロぐらについて',
        'en':'About Pro-Gra',
        'zh-cn':'关于程序'
    },
    htmlLogin:{
        'ja':'新規登録 / ログイン',
        'en':'Sign Up / Login',
        'zh-cn':'新注册 / 登陆'
    },
    htmlPrograTitle:{
        'ja':'タイトルを入力...',
        'en':'Input title...',
        'zh-cn':'输入标题...'
    },
    htmlSaveText:{
        'ja':'コードを保存',
        'en':'Save the Code',
        'zh-cn':'保存程序'
    },

    var:{
        'ja':'変数',
        'en':'Variable',
        'zh-cn':'变数'
    },
    const:{
        'ja':'定数',
        'en':'Constructor',
        'zh-cn':'定数'
    },
    translateVariable:{
        'ja':'<p class="line${lineNum+1}">${this.letOrConst(reservedWord)}<span>(${reservedWord}) ${leftOpe}</span> に <span>${rightOpe}</span> を代入します。</p>',
        'en':'',
        'zh-cn':'<p class="line${lineNum+1}">将 <span>${rightOpe}</span> 带入 ${this.letOrConst(reservedWord)}<span>(${reservedWord}) ${leftOpe}</span> </p>'
    },
    calcExpression:{
        'ja':'<p class="line${lineNum+1}"><span>${leftOpe}</span> に <span>${rightOpe}</span> を代入します。<br>その結果、${leftOpe}の値は<span>${this.variableObj[leftOpe]["val"]}</span>になります</p>',
        'en':'',
        'zh-cn':'<p class="line${lineNum+1}">将  <span>${rightOpe}</span>  带入 <span>${leftOpe}</span><br>计算结果，${leftOpe}的值为<span>${this.variableObj[leftOpe]["val"]}</span></p>'
    },

    functionText:{
        'ja':"<div class='func'>関数 ${key} が出現！<br><span class='${key}'>関数内</span>の処理を始めます。<div>",
        'en':'',
        'zh-cn':"<div class='func'>函数 ${key} 被呼叫！<br>开始<span class='${key}'>函数</span>的处理<div>"
    },

    format:{
        'ja':'',
        'en':'',
        'zh-cn':''
    },


}



