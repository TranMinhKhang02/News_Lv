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
    // fetchComments(newsId);
    // ============================LIKE================================
    checkFavoriteNews();

    // Gọi hàm updateCounts khi trang được tải
    // updateCounts();
    // Tăng view
    $('#incrementViewButton').click(function () {
        viewCount();
    });
});

const userId = sessionStorage.getItem('userId');

//======================================COMMENT================================
$('#submit-comment').click(function(e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút submit
    var message = $('#message').val(); // Lấy nội dung bình luận
    if (!userId) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này.');
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

    $.ajax({
        url: '/news_lv/comment/' + newsId + '?userId=' + userId,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            content: message,
            parentComment: parentCommentId
        }),
        success: function(response) {
            // alert('Bình luận của bạn đã được gửi.');
            fetchComments(newsId);
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

    return `
        <div class="media mb-4">
            <img src="${avatarSrc}" alt="Image" class="img-fluid-comment mr-3 mt-1" style="width: 45px;">
            <div class="media-body">
                <h6><a href="#">${comment.user.fullName}</a> <small><i>${new Date(comment.createdDate).toLocaleString()}</i></small></h6>
                <p>${comment.content}</p>
                <button class="btn btn-sm btn-outline-secondary reply-btn" data-comment-id="${comment.id}">Reply</button>
                ${repliesHtml ? `<div class="ml-4">${repliesHtml}</div>` : ''}
            </div>
        </div>
    `;
}

$(document).on('click', '.reply-btn', function () {
    if (!userId) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }

    var commentId = $(this).data('comment-id');
    var replyFormHtml = `
        <div class="form-group reply-form">
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
/*$(document).on('click', '.reply-btn', function () {
    // const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }

    var commentId = $(this).data('comment-id');
    var replyFormHtml = `
        <div class="form-group reply-form">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Bình luận ...">
                <div class="input-group-append">
                    <button class="input-group-text text-secondary"><i class="fa fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    // Thay thế nút "Reply" bằng form bình luận
    $(this).replaceWith(replyFormHtml);
});*/
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
                    $('#favorite-icon').addClass('active-favorite');
                }
            },
            error: function(error) {
                console.error('Error fetching favorite news:', error);
            }
        });
    }
}

$('#favorite-icon').click(function () {
    // const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này.');
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
                    $('#favorite-icon').removeClass('active-favorite');
                    alert('Tin tức đã được xóa khỏi danh sách yêu thích.');
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
                    $('#favorite-icon').addClass('active-favorite');
                    alert('Tin tức đã được thêm vào danh sách yêu thích.');
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
            $('#news-comments-count').text(data.result.commentCount + ' Comments');
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
