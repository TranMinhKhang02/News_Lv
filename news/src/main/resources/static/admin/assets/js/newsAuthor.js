$(document).ready(function() {
})

const titlePageHeading = $('.titlePage-heading')
const approvedAuthor = $('#news-approvedAuthor');
const waitApproveAuthor = $('#news-waitApproveAuthor');
const refusedAuthor = $('#news-refusedAuthor');

function titlePageAuthor() {
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý bài viết');
}

function loadNewsByCreatedBy(createdBy, status, categoryCode) {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        var paginationAdmin = $('#pagination-admin');
        paginationAdmin.hide();
        fetchCategoryNames();
        fetchNewsByCreatedBy(createdBy, status, categoryCode)
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
}

$(document).on('click', '#news-approvedAuthor', function(e) {
    e.preventDefault();
    titlePageAuthor()
    titlePageHeading.html('Tin tức đã duyệt');
    var createdBy = sessionStorage.getItem('userName')
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.setItem('status', status);
    loadNewsByCreatedBy(createdBy, status, 'the-thao')
    $(this).addClass('active-categoryName');
    waitApproveAuthor.removeClass('active-categoryName');
    refusedAuthor.removeClass('active-categoryName');
})

$(document).on('click', '#news-waitApproveAuthor', function(e) {
    e.preventDefault();
    titlePageAuthor()
    titlePageHeading.html('Tin tức chờ duyệt');
    var createdBy = sessionStorage.getItem('userName')
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.setItem('status', status);
    loadNewsByCreatedBy(createdBy, status, 'the-thao')
    $(this).addClass('active-categoryName');
    approvedAuthor.removeClass('active-categoryName');
    refusedAuthor.removeClass('active-categoryName');
})

$(document).on('click', '#news-refusedAuthor', function(e) {
    e.preventDefault();
    titlePageAuthor()
    titlePageHeading.html('Tin tức bị từ chối');
    var createdBy = sessionStorage.getItem('userName')
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.setItem('status', status);
    loadNewsByCreatedBy(createdBy, status, 'the-thao')
    $(this).addClass('active-categoryName');
    approvedAuthor.removeClass('active-categoryName');
    waitApproveAuthor.removeClass('active-categoryName');
})

function fetchNewsByCreatedBy(createdBy, status, categoryCode, page) {
    $.ajax({
        url: '/news_lv/news/by-createdBy',
        method: 'GET',
        data: {
            createdBy: createdBy,
            status: status,
            categoryCode: categoryCode,
            page: page,
            size: 5
        },
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderNews(data.result);
                updatePaginationAuthor(data.page, data.totalPage, createdBy, status, categoryCode);
            }
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}

function updatePaginationAuthor(currentPage, totalPage, createdBy, status, categoryCode) {
    sessionStorage.setItem('thisPage', currentPage);
    var paginationContainer = $('#page-Author');
    paginationContainer.empty(); // Xóa nội dung hiện tại

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCreatedBy('${createdBy}', ${status}, '${categoryCode}', 1)">First</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCreatedBy('${createdBy}', ${status}, '${categoryCode}', ${currentPage - 1})">&laquo;</a>
        </li>
    `);

    for (var i = 1; i <= totalPage; i++) {
        paginationContainer.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:;" onclick="fetchNewsByCreatedBy('${createdBy}', ${status}, '${categoryCode}', ${i})">${i}</a>
            </li>
        `);
    }

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCreatedBy('${createdBy}', ${status}, '${categoryCode}', ${currentPage + 1})">&raquo;</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCreatedBy('${createdBy}', ${status}, '${categoryCode}', ${totalPage})">Last</a>
        </li>
    `);
}