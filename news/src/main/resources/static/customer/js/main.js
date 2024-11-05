(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        var Role = sessionStorage.getItem('Role')
        if (Role == 'ADMIN' || Role == 'ADMIN_MANAGE' || Role == 'AUTHOR') {
            $('#redirectAdmin').removeClass('d-none');
        } else {
            $('#redirectAdmin').remove()
        }
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        // Lấy thời gian hiện tại của Việt Nam (GMT+7)
        const currentDate = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ của Việt Nam
        };

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

        // Kiểm tra trạng thái logout từ sessionStorage
        const isLoggedOut = sessionStorage.getItem('isLoggedOut') === 'true';
        if (!isLoggedOut){
            getSession()
            setMyInfoSession()
        } else {
            // Nếu đã logout, xóa cờ để không gọi lại nữa
            sessionStorage.removeItem('isLoggedOut');
        }

        // Định dạng ngày tháng
        const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(currentDate);
        // const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

        // Hiển thị vào trong phần tử HTML
        document.getElementById('current-date').innerText = formattedDate;

        sessionFail();
        // localStorageFail();

        // Kiểm tra xem sessionStorage có chứa thông tin user hay không
        const user = JSON.parse(sessionStorage.getItem('user'));
        var avatarSession = sessionStorage.getItem('avatar');
        var avatarSrc = user && user.avatar ? user.avatar : (avatarSession ? avatarSession : defaultAvatarPath);

        if (user) {
            // Cập nhật avatar
            const avatarImg = $('#userAvatar');
            avatarImg.attr('src', avatarSrc);
            /*if (user.avatar && user.avatar !== '') {
                avatarImg.attr('src', user.avatar); // Avatar từ sessionStorage
            } else {
                avatarImg.attr('src', defaultAvatarPath); // Avatar mặc định
            }*/

            // Cập nhật tên đầy đủ
            $('#userFullName').text(user.fullName);
        }
    });

    function getSession() {
        $.ajax({
            url: '/news_lv/page/getSession-userId', // Đường dẫn tới API của bạn
            method: 'GET',
            success: function(response) {
                // Lưu userId vào sessionStorage
                const userId = response.split(": ")[1]; // Tách userId từ chuỗi "userId: 20"
                sessionStorage.setItem('userId', userId);
                sessionStorage.setItem('userLogin', 'true');
                localStorage.setItem('userLocal', 'true');
                console.log("UserId stored in sessionStorage:", userId);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching userId from session:", error);
            }
        });
    }

    function setMyInfoSession() {
        $.ajax({
            url: '/news_lv/users/myInfo', // Gọi API để lấy thông tin người dùng
            method: 'GET',
            success: function(userResponse) {
                sessionStorage.setItem('user', JSON.stringify(userResponse.result)); // Lưu thông tin người dùng vào sessionStorage
                console.log("User info stored in sessionStorage:", userResponse.result);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching user info from session:", error);
            }
        });
    }

    function sessionFail() {
        const userLogin = sessionStorage.getItem('userLogin');
        if(!userLogin) {
            $('#userDropdownToggle').hide();
            $('#userDropdownMenu').hide();
            $('#notification-icon').hide();
        }else {
            $('#login-btn').hide();
            $('#logoutButton').show();
            $('#userDropdownToggle').show();
            $('#notification-icon').show();
        }
    }

    function localStorageFail() {
        const userLocal = localStorage.getItem('userLocal');
        if (userLocal == null) {
            $('#login-btn').show();
            $('#logoutButton').hide();
        }
    }

    //============================LOGOUT============================

    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Tranding carousel
    $(".tranding-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });


    // Carousel item 1
    $(".carousel-item-1").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    // Carousel item 2
    $(".carousel-item-2").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Carousel item 3
    $(".carousel-item-3").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Carousel item 4
    $(".carousel-item-4").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });
    
})(jQuery);

