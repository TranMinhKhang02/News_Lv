var newsContent = '';

$(document).ready(function () {
    var userId = sessionStorage.getItem('userId');
    if (!userId) {
        $('#toggle-summary-btn').remove()
        $('#news-summary').remove()
    }
    showLoading()
    $('#homeNavbar').removeClass('active');
    $('#singleNavbar').addClass('active');

    // Fetch news by ID when the page loads
    var newsId = getNewsIdFromUrl();

    /*if(newsId) {
        var baseAudioSrc  = /!*[[@{/static/audio_files/news-}]]*!/ '';
        var fullAudioSrc = baseAudioSrc + newsId + '.mp3';
        console.log('Audio source:', fullAudioSrc);
        $('#audioSource').attr('src', fullAudioSrc);
    } else {
        console.error("newsId không được tìm thấy trong URL.");
    }*/

    /*===========Truyền source newsId vào audio===================*/
    /*$('#audioSource').attr('src', '/news_lv/static/audio_files/news-' + newsId + '.mp3')*/

    getAllInteract()

    if (newsId) {
        sessionStorage.setItem('currentNewsId', newsId); // lưu newsId vào sessionStorage
        fetchNewsById(newsId);
        fetchComments(newsId);
    } else {
        console.error('newsId is null or undefined');
    }

    // ===============================SINGLE NEWS================================
    function fetchNewsById(newsId) {
        $.ajax({
            url: '/news_lv/news/single/' + newsId,
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && response.result) {
                    renderNewsDetails(response.result);
                    newsContent = response.result.content;
                    speakContent(newsContent, response.result.summarized);
                    console.log('CategoryCode: ', response.result.categories[0].code)
                    fetchNewsByTopModifiedByCategory(response.result.categories[0].code)
                    console.log('News details:', response.result);
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
            error: function(error) {
                console.error('Error fetching news:', error);
            }
        });
    }

    function renderNewsDetails(news) {
        var audio = $('#audioSource');
        sessionStorage.setItem('categoryCode', news.categories[0].code);

        $('#news-title').text(news.title);
        // $('#news-content').html(news.content);
        $('#news-thumbnail').attr('src', news.thumbnail);
        $('#news-date').text(new Date(news.modifiedDate).toLocaleDateString());
        $('#news-category').text(news.categories[0].name);
        // $('#audioElement')[0].load();
        $('#news-comments-count').text(news.countComment + ' Bình luận');
        /*$('#like-count').text(news.countLike + ' Yêu thích');
        $('#view-count').text(news.countView + ' Luợt xem');*/
        // Hiển thị nội dung vào trong CKEditor
        if (window.editor) {
            window.editor.setData(news.content);
        } else {
            console.error("CKEditor chưa được khởi tạo hoặc gán cho biến editor.");
        }

        var categoryHtml = '';
        if (news.categories.length > 0) {
            // Lấy danh mục đầu tiên
            var category = news.categories[0];

            // Nếu danh mục có danh mục cha, hiển thị danh mục cha
            if (category.parentCategory != null) {
                categoryHtml += '<a class="breadcrumb-item" href="#">' + category.parentCategory.name + '</a>';
            }

            // Hiển thị danh mục hiện tại
            categoryHtml += '<span class="breadcrumb-item active" href="#">' + category.name + '</span>';
        }
        $('#breadcrumb-category').html(categoryHtml);

        // Loại bỏ dấu ngoặc kép ở đầu và cuối chuỗi nếu có
        // let cleanedSummary = news.summary.replace(/^"|"$/g, '');
        $('#news-summaryText').text(news.summary);
        audio.attr('src', news.audioPath);

        var source = $('#source');
        if (news.source != null || news.source !== '') {
            $(source).removeClass('d-none');
            $(source).attr('href', news.source);
        } else {
            $(source).addClass('d-none');
        }

        hideLoading()
    }

    fetchNewsByTopViewInItem()

    /*var categoryCode = sessionStorage.getItem('categoryCode');
    fetchNewsByTopModifiedByCategory(categoryCode)*/

    //===============================COMMENT================================
    // fetchComments(newsId);
    // ============================LIKE================================
    checkFavoriteNews();

    // Gọi hàm updateCounts khi trang được tải
    // updateCounts();
    /*// Tăng view
    $('#incrementViewButton').click(function () {
        viewCount();
    });*/

    setTimeout(function () {
        viewCount()
    }, 1000) // 10s
});

