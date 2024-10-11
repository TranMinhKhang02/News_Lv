$(document).ready(function () {
    // fetchNewsByCategory('the-thao', 1); // Mặc định khi load là thể thao


});
// Thêm sự kiện click cho các danh mục
$(document).on('click', '.nav-link', function () {
    var categoryCode = $(this).find('span').data('category-code');
    fetchNewsByCategory(categoryCode, 1);
    $('.nav-link').removeClass('active-categoryName');
    $(this).addClass('active-categoryName');
});

$('#approved-articles').click(function () {
    $('#content-container').load('/news_lv/page/newsTable', function () {
        fetchCategoryNames();
        fetchNewsByCategory('the-thao', 1); // Mặc định khi load là thể thao
        // Thêm sự kiện click cho các danh mục sau khi nội dung được tải
        /*$(document).on('click', '.nav-link', function () {
            var categoryCode = $(this).find('span').data('category-code');
            fetchNewsByCategory(categoryCode, 1);
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
        });*/
    });
    $('#approved-articles').removeClass('active');
    $(this).addClass('active');
});

$(document).on('click', '#editNews', function (e) {
    var newsId = $(this).data('news-id');
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    $('#content-container').load('/news_lv/page/editNews', function () {
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
                    $('input[name="category"]').val(news.categories[0].name);
                    $('input[name="content"]').val(news.content);
                }
            },
            error: function(error) {
                console.error('Error fetching news:', error);
            }
        });
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

function fetchNewsByCategory(categoryCode, page) {
    $.ajax({
        url: '/news_lv/news/by-category-and-status',
        method: 'GET',
        data: {
            category: categoryCode,
            status: '1',
            page: page,
            size: 10
        },
        success: function(data) {
            console.log('API response:', data); // Kiểm tra dữ liệu trả về từ API
            if (data.code === 1000) {
                console.log('Code is 1000');
            }
            if (Array.isArray(data.result)) {
                console.log('Result is an array');
            }
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
                        <h6 class="mb-0 text-sm">${news.title}</h6>
                        <p class="text-xs text-secondary mb-0">${news.createdBy}</p>
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${news.createdBy}</p>
                <p class="text-xs text-secondary mb-0">${news.source}</p>
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

function renderCategories(categories) {
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
}

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