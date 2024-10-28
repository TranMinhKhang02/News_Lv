$(document).ready(function () {
    // fetchNewsByCategory('the-thao', 1); // Mặc định khi load là thể thao
    // sessionStorage.setItem('manage-comment', 'true');
});
// Thêm sự kiện click cho các mục li trong ul.navbar-nav
$('.navbar-nav .nav-item .nav-link').click(function () {
    // Loại bỏ lớp active khỏi tất cả các mục li khác
    $('.navbar-nav .nav-item .nav-link').removeClass('active');
    // Thêm lớp active vào mục li được nhấp
    $(this).addClass('active');
});

$('#menu-manageComment').click(function () {
    sessionStorage.removeItem('categoryCodeInNewItem');
    $('#ui-news').collapse('hide');
    $('#manage-category').collapse('hide');
    $('#manage-user').collapse('hide');
    $('#manage-role').collapse('hide');
})

$('#menu-manageNews').click(function () {
    sessionStorage.removeItem('categoryCodeInNewItem');
    $('#manage-comment').collapse('hide');
    $('#manage-category').collapse('hide');
    $('#manage-user').collapse('hide');
    $('#manage-role').collapse('hide');
})

$('#menu-manageCategory').click(function () {
    $('#manage-comment').collapse('hide');
    $('#ui-news').collapse('hide');
    $('#manage-user').collapse('hide');
    $('#manage-role').collapse('hide');
})

$('#menu-manageUser').click(function () {
    $('#ui-news').collapse('hide');
    $('#manage-category').collapse('hide');
    $('#manage-comment').collapse('hide');
    $('#manage-role').collapse('hide');
})

$('#menu-manageRole').click(function () {
    $('#ui-news').collapse('hide');
    $('#manage-category').collapse('hide');
    $('#manage-comment').collapse('hide');
    $('#manage-user').collapse('hide');
})

const userId = sessionStorage.getItem('userId');
const newsId = sessionStorage.getItem('newsId');

function loadNewsTableSuccess(categoryCode, page) {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        sessionStorage.setItem('status', 1);
        $('#news-waitApprove').removeClass('active-categoryName');
        $('#approved-articles').addClass('active-categoryName');
        fetchCategoryNames();
        fetchNewsByCategory(categoryCode, page, 1); // Mặc định khi load là thể thao

        setTimeout(function() {
            $('tr').each(function() {
                var editLink = $(this).find('a#editNews');
                // console.log('editLink:', editLink); // Kiểm tra xem thẻ <a> có được tìm thấy không
                var newsIdInRow = editLink.data('news-id');
                /*console.log('newsIdInRow:', newsIdInRow);
                console.log('newsId:', newsId);*/
                if (newsIdInRow == newsId) {
                    $(this).find('#title-newsTable').addClass('active-categoryName');
                }
            });
        }, 300);
    });
}

function showHideBtn() {
    const newsId = sessionStorage.getItem('newsId');
    var status = sessionStorage.getItem('status');
    var btnSaveNews = $('#saveNews');
    var btnApprove = $('#approveNews');
    var btnRefuse = $('#refuseNews');
    var btnUpdateNews = $('#updateNews')
    if(status == 2){
        btnApprove.show();
        btnRefuse.show();
        btnSaveNews.hide();
        btnUpdateNews.addClass('d-none');
    } else if (status == 1) {
        btnApprove.hide();
        btnRefuse.hide();
    }
    if (newsId) {
        btnUpdateNews.show();
        btnSaveNews.hide();
    } else {
        btnUpdateNews.hide();
        btnApprove.hide();
        btnRefuse.hide();
    }
}

