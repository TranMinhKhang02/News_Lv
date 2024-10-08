$(document).ready(function () {

    // Fetch news by ID when the page loads
    var newsId = getNewsIdFromUrl();
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
        $('#news-title').text(news.title);
        $('#news-content').html(news.content);
        $('#news-thumbnail').attr('src', news.thumbnail);
        $('#news-date').text(new Date(news.modifiedDate).toLocaleDateString());
        $('#news-category').text(news.categories[0].name);
        $('#news-comments-count').text(news.countComment + ' Comments');

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
    }

    // =============================URL PARAMS================================

    function getNewsIdFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('newsId');
    }


//     ===============================COMMENT================================
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

        return `
        <div class="media mb-4">
            <img src="${comment.user.avatar}" alt="Image" class="img-fluid-comment mr-3 mt-1" style="width: 45px;">
            <div class="media-body">
                <h6><a href="#">${comment.user.fullName}</a> <small><i>${new Date(comment.createdDate).toLocaleString()}</i></small></h6>
                <p>${comment.content}</p>
                <button class="btn btn-sm btn-outline-secondary reply-btn">Reply</button>
                ${repliesHtml ? `<div class="ml-4">${repliesHtml}</div>` : ''}
            </div>
        </div>
    `;
    }

    // Event delegation to handle dynamically created reply buttons
    $(document).on('click', '.reply-btn', function () {
        const user = JSON.parse(sessionStorage.getItem('user')); // Lấy user từ sessionStorage và parse lại thành đối tượng
        const userId = user.id; // Lấy userId
        // const userId = sessionStorage.getItem('userId');
        if (userId) {
            alert('User ID: ' + userId + "Full Name: " + user.fullName);
        } else {
            alert('Please log in to comment.');
        }
    });
    // ============================LIKE================================

    /*$('#favorite-icon').click(function () {
        if (isUserLoggedIn()) {
            alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        } else {
            // Xử lý logic yêu thích tin tức ở đây
            const fullName = sessionStorage.getItem('fullName');
            console.log('Welcome back,', fullName); // In thông tin tên người dùng ra console
            alert('Tin tức đã được thêm vào danh sách yêu thích. usedId = ' + sessionStorage.getItem('userId'));
        }
    });*/

    /*function isUserLoggedIn() {
        // Kiểm tra session hoặc cookie để xác định người dùng đã đăng nhập hay chưa
        // Đây là ví dụ đơn giản, bạn có thể thay đổi logic kiểm tra theo yêu cầu của bạn
        return sessionStorage.getItem('user') === 'true';
    }
    if (isUserLoggedIn()) {
        const fullName = sessionStorage.getItem('fullName');
        console.log('Welcome back,', fullName); // In thông tin tên người dùng ra console
    }*/
});
