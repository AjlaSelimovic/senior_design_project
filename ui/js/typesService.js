var typesService = {
    getTypesByCourse: function (courseId) {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/types/' + courseId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Types fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching types:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    renderTypes: function (types) {
        var typesContainer = $('#typesContainer');
        typesContainer.empty();

        if (!types || types.length === 0) {
            typesContainer.html('<p class="text-center text-gray-600">No types available for this course at the moment.</p>');
            return;
        }

        types.forEach(function (type) {
            var typeCard = `
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 hover:shadow-2xl">
                    <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-black opacity-10"></div>
                        <div class="text-center relative z-10">
                            <h2 class="text-3xl font-bold text-white drop-shadow-lg">${type.name}</h2>
                        </div>
                    </div>
                    <div class="p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">${type.name}</h3>
                        <p class="text-gray-600 mb-6">
                            ${type.description || 'Start learning this type to improve your skills.'}
                        </p>
                        <a href="lectures.html?type_id=${type.id}"
                            class="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 hover:from-blue-600 hover:to-purple-700 text-center">
                            Start Learning
                        </a>
                    </div>
                </div>
            `;
            typesContainer.append(typeCard);
        });
    },

    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    init: function () {
        var self = this;
        var courseId = this.getUrlParameter('course_id');

        if (!courseId) {
            console.error('Course ID not found in URL');
            $('#typesContainer').html('<p class="text-center text-gray-600">Course ID not found. Please select a course first.</p>');
            return;
        }

        this.getTypesByCourse(courseId).done(function (types) {
            self.renderTypes(types);
        });
    }
};