// Thêm sự kiện click cho các danh mục
$(document).on('click', '#categoryFetchNews', function () {
    var categoryCode = $(this).find('span').data('category-code');
    // Đặt category mặc định là the-thao
    categoryCode = categoryCode === undefined ? 'the-thao' : categoryCode;
    sessionStorage.setItem('categoryCodeInNewItem', categoryCode);
    var status = sessionStorage.getItem('status');
    var createdBy = sessionStorage.getItem('userName');

    if (createdBy) {
        // Nếu userName tồn tại trong sessionStorage, thực hiện hành động tương tự như click vào thẻ #news-approvedAuthor
        fetchNewsByCreatedBy(createdBy, status, categoryCode);
    } else {
        // Nếu userName không tồn tại, thực hiện hành động mặc định
        fetchNewsByCategory(categoryCode, 1, status);
    }

    $('.nav-link').not('#approved-articles, #news-waitApprove, #news-refused, #showCommentByNewsTable, #showCategory, #showUsers, #showRole').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

const newsWaitApprove = $('#news-waitApprove');
const newsRefused = $('#news-refused');
const showCommentByNewsTable = $('#showCommentByNewsTable');
const approvedArticles = $('#approved-articles');

$(document).on('click', '#approved-articles', function () {
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.removeItem('manage-comment');
// $('#approved-articles').click(function () {
    var titlePage = $('.titlePage')
    titlePage.html('Quản lý bài viết');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Tin tức đã duyệt');
    $('#createNews').show()
    newsWaitApprove.removeClass('active-categoryName');
    loadNewsTable(status)
    /*newsRefused.removeClass('active-categoryName');
    showCommentByNewsTable.removeClass('active-categoryName');
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('manage-comment');
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, status); // Mặc định khi load là thể thao
    });*/
    $('#approved-articles').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

$(document).on('click', '#news-waitApprove', function () {
    var status = $(this).data('status');
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.removeItem('manage-comment');
// $('#news-waitApprove').click(function () {
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Tin tức chờ duyệt');
    approvedArticles.removeClass('active-categoryName');
    loadNewsTable(status)
    $('#news-waitApprove').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

function loadNewsTable(status) {
    newsRefused.removeClass('active-categoryName');
    showCommentByNewsTable.removeClass('active-categoryName');
    // var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('manage-comment');
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, status); // Mặc định khi load là thể thao và status là 2
    });
}

$(document).on('click', '#news-refused', function () {
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.removeItem('manage-comment');
    var titlePageHeading = $('.titlePage-heading')
    titlePageHeading.html('Tin tức bị từ chối');
    $('#approved-articles').removeClass('active-categoryName');
    $('#showCommentByNewsTable').removeClass('active-categoryName');
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    sessionStorage.removeItem('manage-comment');
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, status); // Mặc định khi load là thể thao và status là 2
    });
    $('#news-waitApprove').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

$(document).on('click', '#showCommentByNewsTable', function () {
    sessionStorage.setItem('categoryCodeInNewItem', 'the-thao');
    sessionStorage.setItem('manage-comment', 'true')
    sessionStorage.removeItem('status');
    $('#approved-articles').removeClass('active-categoryName');
    $('#news-waitApprove').removeClass('active-categoryName');

    var manageComment = sessionStorage.getItem('manage-comment');

    $('#content-container').load('/news_lv/page/newsTable', function () {

        if (manageComment === 'true') {
            $('.icon-news').addClass('d-none');
        } else {
            console.log('.icon-news element not hidden'); // Debugging log
        }

        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, 1); // Mặc định khi load là thể thao và status là 2
    });
    $(this).addClass('active-categoryName');
})

function loadNewsComment(categoryCode) {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        sessionStorage.setItem('status', 1);
        $('#news-waitApprove').removeClass('active-categoryName');
        $('#approved-articles').removeClass('active-categoryName');
        fetchCategoryNames();
        fetchNewsByCategory(categoryCode, 1, 1);
    });
}

