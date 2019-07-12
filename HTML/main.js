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
    loadRegisterPage: function () {
        App.showloader(false);

        $('#container').empty();

        $('#container').load('register-page.html')
    },
    saveToBC_registerUser: function () {

        const name = $('#inputName').val();
        const email = $('#inputEmail').val();
        const phonenum = $('#phoneNumber').val();
        const aadharnum = $('#aadharNumber').val();
        const ipfile = $('#ipfile').val();

        let payload = {
            name: name,
            email: email,
            phoneNumber: phonenum,
            aadharNumber: aadharnum,
            IPFile: ipfile
        }

        console.log(payload)

        $.post("/composer/admin/addUser", payload, function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Load", data.canvas.register.length)

                }
            }
        })

    },
    loadAdminPage: function () {
        App.showloader(true);

        $('#container').empty();

        $.get("/composer/admin/getAllUser", function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Load", data.user)

                    let str = `<table class="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                </tr>
                                </thead>
                                <tbody>`
                                
                    for (let each in data.user) {
                        (function (idx, arr) {
                            str += `<tr><th scope="row">${parseInt(idx) + 1}</th>
                                    <td>${arr[idx].name}</td>
                                    <td>${arr[idx].email}</td>
                                    <td>${arr[idx].phoneNumber}</td>
                                </tr>`
                        })(each, data.user)
                    }

                    str += `</tbody></table>`

                    
                }
            }
        })

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
    showUploadModal: function (container) {
        $('#exampleModal').modal('show'); // show , toggle
        $(".modal-body #userPhoto").val('');
        $(".modal-body #status").empty();
        $(".modal-body #fileName").val('');
        $(".modal-body #containerId").val(container);
    },
    hideUploadModal: function () {

        let fileName = $(".modal-body #fileName").val();
        let containerId = $(".modal-body #containerId").val();

        console.log("Value Written to Model:::::::::ContainerID", containerId)
        console.log("Value Written to Model:::::::::FileName", fileName)

        $(`#${containerId}`).val(fileName);

        $('#exampleModal').modal('hide');
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    })
})
