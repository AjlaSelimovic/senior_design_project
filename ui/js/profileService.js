var profileService = {
    isEditMode: false,
    originalData: {},

    // Load profile and completed lectures from API
    loadProfileAndLectures: function () {
        var self = this;

        $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/users/profile',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Profile data fetched successfully:', data);

                if (data && data.length > 0) {
                    // Extract user data from first item
                    var firstItem = data[0];
                    var userData = {
                        firstName: firstItem.firstname,
                        lastName: firstItem.lastname,
                        email: firstItem.email,
                        dateOfBirth: firstItem.dateofbirth
                    };

                    self.displayProfileData(userData);

                    // Extract completed lectures
                    var completedLectures = [];
                    data.forEach(function (item) {
                        if (item.course_type !== null && item.completion_percentage !== null) {
                            completedLectures.push({
                                name: item.course_type,
                                percentage: parseFloat(item.completion_percentage)
                            });
                        }
                    });

                    self.renderCompletedLectures(completedLectures);
                } else {
                    console.error('No profile data received');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching profile data:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Display profile data
    displayProfileData: function (userData) {
        // Store original data
        this.originalData = { ...userData };

        // Update fields
        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('email').value = userData.email;
        document.getElementById('dateOfBirth').value = userData.dateOfBirth;

        // Update profile initials
        var initials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
        document.getElementById('profileInitials').textContent = initials;
    },

    // Toggle edit mode
    toggleEditMode: function () {
        this.isEditMode = true;

        // Get form fields
        var firstNameField = document.getElementById('firstName');
        var lastNameField = document.getElementById('lastName');
        var emailField = document.getElementById('email');
        var dateOfBirthField = document.getElementById('dateOfBirth');

        // Make fields editable
        firstNameField.removeAttribute('readonly');
        lastNameField.removeAttribute('readonly');
        emailField.removeAttribute('readonly');
        dateOfBirthField.removeAttribute('readonly');

        // Change styling
        var fields = [firstNameField, lastNameField, emailField, dateOfBirthField];
        fields.forEach(function (field) {
            field.classList.remove('bg-gray-50', 'read-only:cursor-not-allowed');
            field.classList.add('bg-white');
        });

        // Toggle buttons
        document.getElementById('editBtn').style.display = 'none';
        document.getElementById('saveBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    },

    // Save profile changes
    saveProfile: function () {
        var self = this;

        // Get updated values
        var updatedData = {
            firstname: document.getElementById('firstName').value.trim(),
            lastname: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            dateofbirth: document.getElementById('dateOfBirth').value
        };

        // API call to save profile data
        $.ajax({
            type: "PUT",
            url: '/../../OnlineLanguageTeaching/api/users/profile',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(updatedData),
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (response) {
                console.log('Profile updated successfully:', response);

                // Update stored original data
                self.originalData = {
                    firstName: updatedData.firstname,
                    lastName: updatedData.lastname,
                    email: updatedData.email,
                    dateOfBirth: updatedData.dateofbirth
                };

                // Update profile initials
                var initials = (updatedData.firstname.charAt(0) + updatedData.lastname.charAt(0)).toUpperCase();
                document.getElementById('profileInitials').textContent = initials;

                // Exit edit mode
                self.exitEditMode();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error updating profile:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Cancel edit
    cancelEdit: function () {
        // Restore original values
        document.getElementById('firstName').value = this.originalData.firstName;
        document.getElementById('lastName').value = this.originalData.lastName;
        document.getElementById('email').value = this.originalData.email;
        document.getElementById('dateOfBirth').value = this.originalData.dateOfBirth;

        // Exit edit mode
        this.exitEditMode();
    },

    // Exit edit mode
    exitEditMode: function () {
        this.isEditMode = false;

        // Get form fields
        var firstNameField = document.getElementById('firstName');
        var lastNameField = document.getElementById('lastName');
        var emailField = document.getElementById('email');
        var dateOfBirthField = document.getElementById('dateOfBirth');

        // Make fields readonly
        firstNameField.setAttribute('readonly', true);
        lastNameField.setAttribute('readonly', true);
        emailField.setAttribute('readonly', true);
        dateOfBirthField.setAttribute('readonly', true);

        // Restore styling
        var fields = [firstNameField, lastNameField, emailField, dateOfBirthField];
        fields.forEach(function (field) {
            field.classList.add('bg-gray-50', 'read-only:cursor-not-allowed');
            field.classList.remove('bg-white');
        });

        // Toggle buttons
        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
    },

    // Render completed lectures list
    renderCompletedLectures: function (lectures) {
        var lecturesList = $('#completedLecturesList');
        var coursesSection = $('#coursesSection');

        lecturesList.empty();

        if (!lectures || lectures.length === 0) {
            // Hide the entire courses section when there are no completed lectures
            coursesSection.hide();
            return;
        }

        // Show the courses section when there are completed lectures
        coursesSection.show();

        lectures.forEach(function (lecture) {
            // Determine color based on percentage
            var progressColor = '';
            if (lecture.percentage >= 90) {
                progressColor = 'bg-green-500';
            } else if (lecture.percentage >= 70) {
                progressColor = 'bg-blue-500';
            } else if (lecture.percentage >= 50) {
                progressColor = 'bg-yellow-500';
            } else {
                progressColor = 'bg-orange-500';
            }

            var lectureHTML = `
                <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 hover:shadow-lg transition duration-200">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-bold text-gray-900">${lecture.name}</h3>
                        <span class="text-2xl font-bold text-indigo-600">${lecture.percentage}%</span>
                    </div>
                </div>
            `;
            lecturesList.append(lectureHTML);
        });
    }
};

