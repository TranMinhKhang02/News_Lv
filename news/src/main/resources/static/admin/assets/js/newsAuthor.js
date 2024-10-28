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

function loadNewsByCreatedBy(createdBy, status) {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCreatedBy(createdBy, status, 'the-thao')
    });
}

$(document).on('click', '#news-approvedAuthor', function(e) {
    e.preventDefault();
    titlePageAuthor()
    titlePageHeading.html('Tin tức đã duyệt');
    var createdBy = sessionStorage.getItem('userName')
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.setItem('status', status);
    loadNewsByCreatedBy(createdBy, status)
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
    loadNewsByCreatedBy(createdBy, status)
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
    loadNewsByCreatedBy(createdBy, status)
    $(this).addClass('active-categoryName');
    approvedAuthor.removeClass('active-categoryName');
    waitApproveAuthor.removeClass('active-categoryName');
})

function fetchNewsByCreatedBy(createdBy, status, categoryCode) {
    $.ajax({
        url: '/news_lv/news/by-createdBy',
        method: 'GET',
        data: {
            createdBy: createdBy,
            status: status,
            categoryCode: categoryCode,
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