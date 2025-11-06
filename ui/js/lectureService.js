var lectureService = {
    getLecturesByType: function (typeId) {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/lectures/' + typeId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Lectures fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching lectures:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    renderLectures: function (lectures) {
        var lecturesContainer = $('#lecturesContainer');
        lecturesContainer.empty();

        if (!lectures || lectures.length === 0) {
            lecturesContainer.html('<p class="text-center text-gray-600">No lectures available for this type at the moment.</p>');
            return;
        }

        lectures.forEach(function (lecture, index) {
            var lectureCard = `
                <button onclick="loadLecture(${index})"
                    class="lecture-card bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-200 ${index === 0 ? 'active' : ''}">
                    <div class="text-center">
                        <div class="font-bold text-lg">Lecture ${index + 1}</div>
                    </div>
                </button>
            `;
            lecturesContainer.append(lectureCard);
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
        var typeId = this.getUrlParameter('type_id');

        if (!typeId) {
            console.error('Type ID not found in URL');
            $('#lecturesContainer').html('<p class="text-center text-gray-600">Type ID not found. Please select a type first.</p>');
            return;
        }

        this.getLecturesByType(typeId).done(function (lectures) {
            window.lectures = lectures;
            self.renderLectures(lectures);
            if (lectures && lectures.length > 0) {
                loadLecture(0);
            }
        });
    }
};

