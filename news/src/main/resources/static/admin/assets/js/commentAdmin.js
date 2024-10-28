$(document).ready(function () {

})

$(document).on('click', '#viewCommentByNews', function (e) {
    e.preventDefault();
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý bình luận');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Bình luận tin tức');
    var newsId = $(this).data('news-id');
    sessionStorage.setItem('newsId', newsId);
    $('#content-container').load('/news_lv/page/viewCommentByNews', function () {
        getNewsItemByNewsId();
    });
})

$(document).on('click', '#back-CommentByNews', function (e) {
    e.preventDefault();
    backNews()
    /*var categoryCode = sessionStorage.getItem('categoryCodeInNewItem')
    var page = sessionStorage.getItem('thisPage')
    loadNewsTableSuccess(categoryCode, page);*/
})

function getNewsItemByNewsId() {
    var newsId = sessionStorage.getItem('newsId');
    $.ajax({
        url: '/news_lv/news/single/' + newsId,
        method: 'GET',
        success: function(response) {
            if (response.code === 1000) {
                var news = response.result;
                $('input[name="title"]').val(news.title);
                $('input[name="shortDescription"]').val(news.shortDescription);
                displaySelectedThumbnail(news.thumbnail);
                fetchCategoryNameInEditNews(news.categories[0].code);
                loadComments(newsId);
            }
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}

function loadComments(newsId) {
    $.ajax({
        url: '/news_lv/comment/' + newsId,
        method: 'GET',
        success: function(response) {
            if (response.code === 1000) {
                var comments = response.result;
                displayComments(comments);
            }
        },
        error: function(error) {
            console.error('Error fetching comments:', error);
        }
    });
}

function displayComments(comments) {
    var commentsContainer = $('.container-commentByNews');
    commentsContainer.empty(); // Xóa nội dung hiện tại

    comments.forEach(function(comment) {
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
        <div class="comment">
                <div class="d-flex align-items-center">
                    <img src="${avatarSrc}" class="avatar avatar-sm me-3" alt="user-avatar">
                    <div>
                        <h6 class="mb-0 text-sm">${comment.user.fullName}</h6>
                        <p class="text-xs text-secondary mb-0">${new Date(comment.createdDate).toLocaleString()}</p>
                    </div>
                    <i class="fa fa-trash ms-5 delete-comment" style="cursor: pointer;" data-comment-id="${comment.id}"></i>
                </div>
                <p class="mt-2">${comment.content}</p>
                ${repliesHtml ? `<div class="reply replyComment">${repliesHtml}</div>` : ''}
            </div>
            <hr class="horizontal dark">
    `;
}

$(document).on('click', '.delete-comment', function () {
    var commentId = $(this).data('comment-id');
    var newsId = sessionStorage.getItem('newsId');

    $.ajax({
        url: '/news_lv/comment/' + commentId,
        method: 'DELETE',
        success: function(response) {
            if (response.code === 1000) {
                loadComments(newsId);
            }
        },
        error: function(error) {
            console.error('Error deleting comment:', error);
        }
    });
})

/*function displayComments(comments) {
    var commentsContainer = $('.container-commentByNews');
    commentsContainer.empty(); // Xóa nội dung hiện tại

    comments.forEach(function(comment) {
        var commentHtml = `
            <div class="comment">
                <div class="d-flex align-items-center">
                    <img src="${comment.user.avatar}" class="avatar avatar-sm me-3" alt="user-avatar">
                    <div>
                        <h6 class="mb-0 text-sm">${comment.user.fullName}</h6>
                        <p class="text-xs text-secondary mb-0">${new Date(comment.createdDate).toLocaleString()}</p>
                    </div>
                </div>
                <p class="mt-2">${comment.content}</p>
                ${displayReplies(comment.replies)}
            </div>
            <hr class="horizontal dark">
        `;
        commentsContainer.append(commentHtml);
    });
}

function displayReplies(replies) {
    if (replies.length === 0) return '';

    var repliesHtml = '<div class="replies">';
    replies.forEach(function(reply) {
        repliesHtml += `
            <div class="reply replyComment">
                <div class="d-flex align-items-center">
                    <img src="${reply.user.avatar}" class="avatar avatar-sm me-3" alt="user-avatar">
                    <div>
                        <h6 class="mb-0 text-sm">${reply.user.fullName}</h6>
                        <p class="text-xs text-secondary mb-0">${new Date(reply.createdDate).toLocaleString()}</p>
                    </div>
                </div>
                <p class="mt-2">${reply.content}</p>
            </div>
        `;
    });
    repliesHtml += '</div>';
    return repliesHtml;
}*/
