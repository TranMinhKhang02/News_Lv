$(document).ready(function () {
    var Role = sessionStorage.getItem('Role');
    console.log('Role: ', Role);

    var navAdmin = $('.nav-admin');
    var navManage = $('.nav-manage');
    var navAuthor = $('.nav-author');

    if (Role === 'ADMIN') {
        sessionStorage.removeItem('categories')
        sessionStorage.removeItem('userName')
        navManage.remove()
        navAuthor.remove()
    } else if (Role === 'ADMIN_MANAGE') {
        sessionStorage.removeItem('userName')
        navAdmin.remove()
        navAuthor.remove()
    } else if (Role === 'AUTHOR') {
        sessionStorage.removeItem('categories')
        navAdmin.remove()
        navManage.remove()
    }

})

$(document).on('click', '#profileAdmin', function (e) {
    e.preventDefault();
    console.log('Profile Admin');
    $('#content-container').load('/news_lv/page/profileAdmin', function(response, status, xhr) {
        if (status == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        } else {
            console.log("Content loaded successfully");
            console.log(response);
        }
    });
});

$('#logoutButton').on('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định

    sessionStorage.removeItem('userLogin');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('currentNewsId');

    // Xóa local storage
    sessionStorage.clear();

    localStorage.clear();

    // Đánh dấu trạng thái logout trong sessionStorage
    sessionStorage.setItem('isLoggedOut', 'true');

    // Redirect tới trang logout kèm theo URL hiện tại dưới dạng query parameter
    window.location.href = '/news_lv/page/home';
    $('#login-btn').hide();
});