//=====================================APPROVE NEWS=====================================
$(document).on('click', '#approveNews', function () {
    var newsId = sessionStorage.getItem('newsId');
    var category_code = sessionStorage.getItem('categoryCodeInNewItem');
    var page = sessionStorage.getItem('thisPage');
    var statusUpdateRequest = {
        status: 2 // Trạng thái "Đã duyệt"
    };

    $.ajax({
        url: '/news_lv/news/' + newsId + '/status',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(statusUpdateRequest),
        success: function(response) {
            if (response.code === 1000) {
                alert('Cập nhật trạng thái của bài viết thành công.');
                // Thực hiện các hành động khác nếu cần, ví dụ: tải lại danh sách tin tức
                loadNewsTableSuccess(category_code, page)
            } else {
                alert('Có lỗi xảy ra: ' + response.message);
            }
        },
        error: function(error) {
            console.error('Error updating news status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái của bài viết');
        }
    });
});

function backNews() {
    var categoryCode = sessionStorage.getItem('categoryCodeInNewItem');
    var status = sessionStorage.getItem('status');
    var thisPage = sessionStorage.getItem('thisPage');
    var newsId = sessionStorage.getItem('newsId');
    var manageComment = sessionStorage.getItem('manage-comment');
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory(categoryCode, thisPage, status); // Mặc định khi load là thể thao và status là 2

        setTimeout(function() {
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
        }, 300);

    });
    // Thêm class active-categoryName vào danh mục "Thể Thao" mặc định
    $('.nav-link').each(function() {
        var categoryCodeInNav = $(this).find('span').data('category-code');
        if (categoryCodeInNav === categoryCode) {
            $(this).addClass('active-categoryName');
        }
    });
}

$(document).on('click', '#back-newsByCategory', function () {
    var categories = sessionStorage.getItem('categories');
    var status = sessionStorage.getItem('status');
    console.log('categories:', categories);
    if (categories) {
        loadNewsTableManage(status)
    } else {
        backNews()
    }
    /*var categoryCode = sessionStorage.getItem('categoryCodeInNewItem');
    var status = sessionStorage.getItem('status');
    var thisPage = sessionStorage.getItem('thisPage');
    var newsId = sessionStorage.getItem('newsId');
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory(categoryCode, thisPage, status); // Mặc định khi load là thể thao và status là 2

        setTimeout(function() {
            $('tr').each(function() {
                var editLink = $(this).find('a#editNews');
                console.log('editLink:', editLink); // Kiểm tra xem thẻ <a> có được tìm thấy không
                var newsIdInRow = editLink.data('news-id');
                console.log('newsIdInRow:', newsIdInRow);
                console.log('newsId:', newsId);
                if (newsIdInRow == newsId) {
                    $(this).find('#title-newsTable').addClass('active-categoryName');
                }
            });
        }, 300);

    });
    // Thêm class active-categoryName vào danh mục "Thể Thao" mặc định
    $('.nav-link').each(function() {
        var categoryCodeInNav = $(this).find('span').data('category-code');
        if (categoryCodeInNav === categoryCode) {
            $(this).addClass('active-categoryName');
        }
    });*/
});

$(document).on('click', '#editNews', function (e) {
    var newsId = $(this).data('news-id');
    sessionStorage.setItem('newsId', newsId);
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    $('#content-container').load('/news_lv/page/editNews', function () {
        showHideBtn();
        // var newsId = $(this).data('news-id'); // Giả sử bạn có thuộc tính data-news-id trên thẻ <a>
        console.log('News ID:', newsId);

        // Gọi API để lấy dữ liệu tin tức
        $.ajax({
            url: '/news_lv/news/single/' + newsId,
            method: 'GET',
            success: function(response) {
                if (response.code === 1000) {
                    var news = response.result;
                    console.log('News:', news);
                    // Cập nhật form với dữ liệu từ API
                    $('input[name="title"]').val(news.title);
                    $('input[name="shortDescription"]').val(news.shortDescription);
                    $('#source').val(news.source);
                    // $('input[name="createdDate"]').val(new Date(news.createdDate).toLocaleDateString());
                    displaySelectedThumbnail(news.thumbnail);
                    // $('input[name="category"]').val(news.categories[0].name);
                    fetchCategoryNameInEditNews(news.categories[0].code);
                    // $('input[name="content"]').val(news.content);
                    initializeCKEditor(news.content)
                }
            },
            error: function(error) {
                console.error('Error fetching news:', error);
            }
        });
    });
});

