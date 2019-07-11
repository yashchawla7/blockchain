App = {
    baseURL: `http://${window.location.hostname}:6002`,
    page: 'register',//register //test
    init: function () {
        console.log("App initialized....");

        console.log('BaseURL', App.baseURL);

        //App.formsJSON = JSON.parse(forms);
        //console.log('Forms JSON', App.formsJSON)

        App.loadpages();
    },
    loadpages: function () {
        App.showloader(true);
        switch (App.page) {
            case 'test':
                $('#container').empty();
                $('#container').load('test.html')
                break;
            case 'register':
                App.loadRegisterPage();
                break;
            default:
                break;
        }
        App.showloader(false);
    },
    loadRegisterPage: function(){
        App.showloader(false);

        $('#container').empty();
        
        $('#container').load('register-page.html')
    },
    saveToBC_registerUser: function(){

    },
    loadAdminPage: function(){
        App.showloader(false);

        $('#container').empty();

        $.get(App.baseURL + "/composer/admin/getAllUser", function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Load", data.canvas.register.length)

                }
            }
        }

    },


    showloader: function (param, cont = 'main') {
        switch (cont) {
            case 'main':
                if (param === true) {
                    $('#container').hide();
                    $('#loader').show();
                } else {
                    $('#container').show();
                    $('#loader').hide();
                }
                break;
            case 'landing':
                if (param === true) {
                    $('#org-landing-container').empty();
                    $('#org-landing-container').html('<div class="container"><h1 class="mt-5">Loading...</h1></div>');
                } else {
                    $('#org-landing-container').empty();
                }
                break;
            default:
                $('#container').show();
                $('#loader').hide();
                break;
        }

    },
}

$(function () {
    $(window).load(function () {
        App.init();
    })
})
