$(document).ready(function() {

    $(window).on('scroll', function(){ //change nav color when scroll
        if($(this).scrollTop() > 100){

            $('.navbar').addClass('bg-nav');
        }
        else{
            $('.navbar').removeClass('bg-nav');
        }
    });

});