$(document).on('click', '#updateNews', function () {
    var newsId = sessionStorage.getItem('newsId');
    var categoryCode = sessionStorage.getItem('categoryCodeInNewItem');
    var page = sessionStorage.getItem('thisPage');
    var title = $('input[name="title"]').val();
    var shortDescription = $('input[name="shortDescription"]').val();
    // Lấy id từ data-category-id của option được chọn
    var selectedCategoryIds = $('#category-select option:selected').map(function() {
        return $(this).data('category-id');
    }).get();
    var thumbnailUrl = $('#thumbnailUrl').val();
    // Lấy data từ CKEditor
    var content = editorInstance.getData();

    var requestData = {
        title: title,
        shortDescription: shortDescription,
        categories: selectedCategoryIds,
        thumbnail: thumbnailUrl,
        content: content
    };

    $.ajax({
        url: '/news_lv/news/' + newsId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(response) {
            alert('Cập nhật tin tức thành công');
            loadNewsTableSuccess(categoryCode, page);
        },
        error: function(error) {
            // Xử lý khi có lỗi
            console.error('Lỗi khi cập nhật:', error);
        }
    });
})

// Click vào nút Create news
$(document).on('click', '#createNews', function () {
    sessionStorage.removeItem('newsId');

    $('#content-container').load('/news_lv/page/editNews', function () {
        showHideBtn();
        // Clear dữ liệu trong các trường input
        $('#content-container').find('input, select').each(function() {
            $(this).val('');
        });
        fetchCategoryNameInEditNews('');
        initializeCKEditor()
    });
});

$(document).on('click', '#deleteNews', function () {
    var selectedIds = [];
    var selectedTitles = [];
    $('.delete-checkbox:checked').each(function () {
        selectedIds.push($(this).val());
        selectedTitles.push($(this).closest('tr').find('#title-newsTable').text()); // Giả sử tiêu đề bài viết nằm trong thẻ có class .news-title
    });
    /*var selectedIds = [];
    $('.delete-checkbox:checked').each(function () {
        selectedIds.push($(this).val());
    });*/

    if (selectedIds.length > 0) {
        var confirmationMessage = 'Bạn có chắc muốn xóa các bài viết với ID là: ' + selectedIds.join(', ') + ' và tiêu đề là: ' + selectedTitles.join(', ') + '?';
        if (confirm(confirmationMessage)) {
            console.log('Selected IDs:', selectedIds); // Kiểm tra danh sách ID trước khi gửi yêu cầu
            $.ajax({
                url: '/news_lv/news/update-status',
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(selectedIds),
                success: function(response) {
                    if (response.code === 1000) {
                        alert('Xóa bài viết thành công');
                        location.reload(); // Tải lại trang để cập nhật danh sách bài viết
                    } else {
                        alert('Có lỗi xảy ra: ' + response.message);
                    }
                },
                error: function(error) {
                    console.error('Error deleting news:', error);
                    alert('Có lỗi xảy ra khi xóa bài viết');
                }
            });
        }
    } else {
        alert('Vui lòng chọn ít nhất một bài viết để xóa');
    }

    /*if (selectedIds.length > 0) {
        $.ajax({
            url: '/news_lv/news',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(selectedIds),
            success: function(response) {
                if (response.code === 1000) {
                    alert('Xóa bài viết thành công');
                    location.reload(); // Tải lại trang để cập nhật danh sách bài viết
                } else {
                    alert('Có lỗi xảy ra: ' + response.message);
                }
            },
            error: function(error) {
                console.error('Error deleting news:', error);
                alert('Có lỗi xảy ra khi xóa bài viết');
            }
        });
    } else {
        alert('Vui lòng chọn ít nhất một bài viết để xóa');
    }*/
});

