App = {
    baseURL: `http://${window.location.hostname}:6001`,
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
        const ipfile = $('#fileName1').val();

        let payload = {
            name: name,
            email: email,
            phoneNumber: phonenum,
            aadharNumber: aadharnum,
            IPFile: ipfile
        }

        console.log(payload)
        App.showloader(true);

        $.post("/composer/admin/addUser", payload, function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Saveed succesfylly", data.result)
                    $('#inputName').val('');
                    $('#inputEmail').val('');
                    $('#phoneNumber').val('');
                    $('#aadharNumber').val('');
                    $('#fileName1').val('');
                    App.showloader(false);
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
                    //console.log("Load", data.user)

                    let str = `<table class="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Aadhar Number</th>
                                    <th scope="col">IP File</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>`
                                
                    for (let each in data.user) {
                        (function (idx, arr) {
                            str += `<tr><th scope="row">${parseInt(idx) + 1}</th>
                                    <td>${arr[idx].name}</td>
                                    <td>${arr[idx].email}</td>
                                    <td>${arr[idx].phoneNumber}</td>
                                    <td>${arr[idx].aadharNumber}</td>
                                    <td><a href="${App.baseURL}/uploads/${arr[idx].IPFile}" target="_blank">${arr[idx].IPFile}</a></td>
                                    <td>${arr[idx].state}</td>
                                    <td>
                                        <div class="row">
                                            <div class="col">
                                                <select id="dropdownMenu${idx}" class="form-control">
                                                    <option>Uploaded</option>
                                                    <option>Submitted to government</option>
                                                    <option>Approved</option>
                                                    <option>Rejected</option>
                                                    <option>Appeal</option>
                                                </select>
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-primary btn-sm btn-block" type="submit" onclick="App.uploadStatus('${arr[idx].userId}', '${idx}'); return false;">Update</button>
                                            </div>
                                        </div>
                                    
                                    </td>
                                </tr>`
                        })(each, data.user)
                    }

                    str += `</tbody></table>`

                    App.showloader(false)
                    $('#container').html(str);
                    
                }
            }
        })

    },

    uploadStatus: function(userId, selectid){
        console.log("Update User:", userId, selectid);
        //const userId = userId
        const state = $(`#dropdownMenu${selectid}`).find(':selected').val()
        //console.log("Selected Value ", select)
        App.showloader(true);

        let payload = {
            userId: userId,
            state: state.toUpperCase()
        }

        console.log(payload)
        App.showloader(true);

        $.post("/composer/admin/updateState", payload, function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Updated succesfylly", data.result)
                    
                    App.showloader(false);

                    App.loadAdminPage();

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

        //console.log("Value Written to Model:::::::::ContainerID", containerId)
        //console.log("Value Written to Model:::::::::FileName", fileName)

        $(`#${containerId}`).val(fileName);

        $('#exampleModal').modal('hide');
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    })
})