$(document).on('click', '#toggle-summary-btn', function () {
    var summary = $('#news-summary');
    if (summary.css('display') === 'none') {
        summary.css('display', 'block');
        this.textContent = 'Ẩn tóm tắt';
    } else {
        summary.css('display', 'none');
        this.textContent = 'Xem tóm tắt';
    }
})

/*let speechSynthesisUtterance;
let isPlaying = false;
let textContent = 'Đây là nội dung giọng nói của bạn.'; // Văn bản để chuyển thành giọng nói
let speechPosition = 0;

function togglePlayPause() {
    if (isPlaying) {
        window.speechSynthesis.pause();
        document.getElementById("playPauseBtn").textContent = "Phát";
    } else {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        } else {
            speakContent(textContent);
        }
        document.getElementById("playPauseBtn").textContent = "Dừng";
    }
    isPlaying = !isPlaying;
}

function speakContent(content) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    speechSynthesisUtterance = new SpeechSynthesisUtterance(content);
    speechSynthesisUtterance.lang = 'vi-VN';
    speechSynthesisUtterance.onboundary = (event) => {
        if (event.name === 'word') {
            speechPosition = event.charIndex;
            updateSeekBar();
        }
    };
    speechSynthesisUtterance.onend = () => {
        document.getElementById("playPauseBtn").textContent = "Phát";
        isPlaying = false;
    };
    window.speechSynthesis.speak(speechSynthesisUtterance);
    isPlaying = true;
}

function updateSeekBar() {
    let progress = (speechPosition / textContent.length) * 100;
    document.getElementById("seekBar").value = progress;
    document.getElementById("current-time").textContent = `${Math.floor(progress)}%`; // Hiển thị % đã đọc
}

function seekSpeech() {
    let seekValue = document.getElementById("seekBar").value;
    let targetIndex = Math.floor((seekValue / 100) * textContent.length);
    if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel();
        const newText = textContent.substring(targetIndex);
        speakContent(newText);
    }
}

function rewindSpeech() {
    if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel();
        speechPosition = Math.max(0, speechPosition - 50);
        const newText = textContent.substring(speechPosition);
        speakContent(newText);
    }
}*/
/*var speechSynthesisUtterance;

function speakBtn() {
    console.log('speakBtn called');
    speakContent(newsContent);
}

function convertTextToSpeak() {
    speakBtnFPT(newsContent);
}*/

/*function speakBtnFPT(newsContent) {
    const text = newsContent;
    console.log('Text to speak:', text);
    const voice = document.getElementById('voiceSelect').value;
    const speed = document.getElementById('speedRange').value;
    convertTextToSpeech(text, voice, speed);
}

function convertTextToSpeech(text, voice, speed) {
    const apiKey = 'ojrzH55757sKoE63cieiWrY9DUCVPAlI';
    const url = 'https://api.fpt.ai/hmi/tts/v5';

    fetch(url, {
        method: 'POST',
        headers: {
            'api-key': apiKey,
            'voice': voice,
            'speed': speed,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ text: text })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.async) {
                const audio = new Audio(data.async);
                audio.play();
            } else {
                console.error('Error in response:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}*/