$(document).on('click', '#saveNews', function () {
    // Lấy id từ data-category-id của option được chọn
    var selectedCategoryIds = $('#category-select option:selected').map(function() {
        return $(this).data('category-id');
    }).get();

    var content = editorInstance.getData();
    var thumbnailUrl = $('#thumbnailUrl').val(); // Đảm bảo bạn có input ẩn này
    var source = $('#source').val();

    var newsData = {
        title: $('input[name="title"]').val(),
        shortDescription: $('input[name="shortDescription"]').val(),
        // createdDate: $('input[name="createdDate"]').val(),
        // category: $('#category-select').val(),
        categories: selectedCategoryIds,
        // content: $('input[name="content"]').val()
        thumbnail: thumbnailUrl,
        content: content,
        source: source
    };

    $.ajax({
        url: '/news_lv/news?userId=' + userId,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newsData),
        success: function(response) {
            if (response.code === 1000) {
                alert('Tạo tin tức thành công');
                // Thực hiện các hành động khác nếu cần
                // $('#content-container').load('/news_lv/page/newsTable');
                loadNewsTableSuccess('the-thao');
            } else {
                alert('Có lỗi xảy ra: ' + response.message);
            }
        },
        error: function(error) {
            console.error('Error creating news:', error);
            alert('Có lỗi xảy ra khi tạo tin tức');
        }
    });
});

/*$('#approved-articles').click(function () {
    $('#content-container').load('/news_lv/page/newsTable')
    fetchCategoryNames()

    fetchNewsByCategory('the-thao', 1); // Mặc định khi load là thể thao

    // Thêm sự kiện click cho các danh mục
    $(document).on('click', '.nav-link', function () {
        var categoryCode = $(this).find('span').data('category-code');
        fetchNewsByCategory(categoryCode, 1);
        $('.nav-link').removeClass('active-categoryName');
        $(this).addClass('active-categoryName');
    });
});*/

