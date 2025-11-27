var lectureService = {
    currentLectureId: null,

    getCurrentUserId: function () {
        var token = localStorage.getItem("token");
        if (!token) return null;
        try {
            var payload = token.split('.')[1];
            var decoded = JSON.parse(atob(payload));
            return decoded.id;
        } catch (e) {
            return null;
        }
    },

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

    getCommentsByLecture: function (lectureId) {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/comments/' + lectureId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Comments fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error fetching comments:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    postComment: function (lectureId, content) {
        return $.ajax({
            type: "POST",
            url: '/../../OnlineLanguageTeaching/api/comments/' + lectureId,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                content: content
            }),
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Comment posted successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error posting comment:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    deleteComment: function (commentId) {
        return $.ajax({
            type: "DELETE",
            url: '/../../OnlineLanguageTeaching/api/comments/' + commentId,
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            }
        });
    },

    renderComments: function (comments) {
        var commentsList = $('#commentsList');
        commentsList.empty();

        if (!comments || comments.length === 0) {
            commentsList.html('<p class="text-center text-gray-600 py-4">No comments yet. Be the first to comment!</p>');
            return;
        }

        var currentUserId = this.getCurrentUserId();

        comments.forEach(function (comment) {
            var initials = (comment.firstname.charAt(0) + comment.lastname.charAt(0)).toUpperCase();
            var fullName = comment.firstname + ' ' + comment.lastname;
            var timeAgo = comment.created_at;
            var gradients = [
                'from-blue-500 to-cyan-600',
                'from-pink-500 to-rose-600',
                'from-green-500 to-emerald-600',
                'from-purple-500 to-indigo-600',
                'from-orange-500 to-red-600',
                'from-yellow-500 to-orange-600'
            ];
            var randomGradient = gradients[comment.user_id % gradients.length];

            var deleteButton = comment.user_id === currentUserId
                ? `<button onclick="deleteComment(${comment.id})" class="text-red-500 hover:text-red-700 transition duration-200 mr-7">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-5 h-5">
                        <path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z" fill="currentColor"/>
                    </svg>
                </button>`
                : '';

            var commentHTML = `
                <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br ${randomGradient} flex items-center justify-center text-white font-bold">
                            ${initials}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <h4 class="font-semibold text-gray-900">${fullName}</h4>
                            <span class="text-sm text-gray-500">${timeAgo}</span>
                        </div>
                        <p class="text-gray-700 mb-2">${comment.content}</p>
                    </div>
                    ${deleteButton ? `<div class="flex-shrink-0">${deleteButton}</div>` : ''}
                </div>
            `;
            commentsList.append(commentHTML);
        });
    },

    loadLectureComments: function (lectureId) {
        var self = this;
        this.currentLectureId = lectureId;

        this.getCommentsByLecture(lectureId).done(function (comments) {
            self.renderComments(comments);
        }).fail(function () {
            $('#commentsList').html('<p class="text-center text-gray-600 py-4">Failed to load comments. Please try again later.</p>');
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
            var completedBadge = lecture.is_completed == 1 
                ? '<div class="mt-2 text-xs font-semibold bg-green-400 text-white px-2 py-1 rounded-full">✓ Completed</div>' 
                : '';
            
            var lectureCard = `
                <button onclick="loadLecture(${index})"
                    class="lecture-card bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-200 ${index === 0 ? 'active' : ''}">
                    <div class="text-center">
                        <div class="font-bold text-lg">Lecture ${index + 1}</div>
                        ${completedBadge}
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

