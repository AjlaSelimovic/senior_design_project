var adminContentService = {
    // Get all courses, types, and lectures from API
    getContentData: function () {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/admin/courses',
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Content data fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching content data:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Render content table
    renderContent: function (content) {
        var tableBody = $('#contentTableBody');
        tableBody.empty();

        if (!content || content.length === 0) {
            tableBody.html('<tr><td colspan="4" class="px-6 py-8 text-center text-gray-600">No content found.</td></tr>');
            return;
        }

        content.forEach(function (item) {
            var row = `
                <tr class="hover:bg-gray-50 transition duration-150">
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">${item.course_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${item.type_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${item.lecture_name}</td>
                    <td class="px-6 py-4 text-sm text-center">
                        <button onclick="adminContentService.editContent(${item.course_id}, ${item.type_id}, ${item.id})" 
                            class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-blue-600 hover:to-purple-700">
                            Edit
                        </button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    },

    // Create new course
    createNewCourse: function () {
        window.location.href = 'add-content.html';
    },

    // Edit content
    editContent: function (courseId, typeId, lectureId) {
        window.location.href = 'add-content.html?course_id=' + courseId + '&type_id=' + typeId + '&lecture_id=' + lectureId;
    },

    // Initialize the service
    init: function () {
        var self = this;

        this.getContentData().done(function (content) {
            self.renderContent(content);
        });
    }
};

