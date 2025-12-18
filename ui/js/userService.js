var userService = {
    parseToken: function () {
        var token = localStorage.getItem("token");
        if (!token) {
            return null;
        }

        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            var payload = JSON.parse(jsonPayload);
            return payload;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    },

    hideAdminPanelForUsers: function () {
        var tokenData = this.parseToken();
        if (tokenData && tokenData.role_name === 'User') {
            // Hide admin panel link in desktop navigation
            var adminLinks = document.querySelectorAll('a[href="admin-panel.html"]');
            adminLinks.forEach(function (link) {
                link.style.display = 'none';
            });
        }
    },

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

        this.hideAdminPanelForUsers();

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