function speakContent(content, summarized) {
    // Kiểm tra nếu URL hiện tại không phải là trang single thì dừng phát giọng nói
    if (!window.location.href.includes('/page/single')) {
        window.speechSynthesis.cancel();
        return;
    }

    // Chuyển đổi nội dung HTML thành các phần tử DOM
    var parser = new DOMParser();
    var doc = parser.parseFromString(content, 'text/html');

    // Lấy tất cả các thẻ <p> trong nội dung
    var paragraphs = doc.querySelectorAll('p');
    var textToSpeak = '';

    // Duyệt qua từng thẻ <p> và lấy nội dung
    paragraphs.forEach(function(paragraph) {
        textToSpeak += paragraph.textContent + ' ';
    });

    console.log('Text to speak:', textToSpeak.trim());

    // Gọi hàm speak với nội dung đã lấy
    newsContent = textToSpeak.trim();
    var newsId = getNewsIdFromUrl();
    convertTTS(newsId, newsContent);

    // Chỉ tóm tắt nếu `summarized` là `false`
    if (!summarized) {
        summarizeContent(newsContent);
    }
    // speak(newsContent);
    // speakBtnFPT(newsContent)
}

function summarizeContent(content) {
    // API URL và API Key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCJMwDDPf0MWA8fOxR0I6UXJSOwXCaCllg';

    // Chuẩn bị dữ liệu yêu cầu cho API
    const requestData = {
        contents: [{
            parts: [{
                text: `Tóm tắt nội dung chính khoảng 10 dòng, không thêm bất kỳ thông tin liên quan nào khác: ${content}`
            }]
        }]
    };

    // Gửi yêu cầu AJAX
    $.ajax({
        url: apiUrl,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(requestData),
        success: function(response) {
            console.log('API Gemini response:', response);
            // Trích xuất nội dung tóm tắt
            let summaryText = response.candidates[0].content.parts[0].text;
            // Loại bỏ các ký tự không mong muốn
            summaryText = summaryText.replace(/[\n"]/g, '');
            $('#news-summaryText').text(summaryText);
            updateSummarize(summaryText);
            console.log('Nội dung đã tóm tắt:', summaryText);
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi gọi API Gemini:', xhr.responseText || error);
        }
    });
}
/*function summarizeContent(content) {
    // API URL và API Key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCJMwDDPf0MWA8fOxR0I6UXJSOwXCaCllg';

    // Chuẩn bị dữ liệu yêu cầu cho API
    const requestData = {
        contents: [{
            parts: [{
                text: `Tóm tắt nội dung chính khoảng 10 dòng, không thêm bất kỳ thông tin liên quan nào khác: ${content}`
            }]
        }]
    };

    // Gửi yêu cầu AJAX
    $.ajax({
        url: apiUrl,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(requestData),
        success: function(response) {
            // Trích xuất nội dung tóm tắt
            const summaryText = response.candidates[0].content.parts[0].text;
            $('#news-summaryText').text(summaryText);
            updateSummarize(summaryText);
            console.log('Nội dung đã tóm tắt:', summaryText);
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi gọi API Gemini:', xhr.responseText || error);
        }
    });
}*/

function updateSummarize(summarize) {
    var newsId = getNewsIdFromUrl();
    $.ajax({
        url: '/news_lv/news/summarize/' + newsId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(summarize),
        success: function(response) {
            console.log('Đã cập nhật tóm tắt');
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi cập nhật tóm tắt:', xhr.responseText || error);
        }
    })
}

function convertTTS(newsId, newsContent) {
    console.log('TextNews Convert', newsContent)
    $.ajax({
        url: '/news_lv/tts/convert/' + newsId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newsContent),
        success: function(response) {
            console.log('Audio file path:', response);
            // Xử lý response nếu cần
            $('#audioSource').attr('src', response);
            $('#audioElement')[0].load();
        },
        error: function(xhr, status, error) {
            console.error('Đã xảy ra lỗi khi gọi API:', error);
        }
    });
}

/*function convertTextToSpeech(text) {
    const apiKey = 'ojrzH55757sKoE63cieiWrY9DUCVPAlI';
    const url = 'https://api.fpt.ai/hmi/tts/v5';
    const voice = 'banmai';
    const speed = '0'; // Tốc độ đọc, có thể điều chỉnh

    fetch(url, {
        method: 'POST',
        headers: {
            'api-key': apiKey,
            'voice': voice,
            'speed': speed,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ text: text })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.async) {
                const audio = new Audio(data.async);
                audio.play();
            } else {
                console.error('Error in response:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}*/

/*function speak(text) {
    console.log('Text to speak:', text);
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'vi-VN'; // Đặt ngôn ngữ là tiếng Việt
    window.speechSynthesis.speak(speech);
}

function pauseSpeech() {
    window.speechSynthesis.pause();
}

function resumeSpeech() {
    window.speechSynthesis.resume();
}

function rewindSpeech() {
    if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel();
        const currentText = speechSynthesisUtterance.text;
        const currentIndex = speechSynthesisUtterance.charIndex;
        const rewindIndex = Math.max(0, currentIndex - 50); // Tua lại 50 ký tự
        const newText = currentText.substring(rewindIndex);
        speak(newText);
    }
}*/

const userId = sessionStorage.getItem('userId');

// ====================================News By Item==============================
function fetchNewsByTopViewInItem() {
    var topViewsContent = $('#topViewsInItem');
    topViewsContent.empty();
    $.ajax({
        url: '/news_lv/news/top5ByViewCountWeek',
        method: 'GET',
        success: function(response) {
            if (response.code === 1000 && Array.isArray(response.result)) {
                response.result.forEach(function(news) {
                    var newsItem = renderTopViewedNews(news);
                    topViewsContent.append(newsItem);
                });
            } else {
                console.error('Unexpected response format:', response);
            }
        },
        error: function(error) {
            console.error('Error fetching top viewed news:', error);
        }
    });
}

function renderTopViewedNews(news) {
    return `
        <div class="d-flex mb-3">
            <img src="${news.thumbnail}" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="w-100 d-flex flex-column justify-content-center bg-light px-3" style="height: 100px;">
                <div class="mb-1" style="font-size: 13px;">
                    <a href="">${news.categories[0].name}</a>
                    <span class="px-1">/</span>
                    <span>${new Date(news.createdDate).toLocaleDateString()}</span>
                </div>
                <a class="h6 m-0" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
            </div>
        </div>
    `;
}

// ====================================News By CategoryCode View==============================
function fetchNewsByTopModifiedByCategory(categoryCode) {
    var newsId = parseInt(getNewsIdFromUrl(), 10)
    console.log('News ID:', newsId);
    // var categoryCode = sessionStorage.getItem('categoryCode');
    var topViewByCategoryContent = $('#topModifiedByCategoryCode');
    topViewByCategoryContent.empty();
    $.ajax({
        url: '/news_lv/news/top5ByCategoryCode/' + categoryCode,
        method: 'GET',
        success: function(response) {
            if (response.code === 1000 && Array.isArray(response.result)) {
                response.result.forEach(function(news) {
                    console.log('NewsID in foreach:', news.id);
                    if (news.id !== newsId) { // Loại bỏ bài viết có ID trùng
                        var newsItem = renderTopModifiedByCategory(news);
                        topViewByCategoryContent.append(newsItem);
                    }
                    /*var newsItem = renderTopModifiedByCategory(news);
                    topViewByCategoryContent.append(newsItem);*/
                });
            } else {
                console.error('Unexpected response format:', response);
            }
        },
        error: function(error) {
            console.error('Error fetching top viewed news:', error);
        }
    });
}

function renderTopModifiedByCategory(news) {
    return `
        <div class="d-flex mb-3">
            <img src="${news.thumbnail}" style="width: 100px; height: 100px; object-fit: cover;">
            <div class="w-100 d-flex flex-column justify-content-center bg-light px-3" style="height: 100px;">
                <div class="mb-1" style="font-size: 13px;">
                    <a href="">${news.categories[0].name}</a>
                    <span class="px-1">/</span>
                    <span>${new Date(news.modifiedDate).toLocaleDateString()}</span>
                </div>
                <a class="h6 m-0" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
            </div>
        </div>
    `;
}
//======================================COMMENT================================
$('#submit-comment').click(function(e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút submit
    var message = $('#message').val(); // Lấy nội dung bình luận
    if (!userId) {
        // alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        createToast('warning', 'fas fa-exclamation-circle', 'Cảnh báo', 'Vui lòng đăng nhập để sử dụng chức năng này');
        return;
    }
    submitComment(message);

    /*console.log('User ID:', userId);

    $.ajax({
        url: '/news_lv/comment/' + newsId + '?userId=' + userId,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            content: message,
            parentComment: null // Hoặc giá trị parentId nếu có
        }),
        success: function(response) {
            // alert('Bình luận của bạn đã được gửi.');
            $('#message').val('');
            fetchComments(newsId);
            getAllInteract();
        },
        error: function(error) {
            console.error('Error posting comment:', error);
            alert('Có lỗi xảy ra khi gửi bình luận.');
        }
    });*/
});

function submitComment(message, parentCommentId = null) {
    var newsId = getNewsIdFromUrl(); // Hàm để lấy newsId từ URL hoặc từ một nguồn khác
    console.log('User ID:', userId);
    console.log('News ID:', newsId);
    var data = {
        content: message,
        parentComment: parentCommentId
    }
    console.log('Data:', data);

    $.ajax({
        url: '/news_lv/comment/' + newsId + '?userId=' + userId,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            // alert('Bình luận của bạn đã được gửi.');
            fetchComments(newsId);
            $('#message').val('');
            getAllInteract();
        },
        error: function(error) {
            console.error('Error posting comment:', error);
            alert('Có lỗi xảy ra khi gửi bình luận.');
        }
    });

}