function fetchNewsByCategory(categoryCode, page, status) {
    $.ajax({
        url: '/news_lv/news/by-category-and-status',
        method: 'GET',
        data: {
            category: categoryCode,
            status: status,
            page: page,
            size: 2
        },
        success: function(data) {
            /*if (data.code === 1000) {
                console.log('Code is 1000');
            }
            if (Array.isArray(data.result)) {
                console.log('Result is an array');
            }*/
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderNews(data.result);
                updatePagination(data.page, data.totalPage, categoryCode);
            }
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}

function renderNews(newsList) {
    var manageComment = sessionStorage.getItem('manage-comment');
    var newsContainer = $('tbody');
    newsContainer.empty(); // Xóa nội dung hiện tại

    newsList.forEach(function(news) {
        var newsItem;
        if(manageComment) {
            newsItem = createNewsByComment(news);
        } else {
            newsItem = createNewsItem(news);
        }
        newsContainer.append(newsItem);
    });
}

function createNewsItem(news) {
    return `
        <tr>
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                        <img src="${news.thumbnail}" class="avatar avatar-sm me-3" alt="news-thumbnail">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 id="title-newsTable" class="mb-0 text-sm">${news.title}</h6>
<!--                        <p class="text-xs text-secondary mb-0">${news.createdBy}</p>-->
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${news.createdBy}</p>
<!--                <p class="text-xs text-secondary mb-0">${news.source}</p>-->
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">${new Date(news.modifiedDate).toLocaleDateString()}</span>
            </td>
            <td class="align-middle">
                <a id="editNews" href="#" data-news-id="${news.id}" class="text-secondary font-weight-bold text-xs" 
                data-toggle="tooltip" data-original-title="Edit news">
                    Chỉnh sửa
                </a>
            </td>
            <td class="align-middle">
                <input type="checkbox" class="delete-checkbox" value="${news.id}">
            </td>
        </tr>
    `;
}

function createNewsByComment(news) {
    return `
        <tr>
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                        <img src="${news.thumbnail}" class="avatar avatar-sm me-3" alt="news-thumbnail">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 id="title-newsTable" class="mb-0 text-sm">${news.title}</h6>
<!--                        <p class="text-xs text-secondary mb-0">${news.createdBy}</p>-->
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${news.createdBy}</p>
<!--                <p class="text-xs text-secondary mb-0">${news.source}</p>-->
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">${new Date(news.modifiedDate).toLocaleDateString()}</span>
            </td>
            <td class="align-middle">
                <a id="viewCommentByNews" href="#" data-news-id="${news.id}" class="text-secondary font-weight-bold text-xs" 
                data-toggle="tooltip" data-original-title="View comment">
                    Xem bình luận
                </a>
            </td>
        </tr>
    `;
}

function updatePagination(currentPage, totalPage, categoryCode) {
    sessionStorage.setItem('thisPage', currentPage);
    var paginationContainer = $('.pagination');
    paginationContainer.empty(); // Xóa nội dung hiện tại

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategory('${categoryCode}', 1)">First</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategory('${categoryCode}', ${currentPage - 1})">&laquo;</a>
        </li>
    `);

    for (var i = 1; i <= totalPage; i++) {
        paginationContainer.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:;" onclick="fetchNewsByCategory('${categoryCode}', ${i})">${i}</a>
            </li>
        `);
    }

    paginationContainer.append(`
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategory('${categoryCode}', ${currentPage + 1})">&raquo;</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="javascript:;" onclick="fetchNewsByCategory('${categoryCode}', ${totalPage})">Last</a>
        </li>
    `);
}

