$(document).ready(function() {
    setSize();
    var current = window.location.hash.replace('#','');
    if (current == 'signup') {
        $('#small-circle').css('transition','none').css('transform','rotate(180deg)');
        $('#login-title').hide();
        $('#signup-title').show();
    }
    $('#small-circle').css('transition','all 0.5s ease 0.1s')
    $('#show-signup').click(function(){
        $('#small-circle').css({
            transform:'rotate(180deg)'
        });
        $('#login-title').fadeOut(125,function(){
            $('#signup-title').fadeIn(125);
        });
    });
    $('#show-login').click(function(){
            $('#small-circle').css({
                transform:'rotate(0deg)'
            });
            $('#signup-title').fadeOut(125,function(){
                $('#login-title').fadeIn(125);
            });
    });
});

function setSize() {
    var R=Math.max(600,Math.min($(window).innerHeight(),2*$(window).innerWidth()/3));
    var r=R/2;
    $('#big-circle').css({
        height          :(2*R)+'px',
        width           :(2*R)+'px',
        top             :(-R)+'px',
        left            :(-R/2)+'px',
    });
    $('#small-circle').css({
        height          :(2*r)+'px',
        width           :(2*r)+'px',
        top             :(-r)+'px',
        left            :(-r/2)+'px',
    });
    var titleElem = $('#big-title') ;
    /*
    if (titleElem.width() > (3*r/2-25)) {
        while (titleElem.width() > (3*r/2-30)) {
            titleElem.css('font-size', '-=1px');
        }
    }
    else {
        while (titleElem.width() < (3*r/2-30)) {
            titleElem.css('font-size', '+=1px');
        }
    }
    */
    $('.small-title').css('font-size',3*(+titleElem.css('font-size').replace('px',''))/4+'px');
    $('#login-container').css({
        right:-$('#login-container').outerWidth()+0.29*r,
        bottom:-$('#login-container').outerHeight()+0.29*r,
    });
    $('#signup-container').css({
        left:-$('#signup-container').outerWidth()+0.29*r,
        top:-$('#signup-container').outerHeight()+0.29*r,
    });
}