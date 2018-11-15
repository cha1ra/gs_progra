import GrammerController from "./modules/controller/GrammerController.js"

// for(let i=0; i<editor.session.getLength(); i++){
//     const code = editor.session.getLine(i);
//     //translateController(code);
//     //console.log('変数調査: ' + translateController(code));
// }

const gmc = new GrammerController(reservedWords);

$('nav>li').on('click',function(){
    const idName = $(this).attr('class');
    fadeOutContents().then(()=>$('#' + idName).fadeIn());
})

$('#logo').on('click',function(){
    fadeOutContents().then(()=>$('#main').fadeIn());
})

function fadeOutContents(){
    return new Promise((resolve,reject)=>{
        $('#main').fadeOut(500, ()=>{
            $('#mypage').fadeOut(500, ()=>{
                $('#about').fadeOut(500, ()=>{
                    $('#login').fadeOut(500, ()=>{
                        return resolve()
                    })
                })
            })
        })
    })
}

$('.save').on('click', function(){
    postCode(codesRef, ace.edit('editor').getValue());
})

$(document).on("click", ".card", function () {
    console.log($(this).find('.card-desc').text());
    $('#progra-title').val($(this).find('.card-title').text())
    ace.edit('editor').setValue($(this).find('.card-desc').text())
    fadeOutContents().then(()=>$('#main').fadeIn());
});