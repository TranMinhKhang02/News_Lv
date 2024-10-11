(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
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

        // Định dạng ngày tháng
        const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(currentDate);
        // const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

        // Hiển thị vào trong phần tử HTML
        document.getElementById('current-date').innerText = formattedDate;
        sessionFail();
        localStorageFail();
    });

    function sessionFail() {
        const userLogin = sessionStorage.getItem('userLogin');
        if(userLogin == null) {
            $('#logoutButton').hide();
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
            $('#logoutButton').show();
        }
    }

    //============================LOGOUT============================
    $('#logoutButton').on('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định

        sessionStorage.removeItem('userLogin');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('currentNewsId');

        // Xóa local storage
        sessionStorage.clear();

        localStorage.clear();
        /*$.ajax({
            url: '/news_lv/page/logout',
            method: 'GET',
            success() {
                console.log('Logout successfully');
                /!*$('#userDropdownToggle').hide();
                $('#userDropdownMenu').hide();
                $('#notification-icon').hide();*!/
            },
            error() {
                console.log('Error when logging out');
            }
        })*/

        // Redirect tới trang logout kèm theo URL hiện tại dưới dạng query parameter
        window.location.href = '/news_lv/page/home';
        $('#login-btn').hide();
    });
    
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