function fetchCategoryNames() {
    $.ajax({
        url: '/news_lv/category',
        method: 'GET',
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderCategories(data.result);
            } else {
                console.error('Unexpected response format:', data);
            }
        },
        error: function(error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function fetchCategoryNameInEditNews(selectedCategoryCode) {
    $.ajax({
        url: '/news_lv/category', // Thay thế bằng endpoint API thực tế của bạn
        method: 'GET',
        success: function(data) {
            if (data.code === 1000 && Array.isArray(data.result)) {
                renderCategoryInNews(data.result, selectedCategoryCode);
            } else {
                console.error('Unexpected response format:', data);
            }
        },
        error: function(error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function renderCategoryInNews(categories, selectedCategoryCode) {
    var categorySelect = $('#category-select');
    categorySelect.empty(); // Xóa các tùy chọn hiện tại

    categories.forEach(function(category) {
        var isSelected = category.code === selectedCategoryCode ? 'selected' : '';
        categorySelect.append(`<option data-category-id="${category.id}" value="${category.code}" ${isSelected}>${category.name}</option>`);
    });

    // If no category is selected, add a default empty option
    if (!selectedCategoryCode) {
        categorySelect.prepend('<option value="" selected disabled>Chọn thể loại</option>');
    }
}

function renderCategories(categories) {
    var categoryContainer = $('#category-name');
    var sessionCategoryCode = sessionStorage.getItem('categoryCodeInNewItem');

    // Nếu sessionCategoryCode không tồn tại, thiết lập giá trị mặc định là 'the-thao'
    if (!sessionCategoryCode) {
        sessionCategoryCode = 'the-thao';
        sessionStorage.setItem('categoryCodeInNewItem', sessionCategoryCode);
    }

    categories.forEach(function(category) {
        var categoryItem = createCategoryItem(category);
        categoryContainer.append(categoryItem);
    });

    // Thêm class active-categoryName vào danh mục có categoryCode trùng với sessionCategoryCode
    $('.nav-link').each(function() {
        var categoryCode = $(this).find('span').data('category-code');
        if (categoryCode === sessionCategoryCode) {
            $(this).addClass('active-categoryName');
        }
    });
}
/*function renderCategories(categories) {
    var categoryContainer = $('#category-name');
    var sessionCategoryCode = sessionStorage.getItem('categoryCodeInNewItem');
    if (sessionCategoryCode === undefined || sessionCategoryCode === 'undefined') {
        sessionCategoryCode = 'the-thao'; // Mặc định là 'the-thao' nếu giá trị là undefined
    }

    categories.forEach(function(category) {
        var categoryItem = createCategoryItem(category);
        categoryContainer.append(categoryItem);
    });

    // Thêm class active-categoryName vào danh mục có categoryCode trùng với sessionCategoryCode
    $('.nav-link').each(function() {
        var categoryCode = $(this).find('span').data('category-code');
        if (categoryCode === sessionCategoryCode) {
            $(this).addClass('active-categoryName');
        }
    });
}*/

function createCategoryItem(category) {
    // var isActive = category.code === 'the-thao' ? 'active-categoryName' : '';
    return `
        <li class="nav-item">
            <a id="categoryFetchNews" class="nav-link mb-0 px-0 py-1 d-flex align-items-center justify-content-center" data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="false">
                <i class="ni ni-app"></i>
                <span class="ms-2" data-category-code="${category.code}">${category.name}</span>
            </a>
        </li>
    `;
}

// Khi người dùng chọn ảnh mới:
/*$(document).on('change', '#imageUpload', function (event) {
    const file = event.target.files[0]; // Lấy file người dùng chọn
    const oldPublicId = $("#publicId").val(); // Lấy public_id của ảnh cũ

    if (file) {
        if (oldPublicId) {
            // Nếu đã có public_id của ảnh cũ, tiến hành xóa trước khi upload ảnh mới
            deleteOldImage(oldPublicId);
        }

        // Upload ảnh mới lên server
        uploadToServer(file).then((imageUrl) => {
            if (imageUrl) {
                console.log("Image uploaded successfully: ", imageUrl);
            }
        });
    }
});*/

/*function uploadToServer(file) {
    const formData = new FormData();
    formData.append("file", file);

    return fetch("/news_lv/image", {  // API upload từ Spring Boot
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Server upload response:", data);
            const imageUrl = data.secure_url;
            const publicId = data.public_id;  // Lưu public_id để xóa sau này

            // Cập nhật input ẩn với URL và public_id
            $("#thumbnailUrl").val(imageUrl);
            $("#publicId").val(publicId);

            // Hiển thị hình ảnh sau khi upload
            displaySelectedThumbnail(imageUrl);

            return imageUrl;
        })
        .catch((error) => {
            console.error("Error uploading to server:", error);
            return null;
        });
}

function deleteOldImage(publicId) {
    if (publicId) {
        $.ajax({
            url: `/news_lv/image?publicId=${publicId}`,  // API xóa từ Spring Boot
            type: 'DELETE',
            success: function (response) {
                console.log('Đã xóa ảnh cũ thành công:', response);
            },
            error: function (error) {
                console.error('Lỗi khi xóa ảnh:', error);
            }
        });
    }
}*/

$(document).on('change', '#imageUpload', function (event) {
    const file = event.target.files[0]; // Lấy file người dùng chọn
    const oldPublicId = $("#publicId").val(); // Lấy public_id của ảnh cũ
    console.log('oldPublicId:', oldPublicId);

    if (file) {
        if (oldPublicId) {
            // Nếu đã có public_id của ảnh cũ, tiến hành xóa trước khi upload ảnh mới
            deleteOldImage(oldPublicId);
        }
        // Gọi hàm upload và xử lý khi upload hoàn tất
        uploadToCloudinary(file)
            .then((imageUrl) => {
                if (imageUrl) {
                    console.log("Image uploaded successfully: ", imageUrl);
                }
            });
    }
})

function uploadToCloudinary(file) {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dd1grolgr/image/upload";
    const uploadPreset = "auto-tag";
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    return fetch(cloudinaryUrl, {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Cloudinary response:", data);

            // Cập nhật input ẩn với URL trả về từ Cloudinary
            $("#thumbnailUrl").val(data.secure_url);
            $("#publicId").val(data.public_id);

            // Hiển thị hình ảnh sau khi upload
            displaySelectedThumbnail(data.secure_url);

            return data.secure_url;
        })
        .catch((error) => {
            console.error("Error uploading to Cloudinary:", error);
            return null;
        });
}

function deleteOldImage(publicId) {
    // Gọi API của server để xóa ảnh
    $.ajax({
        url: '/news_lv/image/delete-image',  // Đường dẫn tới API xóa ảnh trên server
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ publicId: publicId }),
        success: function(response) {
            console.log('Đã xóa ảnh cũ thành công:', response);
        },
        error: function(error) {
            console.error('Lỗi khi xóa ảnh:', error);
        }
    });
}
/*function deleteOldImage(publicId) {
    $.ajax({
        url: `https://api.cloudinary.com/v1_1/dd1grolgr/image/destroy`,  // Đường dẫn xóa ảnh
        type: 'DELETE',  // Sử dụng phương thức DELETE
        data: JSON.stringify({
            public_id: publicId
        }),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Basic ' + btoa('165223227289875:KuEgKknBTrJ7-FdsAHGJYa_Jx4c')  // Chuyển API Key và Secret thành Base64 cho header Authorization
        },
        success: function(response) {
            console.log('Đã xóa ảnh cũ thành công:', response);
        },
        error: function(error) {
            console.error('Lỗi khi xóa ảnh:', error);
        }
    });
}*/

function displaySelectedThumbnail(imageUrl) {
    // Cập nhật nội dung của div #imagePreview để hiển thị ảnh
    $('#imagePreview').html(`<img src="${imageUrl}" alt="Image Preview" style="max-width: 100%; height: auto;">`);
}
/*function displaySelectedThumbnail(imageUrl) {
    // Cập nhật nội dung của div #imagePreview để hiển thị ảnh
    $('#imagePreview').html(`<img src="${imageUrl}" alt="Image Preview" style="max-width: 100%; height: auto;">`);
}*/

function initializeCKEditor(content) {
    if (!content) {
        content = ""; // Gán giá trị mặc định nếu content là null
    }
    CKEDITOR.ClassicEditor
        .create(document.getElementById("editor"), {
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
            placeholder: 'Welcome to content New',
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
            fontSize: {
                options: [ 10, 12, 14, 'default', 18, 20, 22 ],
                supportAllValues: true
            },
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
            htmlEmbed: {
                showPreviews: true
            },
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
            removePlugins: [
                'AIAssistant', 'CKBox', 'CKFinder', 'EasyImage', 'RealTimeCollaborativeComments',
                'RealTimeCollaborativeTrackChanges', 'RealTimeCollaborativeRevisionHistory', 'PresenceList',
                'Comments', 'TrackChanges', 'TrackChangesData', 'RevisionHistory', 'Pagination', 'WProofreader',
                'MathType', 'SlashCommand', 'Template', 'DocumentOutline', 'FormatPainter', 'TableOfContents',
                'PasteFromOfficeEnhanced', 'CaseChange'
            ]
        })
        .then(editor => {
            window.editor = editor;
            editorInstance = editor; // Lưu instance của editor để sử dụng sau
            editor.setData(content);
            /*editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new MyUploadAdapter(loader);
            };*/
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi khi tạo CKEditor:', error);
        });

}

/*
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'ml_default');

                fetch('https://api.cloudinary.com/v1_1/dd1grolgr/image/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        resolve({
                            default: data.secure_url
                        });
                    })
                    .catch(error => {
                        reject(error);
                    });
            }));
    }

    abort() {
        // Handle abort
    }
}*/