function fetchComments(newsId) {
    $.ajax({
        url: '/news_lv/comment/' + newsId,
        method: 'GET',
        success: function (response) {
            if (response.code === 1000) {
                renderComments(response.result);
            }
        },
        error: function (error) {
            console.error('Error fetching comments:', error);
        }
    });
}

function renderComments(comments) {
    var commentsContainer = $('#comments-container');
    commentsContainer.empty();
    comments.forEach(function (comment) {
        var commentHtml = createCommentHtml(comment);
        commentsContainer.append(commentHtml);
    });
}

function createCommentHtml(comment) {
    var repliesHtml = '';
    if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(function (reply) {
            repliesHtml += createCommentHtml(reply);
        });
    }

    var avatarSrc = comment.user.avatar ? comment.user.avatar : defaultAvatarPath;
    var editCommentBtn = '';
    var deleteCommentIcon = '';

    if (comment.user.id == userId) {
        editCommentBtn = `<button class="btn btn-sm btn-outline-secondary edit-btn" data-parent-comment-id="${comment.parentComment}" data-user-id="${comment.user.id}" data-comment-id="${comment.id}">Chỉnh sửa</button>`;
        deleteCommentIcon = `<i class="fa fa-trash ms-5 ml-2 delete-comment" style="cursor: pointer;" data-comment-id="${comment.id}"></i>`;
    }

    return `
        <div class="media mb-4">
            <img src="${avatarSrc}" alt="Image" class="img-fluid-comment mr-3 mt-1" style="width: 45px; border-radius: 50%;">
            <div class="media-body">
                <h6><a href="#">${comment.user.fullName}</a> <small><i>${new Date(comment.createdDate).toLocaleString()}</i></small></h6>
                <p id="content-comment-${comment.id}">${comment.content}${deleteCommentIcon}</p>
                ${editCommentBtn}
                <button class="btn btn-sm btn-outline-secondary reply-btn" data-comment-id="${comment.id}">Trả lời</button>
                ${repliesHtml ? `<div class="ml-4 mt-2">${repliesHtml}</div>` : ''}
            </div>
        </div>
    `;
}

