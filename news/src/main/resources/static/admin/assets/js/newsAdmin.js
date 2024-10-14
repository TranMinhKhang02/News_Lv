$(document).ready(function () {
    // fetchNewsByCategory('the-thao', 1); // Mặc định khi load là thể thao

});

const userId = sessionStorage.getItem('userId');

function loadNewsTableSuccess(categoryCode) {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        sessionStorage.setItem('status', 1);
        $('#news-waitApprove').removeClass('active-categoryName');
        $('#approved-articles').addClass('active-categoryName');
        fetchCategoryNames();
        fetchNewsByCategory(categoryCode, 1, 1); // Mặc định khi load là thể thao

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
}

function showHideBtn() {
    var status = sessionStorage.getItem('status');
    var btnSaveNews = $('#saveNews');
    var btnApprove = $('#approveNews');
    var btnRefuse = $('#refuseNews');
    if(status == 1){
        btnSaveNews.show();
        btnApprove.hide();
        btnRefuse.hide();
    } else if(status == 2){
        btnApprove.show();
        btnRefuse.show();
        btnSaveNews.hide();
    }
}

// Thêm sự kiện click cho các danh mục
$(document).on('click', '.nav-link', function () {
    var categoryCode = $(this).find('span').data('category-code');
    // Đặt category mặc định là the-thao
    categoryCode = categoryCode === undefined ? 'the-thao' : categoryCode;
    sessionStorage.setItem('categoryCodeInNewItem', categoryCode);
    var status = sessionStorage.getItem('status');
    fetchNewsByCategory(categoryCode, 1, status);
    $('.nav-link').not('#approved-articles, #news-waitApprove, #news-refused').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

$('#approved-articles').click(function () {
    $('#createNews').show()
    $('#news-waitApprove').removeClass('active-categoryName');
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, status); // Mặc định khi load là thể thao
    });
    $('#approved-articles').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

$('#news-waitApprove').click(function () {
    $('#approved-articles').removeClass('active-categoryName');
    var status = $(this).data('status');
    sessionStorage.setItem('status', status);
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1, status); // Mặc định khi load là thể thao và status là 2
    });
    $('#news-waitApprove').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

//=====================================APPROVE NEWS=====================================
$(document).on('click', '#approveNews', function () {
    var newsId = sessionStorage.getItem('newsId');
    var category_code = sessionStorage.getItem('categoryCodeInNewItem');
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
                loadNewsTableSuccess(category_code)
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

$(document).on('click', '#back-newsByCategory', function () {
    var categoryCode = sessionStorage.getItem('categoryCodeInNewItem');
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
    });
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
                    $('input[name="createdDate"]').val(new Date(news.createdDate).toLocaleDateString());
                    // $('input[name="category"]').val(news.categories[0].name);
                    fetchCategoryNameInEditNews(news.categories[0].code);
                    $('input[name="content"]').val(news.content);
                }
            },
            error: function(error) {
                console.error('Error fetching news:', error);
            }
        });
    });
});

// Click vào nút Create news
$(document).on('click', '#createNews', function () {
    $('#content-container').load('/news_lv/page/editNews', function () {
        showHideBtn();
        // Clear dữ liệu trong các trường input
        $('#content-container').find('input, select').each(function() {
            $(this).val('');
        });
        fetchCategoryNameInEditNews('');
    });
});

$(document).on('click', '#saveNews', function () {
    // Lấy id từ data-category-id của option được chọn
    var selectedCategoryIds = $('#category-select option:selected').map(function() {
        return $(this).data('category-id');
    }).get();

    var newsData = {
        title: $('input[name="title"]').val(),
        shortDescription: $('input[name="shortDescription"]').val(),
        // createdDate: $('input[name="createdDate"]').val(),
        // category: $('#category-select').val(),
        categories: selectedCategoryIds,
        content: $('input[name="content"]').val()
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
                $('#content-container').load('/news_lv/page/newsTable');
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
    var newsContainer = $('tbody');
    newsContainer.empty(); // Xóa nội dung hiện tại

    newsList.forEach(function(news) {
        var newsItem = createNewsItem(news);
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
        url: '/news_lv/category', // Thay thế bằng endpoint API thực tế của bạn
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
}
/*function renderCategories(categories) {
    var categoryContainer = $('#category-name');
    categories.forEach(function(category) {
        var categoryItem = createCategoryItem(category);
        categoryContainer.append(categoryItem);
    });

    // Thêm class active-categoryName vào danh mục "Thể Thao" mặc định
    $('.nav-link').each(function() {
        var categoryCode = $(this).find('span').data('category-code');
        if (categoryCode === 'the-thao') {
            $(this).addClass('active-categoryName');
        }
    });
}*/

function createCategoryItem(category) {
    // var isActive = category.code === 'the-thao' ? 'active-categoryName' : '';
    return `
        <li class="nav-item">
            <a class="nav-link mb-0 px-0 py-1 d-flex align-items-center justify-content-center" data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="false">
                <i class="ni ni-app"></i>
                <span class="ms-2" data-category-code="${category.code}">${category.name}</span>
            </a>
        </li>
    `;
}