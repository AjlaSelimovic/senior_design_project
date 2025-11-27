var quizService = {
    quizData: null,
    userAnswers: {},
    currentQuestionIndex: 1,
    lectureId: null,

    init: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const lectureId = urlParams.get('lecture_id');

        if (!lectureId) {
            alert('No lecture selected!');
            window.location.href = 'lectures.html';
            return;
        }

        this.lectureId = lectureId;
        this.fetchQuiz(lectureId);
        this.updateBackButton();
    },

    updateBackButton: function () {
        const backButton = document.getElementById('backToLectureBtn');
        if (backButton) {
            const urlParams = new URLSearchParams(window.location.search);
            const typeId = urlParams.get('type_id');
            backButton.href = 'lectures.html?type_id=' + typeId;
        }
    },

    fetchQuiz: function (lectureId) {
        $.ajax({
            type: 'GET',
            url: '/../../OnlineLanguageTeaching/api/quizzes/' + lectureId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                const token = localStorage.getItem('token');
                if (token) {
                    xhr.setRequestHeader('Authorization', token);
                }
            },
            success: function (response) {
                quizService.quizData = response;
                quizService.renderQuiz();
            },
            error: function (xhr) {
                alert('Failed to load quiz. Please try again.');
                const urlParams = new URLSearchParams(window.location.search);
                const typeId = urlParams.get('type_id');
                window.location.href = 'lectures.html?type_id=' + typeId;
            }
        });
    },

    renderQuiz: function () {
        if (!this.quizData || !this.quizData.questions) {
            return;
        }

        const totalQuestions = this.quizData.questions.length;
        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('currentQuestion').textContent = '1';

        const questionContainer = document.getElementById('questionContainer');
        questionContainer.innerHTML = '';

        this.quizData.questions.forEach((question, index) => {
            const questionNumber = index + 1;
            const isFirst = questionNumber === 1;
            const isLast = questionNumber === totalQuestions;

            const questionHTML = `
                <div class="question-slide ${isFirst ? '' : 'hidden'}" data-question="${questionNumber}">
                    <div class="mb-8">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-6">
                            ${question.content}
                        </h2>

                        <div class="space-y-4">
                            ${question.answers.map((answer, answerIndex) => `
                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition duration-200">
                                    <input type="radio" name="question${question.id}" value="${answer.id}" 
                                        class="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                        onchange="quizService.saveAnswer(${question.id}, ${answer.id}, ${answer.is_correct})">
                                    <span class="ml-4 text-lg text-gray-700">${String.fromCharCode(65 + answerIndex)}. ${answer.content}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <button onclick="quizService.previousQuestion()" 
                            class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            ${isFirst ? 'disabled' : ''}>
                            Previous
                        </button>
                        ${isLast ? `
                            <button onclick="quizService.submitQuiz()" 
                                class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                Submit Quiz
                            </button>
                        ` : `
                            <button onclick="quizService.nextQuestion()" 
                                class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-violet-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                Next Question
                            </button>
                        `}
                    </div>
                </div>
            `;

            questionContainer.innerHTML += questionHTML;
        });
    },

    saveAnswer: function (questionId, answerId, isCorrect) {
        this.userAnswers[questionId] = {
            answerId: answerId,
            isCorrect: isCorrect
        };
    },

    showQuestion: function (questionNumber) {
        const slides = document.querySelectorAll('.question-slide');
        slides.forEach(slide => {
            if (parseInt(slide.dataset.question) === questionNumber) {
                slide.classList.remove('hidden');
            } else {
                slide.classList.add('hidden');
            }
        });
        this.currentQuestionIndex = questionNumber;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex;
    },

    nextQuestion: function () {
        const totalQuestions = this.quizData.questions.length;
        if (this.currentQuestionIndex < totalQuestions) {
            this.showQuestion(this.currentQuestionIndex + 1);
        }
    },

    previousQuestion: function () {
        if (this.currentQuestionIndex > 1) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    },

    submitQuiz: function () {
        let correctAnswers = 0;
        const totalQuestions = this.quizData.questions.length;

        for (let questionId in this.userAnswers) {
            if (this.userAnswers[questionId].isCorrect) {
                correctAnswers++;
            }
        }

        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const allCorrect = correctAnswers === totalQuestions;

        document.getElementById('scoreDisplay').textContent = correctAnswers + '/' + totalQuestions;
        document.getElementById('percentageDisplay').textContent = percentage + '%';

        // Update UI based on pass/fail
        const resultIcon = document.getElementById('resultIcon');
        const successIcon = document.getElementById('successIcon');
        const failIcon = document.getElementById('failIcon');
        const resultTitle = document.getElementById('resultTitle');

        if (allCorrect) {
            // All correct - show success
            resultIcon.className = 'mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6';
            successIcon.classList.remove('hidden');
            failIcon.classList.add('hidden');
            resultTitle.textContent = 'Quiz Complete!';

            // Submit quiz completion to the backend
            this.completeQuiz(this.quizData.id);
        } else {
            // One or more wrong - show failure
            resultIcon.className = 'mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6';
            successIcon.classList.add('hidden');
            failIcon.classList.remove('hidden');
            resultTitle.textContent = 'Quiz Failed!';
        }

        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('resultsContainer').classList.remove('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    completeQuiz: function (quizId) {
        $.ajax({
            type: 'POST',
            url: '/../../OnlineLanguageTeaching/api/quizzes/' + quizId,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                const token = localStorage.getItem('token');
                if (token) {
                    xhr.setRequestHeader('Authorization', token);
                }
            },
            success: function (response) {
                console.log('Quiz completion recorded successfully:', response);
            },
            error: function (xhr) {
                console.error('Failed to record quiz completion:', xhr);
            }
        });
    }
};

