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
    $('.nav-link').not('#news-approvedManage').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#news-waitApproveManage', function (e) {
    e.preventDefault();
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(status)
    titlePageManage()
    $('.nav-link').not('#news-waitApproveManage').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#news-refusedManage', function (e) {
    e.preventDefault();
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(status)
    titlePageManage()
    $('.nav-link').not('#news-refusedManage').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#manage-commentManage', function (e) {
    e.preventDefault();
    sessionStorage.setItem('manage-comment', 'true')
    sessionStorage.removeItem('newsId')
    loadNewsTableManage(1)
    $('.nav-link').not('#manage-commentManage').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
})

$(document).on('click', '#back-CommentByNewsManage', function (e) {
    e.preventDefault();
    loadNewsTableManage(1)
    /*var categoryCode = sessionStorage.getItem('categoryCodeInNewItem')
    var page = sessionStorage.getItem('thisPage')
    loadNewsTableSuccess(categoryCode, page);*/
})

function loadNewsTableManage(status) {
    var categories = sessionStorage.getItem('categories');
    var newsId = sessionStorage.getItem('newsId');
    var manageComment = sessionStorage.getItem('manage-comment');
    $('#content-container').load('/news_lv/page/newsTableManage', function () {
        fetchNewsByCategories(categories, status, 1)
    });

    setTimeout(function () {
        $('tr').each(function () {
            var editLink;
            if(manageComment === 'true') {
                editLink = $(this).find('a#viewCommentByNews');
            } else {
                editLink = $(this).find('a#editNews');
            }
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

function fetchNewsByCategories(categories, status, page) {
    $.ajax({
        url: '/news_lv/news/by-categories',
        method: 'GET',
        data: {
            categories: categories,
            status: status,
            page: page,
            size: 5
        },
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderNews(data.result);
                updatePaginationManage(data.page, data.totalPage, categories, status);
            }
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}

function updatePaginationManage(currentPage, totalPage, categories, status) {
    sessionStorage.setItem('thisPage', currentPage);
    var paginationContainer = $('#page-Manage');
    paginationContainer.empty(); // Xóa nội dung hiện tại

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategories('${categories}', ${status}, 1)">First</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategories('${categories}', ${status}, ${currentPage - 1})">&laquo;</a>
        </li>
    `);

    for (var i = 1; i <= totalPage; i++) {
        paginationContainer.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:;" onclick="fetchNewsByCategories('${categories}', ${status}, ${i})">${i}</a>
            </li>
        `);
    }

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategories('${categories}', ${status}, ${currentPage + 1})">&raquo;</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategories('${categories}', ${status}, ${totalPage})">Last</a>
        </li>
    `);
}