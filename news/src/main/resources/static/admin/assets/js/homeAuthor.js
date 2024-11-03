$(document).ready(function () {
    var userName = sessionStorage.getItem('userName');
    function fetchDataAndUpdateUIMange() {
        $.ajax({
            url: '/news_lv/events/today/views/createdBy',
            method: 'GET',
            data: {
                createdBy: userName
            },
            success: function (data) {
                updateViewTodayAuthor(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/today/favorites/createdBy',
            method: 'GET',
            data: {
                createdBy: userName
            },
            success: function (data) {
                updateFavoriteTodayAuthor(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events this week:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/week/views/createdBy',
            method: 'GET',
            data: {
                createdBy: userName
            },
            success: function (data) {
                updateViewWeekAuthor(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/week/favorites/createdBy',
            method: 'GET',
            data: {
                createdBy: userName
            },
            success: function (data) {
                updateFavoriteWeekAuthor(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events this week:', error);
            }
        });
    }

    function updateFavoriteTodayAuthor(data) {
        // Cập nhật giao diện với dữ liệu yêu thích hôm nay
        $('#favorite-today-author').text(data);
    }

    function updateFavoriteWeekAuthor(data) {
        // Cập nhật giao diện với dữ liệu yêu thích tuần này
        $('#favorite-week-author').text(data);
    }

    function updateViewTodayAuthor(data) {
        // Cập nhật giao diện với dữ liệu lượt xem hôm nay
        $('#view-today-author').text(data);
    }

    function updateViewWeekAuthor(data) {
        // Cập nhật giao diện với dữ liệu lượt xem tuần này
        $('#view-week-author').text(data);
    }

    var Role = sessionStorage.getItem('Role')
    if (Role === 'AUTHOR') {
        loadDashboardAuthor()
        $(document).on('click', '#dashboardAdmin', function (e) {
            e.preventDefault();
            loadDashboardAuthor()
        })
    }

    function loadDashboardAuthor() {
        $('#content-container').load('/news_lv/page/dashboardAuthor', function () {
            fetchDataAndUpdateUIMange();

            /*favoriteYearManage();

            favoriteMonthManage()

            favorite7LastDayManage()

            viewYearManage()

            viewMonthManage()

            view7LastDayManage()*/
        })
    }
});