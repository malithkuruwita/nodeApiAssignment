$(document).ready(function(){

    

    $('#changelog').click(function(){
        
        var atag = $("#changelog").text();
        if(atag === 'Sign Up'){
            
            $('#changelog').text('Sign In');
            $('#log').removeClass('login').addClass('logc');
            $('#reg').removeClass('register').addClass('regc');
            $('#logA').removeClass('loginA').addClass('loginC');
            $('#sigA').removeClass('signA').addClass('signC');

        }else if(atag === 'Sign In'){
            $('#changelog').text('Sign Up');
            $('#log').removeClass('logc').addClass('login');
            $('#reg').removeClass('regc').addClass('register');
            $('#logA').removeClass('loginC').addClass('loginA');
            $('#sigA').removeClass('signC').addClass('signA');
        }
        

    });


   

    
})