$(document).on('click', '.reply-btn', function () {
    if (!userId) {
        createToast('warning', 'fas fa-exclamation-circle', 'Cảnh báo', 'Vui lòng đăng nhập để bình luận.');
        return;
    }

    var commentId = $(this).data('comment-id');
    var replyFormHtml = `
        <div class="form-group reply-form mt-2">
            <div class="input-group">
                <textarea id="reply-textArea-${commentId}" class="form-control auto-resize" placeholder="Bình luận ..." rows="1"></textarea>
                <div class="input-group-append">
                    <button data-parent-comment-id="${commentId}" class="btn-replyComment input-group-text text-secondary"><i class="fa fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    // Thay thế nút "Reply" bằng form bình luận
    $(this).replaceWith(replyFormHtml);

    // Thêm sự kiện input để tự động điều chỉnh chiều cao của textarea
    $('.auto-resize').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

$(document).on('click', '.btn-replyComment', function () {
    var parentCommentId = $(this).data('parent-comment-id');
    var replyComment = $(`#reply-textArea-${parentCommentId}`).val();

    submitComment(replyComment, parentCommentId);
});

$(document).on('click', '.edit-btn', function () {
    var commentId = $(this).data('comment-id');
    var commentContent = $(`#content-comment-${commentId}`).text();

    var editFormHtml = `
        <div class="form-group edit-form mt-2">
            <div class="input-group">
                <textarea id="edit-textArea-${commentId}" class="form-control auto-resize" 
                    rows="1">${commentContent}
                </textarea>
                <div class="input-group-append">
                    <button data-comment-id="${commentId}" class="btn-updateComment input-group-text text-secondary"><i class="fa fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    // Replace the comment content with the edit form
    $(`#content-comment-${commentId}`).replaceWith(editFormHtml);

    // Thêm sự kiện input để tự động điều chỉnh chiều cao của textarea
    $('.auto-resize').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
})

