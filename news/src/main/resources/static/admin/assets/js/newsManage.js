function titlePageManage() {
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý bài viết');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Tin tức đã duyệt');
}

$(document).on('click', '#news-approvedManage', function (e) {
    e.preventDefault();
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(status)
    titlePageManage()
})

$(document).on('click', '#news-waitApproveManage', function (e) {
    e.preventDefault();
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(status)
    titlePageManage()
})

$(document).on('click', '#news-refusedManage', function (e) {
    e.preventDefault();
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(status)
    titlePageManage()
})

function loadNewsTableManage(status) {
    var categories = sessionStorage.getItem('categories');
    var newsId = sessionStorage.getItem('newsId');
    $('#content-container').load('/news_lv/page/newsTableManage', function () {
        fetchNewsByCategories(categories, status)
    });

    setTimeout(function () {
        $('tr').each(function () {
            var editLink = $(this).find('a#editNews');
            var newsIdInRow = editLink.data('news-id');
            if (newsIdInRow == newsId) {
                $(this).find('#title-newsTable').addClass('active-categoryName');
            }
        });
    }, 300);

    /*setTimeout(function() {
        $('tr').each(function() {
            var editLink;
            if(manageComment === 'true') {
                editLink = $(this).find('a#viewCommentByNews');
            } else {
                editLink = $(this).find('a#editNews');
            }
            console.log('editLink:', editLink); // Kiểm tra xem thẻ <a> có được tìm thấy không
            var newsIdInRow = editLink.data('news-id');
            console.log('newsIdInRow:', newsIdInRow);
            console.log('newsId:', newsId);
            if (newsIdInRow == newsId) {
                $(this).find('#title-newsTable').addClass('active-categoryName');
            }
        });
    }, 300);*/
}

function fetchNewsByCategories(categories, status) {
    $.ajax({
        url: '/news_lv/news/by-categories',
        method: 'GET',
        data: {
            categories: categories,
            status: status,
            size: 2
        },
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderNews(data.result);
            }
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}