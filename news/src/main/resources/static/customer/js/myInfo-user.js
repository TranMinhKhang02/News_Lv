$(document).ready(function () {
    $('.savedNews').on('click', function() {
        getFavorite(1, 5); // Gọi hàm getFavorite với trang 1 và kích thước 5 khi click vào nút "Tin đã lưu"
        $('#updateProfile').hide();
    });
    var userId = sessionStorage.getItem('userId');
    if(userId) {
        fetchUserById(userId);
    }

});

function getFavorite(page, size) {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        // Gọi API để lấy danh sách tin yêu thích của user
        $.ajax({
            url: '/news_lv/users/favorite',  // Đường dẫn API lấy danh sách yêu thích
            method: 'GET',
            data: { userId: userId, page: page, size: size },
            success: function(response) {
                const favoriteNews = response.result; // Danh sách tin yêu thích của user
                const totalPage = response.totalPage;

                // Render danh sách tin yêu thích vào form mẫu
                renderFavoriteNews(favoriteNews, page, totalPage);
            },
            error: function(error) {
                console.error('Error fetching favorite news:', error);
                createToast('error', 'fas fa-exclamation', 'Thất bại', 'Có lỗi xảy ra khi lấy danh sách yêu thích');
            }
        });
    } else {
        alert('Vui lòng đăng nhập để xem danh sách yêu thích.');
        createToast('warning', 'fas fa-exclamation-circle', 'Thất bại', 'Vui lòng đăng nhập để xem danh sách yêu thích');
    }
}

// Hàm để render danh sách tin yêu thích vào form mẫu
function renderFavoriteNews(favoriteNews, currentPage, totalPage) {
    // Xóa nội dung cũ trong form mẫu
    $('#info-user').html('');

    // Kiểm tra nếu danh sách tin yêu thích không rỗng
    if (favoriteNews.length > 0) {
        // Duyệt qua danh sách tin yêu thích và thêm vào form mẫu
        favoriteNews.forEach(news => {
            const newsItemHtml = `
                <div class="d-flex mb-3">
                    <img src="${news.thumbnail}" style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="w-100 d-flex flex-column justify-content-center bg-light px-3" style="height: 100px;">
                        <div class="mb-1" style="font-size: 13px;">
                            <a href="/category/${news.categories[0].code}">${news.categories[0].name}</a>
                            <span class="px-1">/</span>
                            <span>${new Date(news.modifiedDate).toLocaleDateString()}</span>
                        </div>
                        <a class="h4 m-0 title-news" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
<!--                        <a class="h6 m-0" href="/news/${news.id}">${news.title}</a>-->
                    </div>
                </div>
            `;

            // Thêm tin tức vào form mẫu
            $('#info-user').append(newsItemHtml);
        });

        // Thêm các nút phân trang
        const paginationHtml = generatePagination(currentPage, totalPage);
        $('#info-user').append(paginationHtml);
    } else {
        // Nếu không có tin yêu thích, hiển thị thông báo
        $('#info-user').html('<p>Chưa có tin tức yêu thích nào.</p>');
    }
}

function generatePagination(currentPage, totalPage) {
    let paginationHtml = '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';

    // Nút First
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getFavorite(1, 5)">Đầu</a>
        </li>
    `;

    // Nút Previous
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getFavorite(${currentPage - 1}, 5)">&laquo;</a>
        </li>
    `;

    // Các nút số trang
    for (let i = 1; i <= totalPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="getFavorite(${i}, 5)">${i}</a>
            </li>
        `;
    }

    // Nút Next
    paginationHtml += `
        <li class="page-item ${currentPage === totalPage ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getFavorite(${currentPage + 1}, 5)">&raquo;</a>
        </li>
    `;

    // Nút Last
    paginationHtml += `
        <li class="page-item ${currentPage === totalPage ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getFavorite(${totalPage}, 5)">Cuối</a>
        </li>
    `;

    paginationHtml += '</ul></nav>';
    return paginationHtml;
}

function fetchUserById(userId) {
    $.ajax({
        url: "/news_lv/users/" + userId,
        type: 'Get',
        success: function (response) {
            var user = response.result;
            $('#fullName').val(user.fullName);
            $('#email').val(user.email);
            $('#phoneNumber').val(user.phoneNumber);
            $('#avatar').val(user.avatar);
            $('#dob').val(user.dob);
        },
        error: function (error) {
            console.error('Error updating user:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin.');
        }
    })
}

$(document).on('click', '#updateProfile', function() {
    var userId = sessionStorage.getItem('userId');
    var data = {
        passwordPrevious: $('#passwordPrevious').val(),
        password: $('#passwordNew').val(),
        fullName: $('#fullName').val(),
        email: $('#email').val(),
        phoneNumber: $('#phoneNumber').val(),
        avatar: $('#avatar').val(),
        dob: $('#dob').val()
    }
    if(!data.password) {
        delete data.password;
        delete data.passwordPrevious;
    }

    updateProfile(userId, data);
})

function updateProfile(userId, data) {
    $.ajax({
        url: "/news_lv/users/" + userId,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            createToast('success', 'fas fa-check', 'Thành công', 'Cập nhật thông tin thành công');
            sessionStorage.clear();
            window.location.href = "/news_lv/page/login";

        },
        error: function (error) {
            console.error('Error updating user:', error);
            createToast('error', 'fas fa-exclamation', 'Thất bại', 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    })
}