$(document).on('click', '.delete-comment', function () {
    var commentId = $(this).data('comment-id');

    $.ajax({
        url: '/news_lv/comment/' + commentId,
        method: 'DELETE',
        success: function(response) {
            fetchComments(newsId);
            getAllInteract()
        },
        error: function(error) {
            console.error('Error deleting comment:', error);
        }
    });
})

$(document).on('click', '.btn-updateComment', function() {
    var commentId = $(this).data('comment-id');
    var parentCommentId = $(this).data('parent-comment-id');
    var newContent = $(`#edit-textArea-${commentId}`).val();
    var data = {
        content: newContent,
        parentComment: parentCommentId
    }
    console.log('Data:', data);

    $.ajax({
        url: `/news_lv/comment/${commentId}?userId=${userId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            // alert('Comment updated successfully.');
            // Reload comments or update the comment content in the DOM
            fetchComments(newsId);
        },
        error: function(error) {
            console.error('Error updating comment:', error);
            alert('An error occurred while updating the comment.');
        }
    });
});
//======================================FAOVORITE================================

let isFavorite = false;

function checkFavoriteNews() {
    // Kiểm tra nếu người dùng đã đăng nhập
    if (userId) {
        var currentNewsId = getNewsIdFromUrl(); // Hàm để lấy newsId từ URL

        // Gọi API để lấy danh sách tin yêu thích của user
        $.ajax({
            url: '/news_lv/users/favorite',
            method: 'GET',
            data: {
                userId: userId
            },
            success: function(response) {
                const favoriteNews = response.result; // Danh sách tin yêu thích của user

                // Kiểm tra nếu newsId hiện tại nằm trong danh sách yêu thích
                isFavorite = favoriteNews.some(news => news.id == currentNewsId);

                if (isFavorite) {
                    // Thêm class active-favorite khi icon được yêu thích
                    // $('#favorite-icon').addClass('active-favorite');
                    $('#bookmark-icon path').attr('fill', '#9f224e');
                    $('#bookmark-icon').attr('color', '#9f224e');
                }
            },
            error: function(error) {
                console.error('Error fetching favorite news:', error);
            }
        });
    }
}

$('#backHome-icon').click(function () {
    window.location.href = '/news_lv/page/home';
})

$('#bookmark-icon').click(function () {
    // const userId = sessionStorage.getItem('userId');
    if (!userId) {
        createToast('warning', 'fas fa-exclamation-circle', 'Cảnh báo', 'Vui lòng đăng nhập để sử dụng chức năng này');
    } else {
        // alert('Đã đăng nhập.');
        var newsId = getNewsIdFromUrl(); // Lấy newsId từ URL hoặc từ một nguồn khác
        if (isFavorite) {
            // Nếu đã yêu thích, xóa khỏi danh sách yêu thích
            $.ajax({
                url: '/news_lv/users/favorite/' + newsId,
                method: 'PUT',
                data: {
                    userId: userId
                },
                success: function(response) {
                    $('#bookmark-icon path').attr('fill', 'none')
                    // alert('Tin tức đã được xóa khỏi danh sách yêu thích.');
                    getAllInteract();
                    isFavorite = false; // Cập nhật trạng thái
                },
                error: function(error) {
                    console.error('Error unfavoriting news:', error);
                    alert('Có lỗi xảy ra khi xóa tin tức khỏi danh sách yêu thích.');
                }
            });
        } else {
            $.ajax({
                url: '/news_lv/users/favorite/' + newsId,
                method: 'POST',
                data: {
                    userId: userId
                },
                success: function(response) {
                    $('#bookmark-icon path').attr('fill', '#9f224e')
                    $('#bookmark-icon').attr('color', '#9f224e');
                    // alert('Tin tức đã được thêm vào danh sách yêu thích.');
                    getAllInteract();
                    isFavorite = true; // Cập nhật trạng thái
                },
                error: function(error) {
                    console.error('Error favoriting news:', error);
                    alert('Có lỗi xảy ra khi thêm tin tức vào danh sách yêu thích.');
                }
            });
        }
    }
});

function isUserLoggedIn() {
    // Kiểm tra session hoặc cookie để xác định người dùng đã đăng nhập hay chưa
    // Đây là ví dụ đơn giản, bạn có thể thay đổi logic kiểm tra theo yêu cầu của bạn
    return sessionStorage.getItem('userLogin') === 'true';
}

// =============================URL PARAMS================================

function getNewsIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('newsId');
}

const newsId = getNewsIdFromUrl();

function viewCount() {
    // var newsId = getNewsIdFromUrl();
    $.ajax({
        url: `/news_lv/news/view/${newsId}`,
        method: 'POST',
        success: function() {
            console.log('View count incremented');
            // updateCounts()
            getAllInteract()
        },
        error: function(error) {
            console.error('Error incrementing view count:', error);
            if (error.responseJSON && error.responseJSON.message) {
                console.error('Error message:', error.responseJSON.message);
            }
        }
    });
}

function getAllInteract() {
    // var newsId = getNewsIdFromUrl();
    $.ajax({
        url: `/news_lv/news/counts/${newsId}`,
        method: 'GET',
        success: function(data) {
            console.log('View count incremented');
            console.log(data);
            $('#news-comments-count').text(data.result.commentCount + ' Bình luận');
            $('#like-count').text(data.result.likeCount + ' Yêu thích');
            $('#view-count').text(data.result.viewCount + ' Luợt xem');
        },
        error: function(error) {
            console.error('Error incrementing view count:', error);
        }
    });
}
/*function viewCount() {
    var newsId = getNewsIdFromUrl();
    setTimeout(function() {
        $.ajax({
            url: `/news_lv/news/view/${newsId}`,
            method: 'POST',
            success: function() {
                console.log('View count incremented');
            },
            error: function(error) {
                console.error('Error incrementing view count:', error);
                if (error.responseJSON && error.responseJSON.message) {
                    console.error('Error message:', error.responseJSON.message);
                }
            }
        });
    }, 30000); // 300000 milliseconds = 5 minutes
}*/

// Hàm để cập nhật like_count và view_count
/*function updateCounts() {
    var newsId = getNewsIdFromUrl();
    $.ajax({
        url: `/news_lv/news/counts/${newsId}`,
        method: 'GET',
        success: function(response) {
            $('#like-count').html(`<i class="fa fa-heart"></i> ${response.likeCount} Yêu thích`);
            $('#view-count').html(`<i class="fa fa-eye"></i> ${response.viewCount} Lượt xem`);
        },
        error: function(error) {
            console.error('Error fetching counts:', error);
        }
    });
}*/
CKEDITOR.ClassicEditor
    .create(document.getElementById("news-content-editor"), {
        // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
        toolbar: {
            items: [
                'exportPDF','exportWord', '|',
                'findAndReplace', 'selectAll', '|',
                'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|',
                'link', 'uploadImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
                'specialCharacters', 'horizontalLine', 'pageBreak', '|',
                'textPartLanguage', '|',
                'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
        },
        // Changing the language of the interface requires loading the language file using the <script> tag.
        // language: 'es',
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
        placeholder: 'Welcome to content New',
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
        fontSize: {
            options: [ 10, 12, 14, 'default', 18, 20, 22 ],
            supportAllValues: true
        },
        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        // Be careful with enabling previews
        // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
        htmlEmbed: {
            showPreviews: true
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                        '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                        '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                        '@sugar', '@sweet', '@topping', '@wafer'
                    ],
                    minimumCharacters: 1
                }
            ]
        },
        // The "superbuild" contains more premium features that require additional configuration, disable them below.
        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
        removePlugins: [
            // These two are commercial, but you can try them out without registering to a trial.
            // 'ExportPdf',
            // 'ExportWord',
            'AIAssistant',
            'CKBox',
            'CKFinder',
            'EasyImage',
            // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
            // Storing images as Base64 is usually a very bad idea.
            // Replace it on production website with other solutions:
            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
            // 'Base64UploadAdapter',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
            // from a local file system (file://) - load this site via HTTP server if you enable MathType.
            'MathType',
            // The following features are part of the Productivity Pack and require additional license.
            'SlashCommand',
            'Template',
            'DocumentOutline',
            'FormatPainter',
            'TableOfContents',
            'PasteFromOfficeEnhanced',
            'CaseChange'
        ],
        isReadOnly: true
    })
    /*.then(editor => {
        // Đoạn mã trong then được thực thi khi CKEditor đã được tạo thành công
        window.editor = editor;
        const toolbarElement = editor.ui.view.toolbar.element;

        editor.on('change:isReadOnly', (evt, propertyName, isReadOnly) => {
            if (isReadOnly) {
                toolbarElement.style.visibility = 'hidden';  // Sử dụng visibility để ẩn thay vì display: none
            } else {
                toolbarElement.style.visibility = 'visible'; // Hiển thị lại khi cần
            }
        });

        // Kiểm tra nếu cần bật chế độ read-only hoặc bỏ đi dòng này nếu không cần
        editor.isReadOnly = true; // Thay thế enableReadOnlyMode nếu cần

    })*/
    .then(editor => {
        // Đoạn mã trong then được thực thi khi CKEditor đã được tạo thành công
        window.editor = editor;
        const toolbarElement = editor.ui.view.toolbar.element;

        editor.on( 'change:isReadOnly', ( evt, propertyName, isReadOnly ) => {
            if ( isReadOnly ) {
                toolbarElement.style.display = 'none';
            } else {
                toolbarElement.style.display = 'flex';
            }
        } );

        editor.enableReadOnlyMode( 'my-feature-id' )

    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi tạo CKEditor:', error);
    });

/*
function initializeCKEditorItem(content) {
    CKEDITOR.ClassicEditor
        .create(document.getElementById("news-content-editor"), {
            // height: 500 // Đặt chiều cao của CKEditor
        })
        .then(editor => {
            window.editor = editor;
            // Đặt nội dung ban đầu cho CKEditor
            editor.setData(content)
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi khi tạo CKEditor:', error);
        });
}*/
