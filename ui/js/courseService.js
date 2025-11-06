var courseService = {
    getCourses: function () {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/courses',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Courses fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching courses:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    renderCourses: function (courses) {
        var coursesContainer = $('#coursesContainer');
        coursesContainer.empty();

        if (!courses || courses.length === 0) {
            coursesContainer.html('<p class="text-center text-gray-600">No courses available at the moment.</p>');
            return;
        }

        courses.forEach(function (course) {
            var courseCard = `
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 hover:shadow-2xl">
                    <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-5xl font-bold mb-2">${course.abbreviation}</div>
                            <h2 class="text-3xl font-bold text-white">${course.name}</h2>
                        </div>
                    </div>
                    <div class="p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">Learn ${course.name}</h3>
                        <p class="text-gray-600 mb-6">
                            ${course.description || 'Start learning today with our comprehensive course.'}
                        </p>
                        <a href="types.html?course_id=${course.id}"
                            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 inline-block text-center">
                            Start
                        </a>
                    </div>
                </div>
            `;
            coursesContainer.append(courseCard);
        });
    },

    init: function () {
        var self = this;
        this.getCourses().done(function (courses) {
            self.renderCourses(courses);
        });
    }
};

