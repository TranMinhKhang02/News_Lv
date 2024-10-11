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
        $('#news-title').text(news.title);
        $('#news-content').html(news.content);
        $('#news-thumbnail').attr('src', news.thumbnail);
        $('#news-date').text(new Date(news.modifiedDate).toLocaleDateString());
        $('#news-category').text(news.categories[0].name);
        $('#news-comments-count').text(news.countComment + ' Comments');
        $('#like-count').text(news.countLike + ' Yêu thích');
        $('#view-count').text(news.countView + ' Luợt xem');

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


    //===============================COMMENT================================
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
                    const isFavorite = favoriteNews.some(news => news.id == currentNewsId);

                    if (isFavorite) {
                        // Thêm class active-favorite khi icon được yêu thích
                        $('#favorite-icon').addClass('active-favorite');
                    }
                },
                error: function(error) {
                    console.error('Error fetching favorite news:', error);
                }
            });
        }
    }
    checkFavoriteNews();
    // ============================LIKE================================

    // Gọi hàm updateCounts khi trang được tải
    // updateCounts();
    // Tăng view
    $('#incrementViewButton').click(function () {
        viewCount();
    });
});

const userId = sessionStorage.getItem('userId');

// Event delegation to handle dynamically created reply buttons
$(document).on('click', '.reply-btn', function () {
    // const userId = sessionStorage.getItem('userId');
    if (userId) {
        alert('User ID: ' + userId);
    } else {
        alert('Please log in to comment.');
    }
});

$('#favorite-icon').click(function () {
    // const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này.');
    } else {
        // alert('Đã đăng nhập.');
        var newsId = getNewsIdFromUrl(); // Lấy newsId từ URL hoặc từ một nguồn khác
        $.ajax({
            url: '/news_lv/users/favorite/' + newsId,
            method: 'POST',
            data: {
                userId: userId
            },
            success: function(response) {
                $('#favorite-icon').addClass('active-favorite');
                alert('Tin tức đã được thêm vào danh sách yêu thích.');
            },
            error: function(error) {
                console.error('Error favoriting news:', error);
                alert('Có lỗi xảy ra khi thêm tin tức vào danh sách yêu thích.');
            }
        });
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

function viewCount() {
    var newsId = getNewsIdFromUrl();
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
/*
function updateCounts() {
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