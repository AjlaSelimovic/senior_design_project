var userService = {
    init: function () {
        var token = localStorage.getItem("token");
        var currentPage = window.location.pathname.split("/").pop();

        if (!token) {
            if (currentPage !== "login.html" && currentPage !== "register.html") {
                window.location.replace("login.html");
            }
        } else {
            if (currentPage === "login.html" || currentPage === "register.html") {
                window.location.replace("index.html");
            }
        }
    },

    login: function () {
        var user = {}
        user.email = $('#email').val();
        user.password = $('#password').val();
        $.ajax({
            type: "POST",
            url: '/../../OnlineLanguageTeaching/api/users/login',
            data: JSON.stringify(user),
            contentType: "application/json",
            dataType: "json",

            success: function (data) {
                localStorage.setItem("token", data.token);
                window.location.replace("index.html");

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseJSON.message);
            }
        });
    },

    logout: function () {
        localStorage.clear();
        window.location.replace("index.html");
    },

    register: function () {
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        var errorDiv = $('#passwordError');

        errorDiv.addClass('hidden');

        if (password !== confirmPassword) {
            errorDiv.removeClass('hidden');
            return;
        }

        var user = {}
        user.firstname = $('#firstName').val();
        user.lastname = $('#lastName').val();
        user.dateofbirth = $('#dateOfBirth').val();
        user.email = $('#email').val();
        user.password = password;
        $.ajax({
            type: "POST",
            url: '/../../OnlineLanguageTeaching/api/users/register',
            data: JSON.stringify(user),
            contentType: "application/json",
            dataType: "json",

            success: function (data) {
                console.log('You have been succesfully registered.');

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseJSON.message);
            }
        });
    },
}