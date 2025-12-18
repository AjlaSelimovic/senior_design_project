var addContentService = {
    editCourseId: null,
    editTypeId: null,
    editLectureId: null,
    editQuizId: null,
    lectureData: null,
    questionCount: 0,
    editQuestionCount: 0,

    // Get URL parameters
    getUrlParameter: function (name) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Get courses from API
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

    getTypes: function (courseId) {
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

    getLectures: function (typeId) {
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

    getQuizzes: function (lectureId) {
        return $.ajax({
            type: "GET",
            url: '/../../OnlineLanguageTeaching/api/quizzes/' + lectureId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Quizzes fetched successfully:', data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 404 is expected when no quiz exists for this lecture, so don't log it as an error
                if (XMLHttpRequest.status !== 404) {
                    console.log('Error fetching quizzes:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            }
        });
    },

    // Populate dropdowns
    populateCourses: function () {
        var dropdown = $('#courseName');

        this.getCourses().done(function (courses) {
            var uniqueCourses = {};
            courses.forEach(function (item) {
                if (!uniqueCourses[item.id]) {
                    uniqueCourses[item.id] = item.name;
                }
            });

            Object.keys(uniqueCourses).forEach(function (courseId) {
                dropdown.append(`<option value="${courseId}">${uniqueCourses[courseId]}</option>`);
            });
        });
    },

    populateTypes: function () {
        var dropdown = $('#courseType');
        var courseId = $('#courseName').val();

        dropdown.empty();
        dropdown.append('<option value="">Select a type</option>');

        if (courseId) {
            this.getTypes(courseId).done(function (types) {
                types.forEach(function (type) {
                    dropdown.append(`<option value="${type.id}">${type.name}</option>`);
                });
            });
        }
    },

    populateLectures: function () {
        var dropdown = $('#lectureName');
        var typeId = $('#courseType').val();

        dropdown.empty();
        dropdown.append('<option value="">Select a lecture</option>');

        if (typeId) {
            this.getLectures(typeId).done(function (lectures) {
                lectures.forEach(function (lecture) {
                    dropdown.append(`<option value="${lecture.id}">${lecture.name}</option>`);
                });
            });
        }
    },

    populateQuizzes: function () {
        var dropdown = $('#quizName');
        var lectureId = $('#lectureName').val();

        console.log('populateQuizzes called with lectureId:', lectureId);

        dropdown.empty();
        dropdown.append('<option value="">Select a quiz</option>');

        if (lectureId) {
            this.getQuizzes(lectureId).done(function (response) {
                console.log('Quizzes received:', response);

                // Handle both single object and array responses
                var quizzes = Array.isArray(response) ? response : [response];

                if (quizzes && quizzes.length > 0 && quizzes[0] && quizzes[0].id) {
                    quizzes.forEach(function (quiz) {
                        dropdown.append(`<option value="${quiz.id}">${quiz.name}</option>`);
                    });
                    console.log('Quizzes populated successfully');
                } else {
                    console.log('No quizzes found for this lecture');
                }
            }).fail(function (xhr, status, error) {
                // 404 is expected when no quiz exists, so don't log it as an error
                if (xhr.status !== 404) {
                    console.error('Failed to load quizzes:', error);
                    console.error('Response:', xhr.responseJSON);
                }
            });
        }
    },

    // Modal functions
    openCourseModal: function () {
        $('#courseModal').removeClass('hidden');
    },

    closeCourseModal: function () {
        $('#courseModal').addClass('hidden');
        $('#newCourseName').val('');
        $('#newAbbreviation').val('');
        $('#newDescription').val('');
    },

    deleteCourse: function () {
        var courseId = $('#courseName').val();

        if (courseId) {
            $.ajax({
                type: "DELETE",
                url: '/../../OnlineLanguageTeaching/api/admin/courses/' + courseId,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Course deleted successfully:', data);

                    // Remove from course dropdown
                    $('#courseName option[value="' + courseId + '"]').remove();
                    $('#courseName').val('');

                    // Clear types dropdown
                    $('#courseType').empty();
                    $('#courseType').append('<option value="">Select a type</option>');

                    // Clear lectures dropdown
                    $('#lectureName').empty();
                    $('#lectureName').append('<option value="">Select a lecture</option>');

                    // Clear quizzes dropdown
                    $('#quizName').empty();
                    $('#quizName').append('<option value="">Select a quiz</option>');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error deleting course:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('Please select a course to delete');
        }
    },

    openEditCourseModal: function () {
        var self = this;
        var courseId = $('#courseName').val();

        if (courseId) {
            this.editCourseId = courseId;

            // Fetch course data
            this.getCourses().done(function (courses) {
                var selectedCourse = null;
                courses.forEach(function (course) {
                    if (course.id == courseId) {
                        selectedCourse = {
                            id: course.id,
                            name: course.name,
                            abbreviation: course.abbreviation,
                            description: course.description
                        };
                    }
                });

                if (selectedCourse) {
                    // Populate modal fields
                    $('#editCourseName').val(selectedCourse.name);
                    $('#editAbbreviation').val(selectedCourse.abbreviation);
                    $('#editDescription').val(selectedCourse.description);

                    // Open modal
                    $('#editCourseModal').removeClass('hidden');
                }
            });
        } else {
            console.log('Please select a course to edit');
        }
    },

    closeEditCourseModal: function () {
        $('#editCourseModal').addClass('hidden');
        $('#editCourseName').val('');
        $('#editAbbreviation').val('');
        $('#editDescription').val('');
        this.editCourseId = null;
    },

    updateCourse: function () {
        var self = this;
        var courseName = $('#editCourseName').val().trim();
        var abbreviation = $('#editAbbreviation').val().trim();
        var description = $('#editDescription').val().trim();

        if (courseName && abbreviation && description && this.editCourseId) {
            var courseData = {
                name: courseName,
                abbreviation: abbreviation,
                description: description
            };

            $.ajax({
                type: "PUT",
                url: '/../../OnlineLanguageTeaching/api/admin/courses/' + this.editCourseId,
                data: JSON.stringify(courseData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Course updated successfully:', data);

                    // Update dropdown text
                    $('#courseName option[value="' + self.editCourseId + '"]').text(courseName);

                    self.closeEditCourseModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error updating course:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    saveNewCourse: function () {
        var self = this;
        var courseName = $('#newCourseName').val().trim();
        var abbreviation = $('#newAbbreviation').val().trim();
        var description = $('#newDescription').val().trim();

        if (courseName && abbreviation && description) {
            var courseData = {
                name: courseName,
                abbreviation: abbreviation,
                description: description
            };

            $.ajax({
                type: "POST",
                url: '/../../OnlineLanguageTeaching/api/admin/courses',
                data: JSON.stringify(courseData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Course created successfully:', data);

                    // Add to dropdown
                    $('#courseName').append(`<option value="${data.id}">${data.name}</option>`);
                    $('#courseName').val(data.id);

                    self.closeCourseModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error creating course:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    openTypeModal: function () {
        var self = this;
        $('#typeModal').removeClass('hidden');

        // Populate course dropdown
        var dropdown = $('#newTypeCourse');
        dropdown.empty();
        dropdown.append('<option value="">Select a course</option>');

        this.getCourses().done(function (courses) {
            courses.forEach(function (course) {
                dropdown.append(`<option value="${course.id}">${course.name}</option>`);
            });
        });
    },

    closeTypeModal: function () {
        $('#typeModal').addClass('hidden');
        $('#newTypeName').val('');
        $('#newTypeDescription').val('');
        $('#newTypeCourse').val('');
    },

    saveNewType: function () {
        var self = this;
        var typeName = $('#newTypeName').val().trim();
        var typeDescription = $('#newTypeDescription').val().trim();
        var courseId = $('#newTypeCourse').val();

        if (typeName && typeDescription && courseId) {
            var typeData = {
                name: typeName,
                description: typeDescription,
                course_id: courseId
            };

            $.ajax({
                type: "POST",
                url: '/../../OnlineLanguageTeaching/api/admin/types',
                data: JSON.stringify(typeData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Type created successfully:', data);

                    // Add to dropdown
                    $('#courseType').append(`<option value="${data.id}">${data.name}</option>`);
                    $('#courseType').val(data.id);

                    // Clear lectures dropdown and populate for new type
                    self.populateLectures();

                    // Clear quizzes dropdown
                    $('#quizName').empty();
                    $('#quizName').append('<option value="">Select a quiz</option>');

                    self.closeTypeModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error creating type:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    deleteType: function () {
        var typeId = $('#courseType').val();

        if (typeId) {
            $.ajax({
                type: "DELETE",
                url: '/../../OnlineLanguageTeaching/api/admin/types/' + typeId,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Type deleted successfully:', data);

                    // Remove from dropdown
                    $('#courseType option[value="' + typeId + '"]').remove();
                    $('#courseType').val('');

                    // Clear lectures dropdown
                    $('#lectureName').empty();
                    $('#lectureName').append('<option value="">Select a lecture</option>');

                    // Clear quizzes dropdown
                    $('#quizName').empty();
                    $('#quizName').append('<option value="">Select a quiz</option>');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error deleting type:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('Please select a type to delete');
        }
    },

    openEditTypeModal: function () {
        var self = this;
        var typeId = $('#courseType').val();
        var courseId = $('#courseName').val();

        if (typeId && courseId) {
            this.editTypeId = typeId;

            // Fetch type data
            this.getTypes(courseId).done(function (types) {
                var selectedType = null;
                types.forEach(function (type) {
                    if (type.id == typeId) {
                        selectedType = {
                            id: type.id,
                            name: type.name,
                            description: type.description,
                            course_id: type.course_id
                        };
                    }
                });

                if (selectedType) {
                    // Populate course dropdown
                    var dropdown = $('#editTypeCourse');
                    dropdown.empty();
                    dropdown.append('<option value="">Select a course</option>');

                    self.getCourses().done(function (courses) {
                        courses.forEach(function (course) {
                            dropdown.append(`<option value="${course.id}">${course.name}</option>`);
                        });

                        // Populate modal fields
                        $('#editTypeName').val(selectedType.name);
                        $('#editTypeDescription').val(selectedType.description);
                        $('#editTypeCourse').val(selectedType.course_id);

                        // Open modal
                        $('#editTypeModal').removeClass('hidden');
                    });
                }
            });
        } else {
            console.log('Please select a type to edit');
        }
    },

    closeEditTypeModal: function () {
        $('#editTypeModal').addClass('hidden');
        $('#editTypeName').val('');
        $('#editTypeDescription').val('');
        $('#editTypeCourse').val('');
        this.editTypeId = null;
    },

    updateType: function () {
        var self = this;
        var typeName = $('#editTypeName').val().trim();
        var typeDescription = $('#editTypeDescription').val().trim();
        var courseId = $('#editTypeCourse').val();

        if (typeName && typeDescription && courseId && this.editTypeId) {
            var typeData = {
                name: typeName,
                description: typeDescription,
                course_id: courseId
            };

            $.ajax({
                type: "PUT",
                url: '/../../OnlineLanguageTeaching/api/admin/types/' + this.editTypeId,
                data: JSON.stringify(typeData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Type updated successfully:', data);

                    // Update dropdown text
                    $('#courseType option[value="' + self.editTypeId + '"]').text(typeName);

                    self.closeEditTypeModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error updating type:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    openLectureModal: function () {
        $('#lectureModal').removeClass('hidden');
    },

    closeLectureModal: function () {
        $('#lectureModal').addClass('hidden');
        $('#modalLectureName').val('');
        $('#modalLectureDescription').val('');
        $('#modalDifficulty').val('');
        $('#modalVideoUrl').val('');
    },

    saveNewLecture: function () {
        var self = this;
        var lectureName = $('#modalLectureName').val().trim();
        var lectureDescription = $('#modalLectureDescription').val().trim();
        var difficulty = $('#modalDifficulty').val();
        var videoUrl = $('#modalVideoUrl').val().trim();
        var typeId = $('#courseType').val();

        if (lectureName && lectureDescription && difficulty && videoUrl && typeId) {
            var lectureData = {
                name: lectureName,
                description: lectureDescription,
                difficulty: difficulty,
                video_url: videoUrl,
                type_id: typeId
            };

            $.ajax({
                type: "POST",
                url: '/../../OnlineLanguageTeaching/api/admin/lectures',
                data: JSON.stringify(lectureData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Lecture created successfully:', data);

                    // Store lecture data
                    self.lectureData = data;

                    // Add to dropdown
                    $('#lectureName').append(`<option value="${data.id}">${data.name}</option>`);
                    $('#lectureName').val(data.id);

                    // Populate quizzes for the new lecture
                    self.populateQuizzes();

                    self.closeLectureModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error creating lecture:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    deleteLecture: function () {
        var lectureId = $('#lectureName').val();

        if (lectureId) {
            $.ajax({
                type: "DELETE",
                url: '/../../OnlineLanguageTeaching/api/admin/lectures/' + lectureId,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Lecture deleted successfully:', data);

                    // Remove from dropdown
                    $('#lectureName option[value="' + lectureId + '"]').remove();
                    $('#lectureName').val('');

                    // Clear quizzes dropdown
                    $('#quizName').empty();
                    $('#quizName').append('<option value="">Select a quiz</option>');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error deleting lecture:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('Please select a lecture to delete');
        }
    },

    openEditLectureModal: function () {
        var self = this;
        var lectureId = $('#lectureName').val();
        var typeId = $('#courseType').val();

        if (lectureId && typeId) {
            this.editLectureId = lectureId;

            // Fetch lecture data
            this.getLectures(typeId).done(function (lectures) {
                var selectedLecture = null;
                lectures.forEach(function (lecture) {
                    if (lecture.id == lectureId) {
                        selectedLecture = {
                            id: lecture.id,
                            name: lecture.name,
                            description: lecture.description,
                            difficulty: lecture.difficulty,
                            video_url: lecture.video_url
                        };
                    }
                });

                if (selectedLecture) {
                    // Populate modal fields
                    $('#editLectureName').val(selectedLecture.name);
                    $('#editLectureDescription').val(selectedLecture.description);
                    $('#editDifficulty').val(selectedLecture.difficulty);
                    $('#editVideoUrl').val(selectedLecture.video_url);

                    // Open modal
                    $('#editLectureModal').removeClass('hidden');
                }
            });
        } else {
            console.log('Please select a lecture to edit');
        }
    },

    closeEditLectureModal: function () {
        $('#editLectureModal').addClass('hidden');
        $('#editLectureName').val('');
        $('#editLectureDescription').val('');
        $('#editDifficulty').val('');
        $('#editVideoUrl').val('');
        this.editLectureId = null;
    },

    updateLecture: function () {
        var self = this;
        var lectureName = $('#editLectureName').val().trim();
        var lectureDescription = $('#editLectureDescription').val().trim();
        var difficulty = $('#editDifficulty').val();
        var videoUrl = $('#editVideoUrl').val().trim();
        var typeId = $('#courseType').val();

        if (lectureName && lectureDescription && difficulty && videoUrl && typeId && this.editLectureId) {
            var lectureData = {
                name: lectureName,
                description: lectureDescription,
                difficulty: difficulty,
                video_url: videoUrl,
                type_id: typeId
            };

            $.ajax({
                type: "PUT",
                url: '/../../OnlineLanguageTeaching/api/admin/lectures/' + this.editLectureId,
                data: JSON.stringify(lectureData),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Lecture updated successfully:', data);

                    // Update dropdown text
                    $('#lectureName option[value="' + self.editLectureId + '"]').text(lectureName);

                    self.closeEditLectureModal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error updating lecture:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('All fields are required');
        }
    },

    // Quiz functions
    addQuestion: function () {
        this.questionCount++;
        var questionHtml = `
            <div class="question-block mt-6 p-4 border-2 border-gray-200 rounded-lg" data-question-id="${this.questionCount}">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-lg font-semibold text-gray-900">Question ${this.questionCount}</h4>
                    <button type="button" onclick="addContentService.removeQuestion(${this.questionCount})" 
                        class="text-red-500 hover:text-red-700 font-semibold">
                        Remove
                    </button>
                </div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Question Content</label>
                <input type="text" class="question-content w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    placeholder="Enter question">
                
                <label class="block text-sm font-semibold text-gray-900 mb-2">Answers (select the correct one)</label>
                <div class="space-y-2">
                    ${[1, 2, 3, 4].map(i => `
                        <div class="flex items-center gap-2">
                            <input type="radio" name="correct_${this.questionCount}" value="${i}" 
                                class="w-4 h-4" ${i === 1 ? 'checked' : ''}>
                            <input type="text" class="answer-content flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Answer ${i}" data-answer-num="${i}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        $('#questionsContainer').append(questionHtml);
    },

    removeQuestion: function (questionId) {
        $(`.question-block[data-question-id="${questionId}"]`).remove();
    },

    addEditQuestion: function () {
        this.editQuestionCount++;
        var questionHtml = `
            <div class="question-block mt-6 p-4 border-2 border-gray-200 rounded-lg" data-question-id="${this.editQuestionCount}">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-lg font-semibold text-gray-900">Question ${this.editQuestionCount}</h4>
                    <button type="button" onclick="addContentService.removeEditQuestion(${this.editQuestionCount})" 
                        class="text-red-500 hover:text-red-700 font-semibold">
                        Remove
                    </button>
                </div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Question Content</label>
                <input type="text" class="question-content w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    placeholder="Enter question">
                
                <label class="block text-sm font-semibold text-gray-900 mb-2">Answers (select the correct one)</label>
                <div class="space-y-2">
                    ${[1, 2, 3, 4].map(i => `
                        <div class="flex items-center gap-2">
                            <input type="radio" name="edit_correct_${this.editQuestionCount}" value="${i}" 
                                class="w-4 h-4" ${i === 1 ? 'checked' : ''}>
                            <input type="text" class="answer-content flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Answer ${i}" data-answer-num="${i}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        $('#editQuestionsContainer').append(questionHtml);
    },

    removeEditQuestion: function (questionId) {
        $(`#editQuestionsContainer .question-block[data-question-id="${questionId}"]`).remove();
    },

    openQuizModal: function () {
        this.questionCount = 0;
        $('#questionsContainer').empty();
        this.addQuestion();
        $('#quizModal').removeClass('hidden');
    },

    closeQuizModal: function () {
        $('#quizModal').addClass('hidden');
        $('#modalQuizName').val('');
        $('#questionsContainer').empty();
        this.questionCount = 0;
    },

    saveNewQuiz: function () {
        var self = this;
        var quizName = $('#modalQuizName').val().trim();
        var lectureId = $('#lectureName').val();

        if (!quizName || !lectureId) {
            console.log('Quiz name and lecture are required');
            return;
        }

        var questions = [];
        $('#questionsContainer .question-block').each(function () {
            var questionContent = $(this).find('.question-content').val().trim();
            var correctAnswerNum = $(this).find('input[type="radio"]:checked').val();
            var answers = [];

            $(this).find('.answer-content').each(function () {
                var answerContent = $(this).val().trim();
                var answerNum = $(this).data('answer-num');
                if (answerContent) {
                    answers.push({
                        content: answerContent,
                        is_correct: answerNum == correctAnswerNum ? 1 : 0
                    });
                }
            });

            if (questionContent && answers.length === 4) {
                questions.push({
                    content: questionContent,
                    answers: answers
                });
            }
        });

        if (questions.length === 0) {
            console.log('At least one complete question with 4 answers is required');
            return;
        }

        var quizData = {
            name: quizName,
            lecture_id: lectureId,
            questions: questions
        };

        $.ajax({
            type: "POST",
            url: '/../../OnlineLanguageTeaching/api/admin/quizzes',
            data: JSON.stringify(quizData),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Quiz created successfully:', data);
                console.log('Quiz data structure:', JSON.stringify(data));

                // Handle different possible response structures
                var quizId = data.id || data.quiz_id;
                var quizName = data.name || data.quiz_name || quizData.name;

                if (quizId) {
                    // Add to dropdown
                    $('#quizName').append(`<option value="${quizId}">${quizName}</option>`);
                    $('#quizName').val(quizId);
                } else {
                    console.error('No quiz ID returned from API');
                }

                self.closeQuizModal();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error creating quiz:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    deleteQuiz: function () {
        var quizId = $('#quizName').val();

        if (quizId) {
            $.ajax({
                type: "DELETE",
                url: '/../../OnlineLanguageTeaching/api/admin/quizzes/' + quizId,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function (xhr) {
                    var token = localStorage.getItem("token");
                    if (token) {
                        xhr.setRequestHeader("Authorization", token);
                    }
                },
                success: function (data) {
                    console.log('Quiz deleted successfully:', data);

                    // Remove from dropdown
                    $('#quizName option[value="' + quizId + '"]').remove();
                    $('#quizName').val('');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error deleting quiz:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
                }
            });
        } else {
            console.log('Please select a quiz to delete');
        }
    },

    openEditQuizModal: function () {
        var self = this;
        var quizId = $('#quizName').val();
        var lectureId = $('#lectureName').val();

        if (quizId && lectureId) {
            this.editQuizId = quizId;
            this.editQuestionCount = 0;

            // Fetch quiz data
            this.getQuizzes(lectureId).done(function (response) {
                // Handle both single object and array responses
                var quizzes = Array.isArray(response) ? response : [response];
                var selectedQuiz = null;

                quizzes.forEach(function (quiz) {
                    if (quiz.id == quizId) {
                        selectedQuiz = quiz;
                    }
                });

                if (selectedQuiz) {
                    // Populate quiz name
                    $('#editModalQuizName').val(selectedQuiz.name);

                    // Clear and populate questions
                    $('#editQuestionsContainer').empty();

                    if (selectedQuiz.questions && selectedQuiz.questions.length > 0) {
                        selectedQuiz.questions.forEach(function (question) {
                            self.editQuestionCount++;
                            var questionHtml = `
                                <div class="question-block mt-6 p-4 border-2 border-gray-200 rounded-lg" data-question-id="${self.editQuestionCount}">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="text-lg font-semibold text-gray-900">Question ${self.editQuestionCount}</h4>
                                        <button type="button" onclick="addContentService.removeEditQuestion(${self.editQuestionCount})" 
                                            class="text-red-500 hover:text-red-700 font-semibold">
                                            Remove
                                        </button>
                                    </div>
                                    <label class="block text-sm font-semibold text-gray-900 mb-2">Question Content</label>
                                    <input type="text" class="question-content w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                                        placeholder="Enter question" value="${question.content}">
                                    
                                    <label class="block text-sm font-semibold text-gray-900 mb-2">Answers (select the correct one)</label>
                                    <div class="space-y-2">
                                        ${question.answers.map((answer, idx) => `
                                            <div class="flex items-center gap-2">
                                                <input type="radio" name="edit_correct_${self.editQuestionCount}" value="${idx + 1}" 
                                                    class="w-4 h-4" ${answer.is_correct ? 'checked' : ''}>
                                                <input type="text" class="answer-content flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Answer ${idx + 1}" data-answer-num="${idx + 1}" value="${answer.content}">
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                            $('#editQuestionsContainer').append(questionHtml);
                        });
                    } else {
                        self.addEditQuestion();
                    }

                    // Open modal
                    $('#editQuizModal').removeClass('hidden');
                }
            });
        } else {
            console.log('Please select a quiz to edit');
        }
    },

    closeEditQuizModal: function () {
        $('#editQuizModal').addClass('hidden');
        $('#editModalQuizName').val('');
        $('#editQuestionsContainer').empty();
        this.editQuizId = null;
        this.editQuestionCount = 0;
    },

    updateQuiz: function () {
        var self = this;
        var quizName = $('#editModalQuizName').val().trim();
        var lectureId = $('#lectureName').val();

        if (!quizName || !lectureId || !this.editQuizId) {
            console.log('Quiz name and lecture are required');
            return;
        }

        var questions = [];
        $('#editQuestionsContainer .question-block').each(function () {
            var questionContent = $(this).find('.question-content').val().trim();
            var correctAnswerNum = $(this).find('input[type="radio"]:checked').val();
            var answers = [];

            $(this).find('.answer-content').each(function () {
                var answerContent = $(this).val().trim();
                var answerNum = $(this).data('answer-num');
                if (answerContent) {
                    answers.push({
                        content: answerContent,
                        is_correct: answerNum == correctAnswerNum ? 1 : 0
                    });
                }
            });

            if (questionContent && answers.length === 4) {
                questions.push({
                    content: questionContent,
                    answers: answers
                });
            }
        });

        if (questions.length === 0) {
            console.log('At least one complete question with 4 answers is required');
            return;
        }

        var quizData = {
            name: quizName,
            lecture_id: lectureId,
            questions: questions
        };

        $.ajax({
            type: "PUT",
            url: '/../../OnlineLanguageTeaching/api/admin/quizzes/' + this.editQuizId,
            data: JSON.stringify(quizData),
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                var token = localStorage.getItem("token");
                if (token) {
                    xhr.setRequestHeader("Authorization", token);
                }
            },
            success: function (data) {
                console.log('Quiz updated successfully:', data);

                // Update dropdown text
                $('#quizName option[value="' + self.editQuizId + '"]').text(quizName);

                self.closeEditQuizModal();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Error updating quiz:', XMLHttpRequest.responseJSON ? XMLHttpRequest.responseJSON.message : errorThrown);
            }
        });
    },

    // Load content for editing from URL parameters
    loadEditMode: function () {
        var self = this;
        var courseId = this.getUrlParameter('course_id');
        var typeId = this.getUrlParameter('type_id');
        var lectureId = this.getUrlParameter('lecture_id');

        if (courseId && typeId && lectureId) {
            console.log('Edit mode detected. Loading data for course:', courseId, 'type:', typeId, 'lecture:', lectureId);

            // Wait for courses to populate, then set the course
            this.getCourses().done(function (courses) {
                $('#courseName').val(courseId);

                // Load and set types
                self.getTypes(courseId).done(function (types) {
                    types.forEach(function (type) {
                        $('#courseType').append(`<option value="${type.id}">${type.name}</option>`);
                    });
                    $('#courseType').val(typeId);

                    // Load and set lectures
                    self.getLectures(typeId).done(function (lectures) {
                        lectures.forEach(function (lecture) {
                            $('#lectureName').append(`<option value="${lecture.id}">${lecture.name}</option>`);
                        });
                        $('#lectureName').val(lectureId);

                        // Load and set quiz if it exists
                        self.getQuizzes(lectureId).done(function (response) {
                            var quizzes = Array.isArray(response) ? response : [response];
                            if (quizzes && quizzes.length > 0 && quizzes[0] && quizzes[0].id) {
                                quizzes.forEach(function (quiz) {
                                    $('#quizName').append(`<option value="${quiz.id}">${quiz.name}</option>`);
                                });
                                $('#quizName').val(quizzes[0].id);
                            }
                        });
                    });
                });
            });
        }
    },

    // Initialize the service
    init: function () {
        var self = this;

        // Populate dropdowns
        this.populateCourses();

        // Check if we're in edit mode
        var courseId = this.getUrlParameter('course_id');
        if (courseId) {
            this.loadEditMode();
        }

        // Event listener for course selection
        $('#courseName').on('change', function () {
            self.populateTypes();
            // Clear lectures when course changes
            $('#lectureName').empty();
            $('#lectureName').append('<option value="">Select a lecture</option>');
            // Clear quizzes when course changes
            $('#quizName').empty();
            $('#quizName').append('<option value="">Select a quiz</option>');
        });

        // Event listener for type selection
        $('#courseType').on('change', function () {
            self.populateLectures();
            // Clear quizzes when type changes
            $('#quizName').empty();
            $('#quizName').append('<option value="">Select a quiz</option>');
        });

        // Event listener for lecture selection
        $('#lectureName').on('change', function () {
            console.log('Lecture selection changed, populating quizzes...');
            self.populateQuizzes();
        });

        console.log('Add Content Service initialized');
    }
};

