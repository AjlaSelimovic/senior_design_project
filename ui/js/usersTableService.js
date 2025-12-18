var usersTableService = {
    currentUserRole: null,

    // Parse JWT token to get user role
    parseToken: function () {
        var token = localStorage.getItem("token");
        if (!token) {
            console.error('No token found');
            window.location.replace("login.html");
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

    // Check if current user has access to this page
    checkAccess: function () {
        var tokenData = this.parseToken();
        if (!tokenData || !tokenData.role_name) {
            console.error('Invalid token data');
            window.location.replace("login.html");
            return false;
        }

        this.currentUserRole = tokenData.role_name;

        // Only admins and head admins can access this page
        if (this.currentUserRole !== 'Admin' && this.currentUserRole !== 'Head Admin') {
            console.error('Access denied: Insufficient permissions');
            window.location.replace("index.html");
            return false;
        }

        return true;
    },

    // Get all users from API
    getAllUsers: function () {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/admin/users',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Users fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching users:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Format date for display
    formatDate: function (dateString) {
        var date = new Date(dateString);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    // Generate action buttons based on current user role and target user role
    generateActionButtons: function (user) {
        var buttons = '';
        var currentRole = this.currentUserRole;
        var targetRole = user.role_name;

        // Admin logic
        if (currentRole === 'Admin') {
            // Can only delete regular users
            if (targetRole === 'User') {
                buttons = `
                    <button onclick="usersTableService.deleteUser(${user.id})" 
                        class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-red-600 hover:to-red-700">
                        Delete
                    </button>
                `;
            } else {
                // No actions for admin/head-admin users
                buttons = '<span class="text-gray-400 text-sm">No actions available</span>';
            }
        }

        // Head Admin logic
        if (currentRole === 'Head Admin') {
            if (targetRole === 'User') {
                // Can promote to admin or delete
                buttons = `
                    <div class="flex gap-2 justify-center">
                        <button onclick="usersTableService.promoteUser(${user.id})" 
                            class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-green-600 hover:to-green-700">
                            Promote
                        </button>
                        <button onclick="usersTableService.deleteUser(${user.id})" 
                            class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-red-600 hover:to-red-700">
                            Delete
                        </button>
                    </div>
                `;
            } else if (targetRole === 'Admin') {
                // Can demote to user or delete
                buttons = `
                    <div class="flex gap-2 justify-center">
                        <button onclick="usersTableService.demoteUser(${user.id})" 
                            class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-yellow-600 hover:to-yellow-700">
                            Demote
                        </button>
                        <button onclick="usersTableService.deleteUser(${user.id})" 
                            class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-red-600 hover:to-red-700">
                            Delete
                        </button>
                    </div>
                `;
            } else if (targetRole === 'Head Admin') {
                // No actions for head admins
                buttons = '<span class="text-gray-400 text-sm">No actions available</span>';
            }
        }

        return buttons;
    },

    // Render users table
    renderUsers: function (users) {
        var tableBody = $('#usersTableBody');
        tableBody.empty();

        if (!users || users.length === 0) {
            tableBody.html('<tr><td colspan="6" class="px-6 py-8 text-center text-gray-600">No users found.</td></tr>');
            return;
        }

        var self = this;
        users.forEach(function (user) {
            var row = `
                <tr class="hover:bg-gray-50 transition duration-150">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${user.firstname}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${user.lastname}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${user.email}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${self.formatDate(user.dateofbirth)}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${self.getRoleBadgeClass(user.role_name)}">
                            ${user.role_name}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-center">
                        ${self.generateActionButtons(user)}
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    },

    // Get badge color class based on role
    getRoleBadgeClass: function (roleName) {
        switch (roleName) {
            case 'User':
                return 'bg-blue-100 text-blue-800';
            case 'Admin':
                return 'bg-purple-100 text-purple-800';
            case 'Head Admin':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    },

    // Delete user
    deleteUser: function (userId) {
        var self = this;
        $.ajax({
            type: "DELETE",
            url: '/../../OnlineLanguageTeaching/api/admin/users/' + userId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('User deleted successfully:', data);
                self.init();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error deleting user:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Promote user to Admin
    promoteUser: function (userId) {
        var self = this;
        $.ajax({
            type: "PUT",
            url: '/../../OnlineLanguageTeaching/api/admin/users/' + userId + '/promote',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('User promoted successfully:', data);
                self.init();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error promoting user:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Demote user to User
    demoteUser: function (userId) {
        var self = this;
        $.ajax({
            type: "PUT",
            url: '/../../OnlineLanguageTeaching/api/admin/users/' + userId + '/demote',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('User demoted successfully:', data);
                self.init();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error demoting user:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Initialize the service
    init: function () {
        var self = this;

        // Check if user has access
        if (!this.checkAccess()) {
            return;
        }

        console.log('Current user role:', this.currentUserRole);

        // Get all users from API
        this.getAllUsers().done(function (users) {
            self.renderUsers(users);
        });
    }
};

