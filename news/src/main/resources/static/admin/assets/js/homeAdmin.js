$(document).ready(function () {
    /*function summarizeAllNews() {
        $.ajax({
            url: '/news_lv/news/summarize',
            type: 'POST',
            success: function () {
                console.log('Tóm tắt tất cả bài viết thành công!');
                // Cập nhật giao diện nếu cần
            },
            error: function (error) {
                console.error('Error summarizing news:', error);
            }
        });
    }

    summarizeAllNews()*/

    var Role = sessionStorage.getItem('Role');
    /*=========================EVENT===============================*/
    function fetchDataAndUpdateUI() {
        $.ajax({
            url: '/news_lv/events/favorite-events/today',
            method: 'GET',
            success: function (data) {
                updateFavoriteToday(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/favorite-events/week',
            method: 'GET',
            success: function (data) {
                updateFavoriteWeek(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events this week:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/view-events/today',
            method: 'GET',
            success: function (data) {
                updateViewToday(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/view-events/week',
            method: 'GET',
            success: function (data) {
                updateViewWeek(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events this week:', error);
            }
        });
    }

    function updateFavoriteToday(data) {
        // Cập nhật giao diện với dữ liệu yêu thích hôm nay
        $('#favorite-today').text(data);
    }

    function updateFavoriteWeek(data) {
        // Cập nhật giao diện với dữ liệu yêu thích tuần này
        $('#favorite-week').text(data);
    }

    function updateViewToday(data) {
        // Cập nhật giao diện với dữ liệu lượt xem hôm nay
        $('#view-today').text(data);
    }

    function updateViewWeek(data) {
        // Cập nhật giao diện với dữ liệu lượt xem tuần này
        $('#view-week').text(data);
    }

    /*-------------------------------FAVORITE YEAR-------------------------------*/
    var chartInstanceFavoriteYear; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceFavoriteMonth; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceFavorite7LastDay; // Biến toàn cục để lưu trữ biểu đồ

    function favoriteYear() {
        $.ajax({
            url: '/news_lv/events/favorite-events/year', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChart(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChart(data, labels) {
        var ctx1 = document.getElementById("chart-line").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceFavoriteYear) {
            chartInstanceFavoriteYear.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstanceFavoriteYear = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt yêu thích",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }

    function favoriteMonth() {
        $.ajax({
            url: '/news_lv/events/favorite-events/month', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartFavoriteMonth(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartFavoriteMonth(data, labels) {
        var ctx1 = document.getElementById("favoriteMonth").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceFavoriteMonth) {
            chartInstanceFavoriteMonth.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstanceFavoriteMonth = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt yêu thích",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }

    function favorite7LastDay() {
        $.ajax({
            url: '/news_lv/events/favorite-events/last7days', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.result.map(item => parseInt(item.split(': ')[1]));
                var labels = response.result.map(item => item.split(': ')[0]);

                updateChartFavorite7LastDay(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartFavorite7LastDay(data, labels) {
        var ctx1 = document.getElementById("favorite7LastDay").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceFavorite7LastDay) {
            chartInstanceFavorite7LastDay.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstanceFavorite7LastDay = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt yêu thích",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }
    /*-------------------------------FAVORITE------------------------------------*/
    /*-------------------------------VIEW----------------------------------------*/
    var chartInstanceViewYear; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceViewMonth; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceView7LastDay; // Biến toàn cục để lưu trữ biểu đồ

    function viewYear() {
        $.ajax({
            url: '/news_lv/events/view-events/year', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartViewYear(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartViewYear(data, labels) {
        var ctx1 = document.getElementById("viewYear").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceViewYear) {
            chartInstanceViewYear.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

        chartInstanceViewYear = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt xem",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }

    function viewMonth() {
        $.ajax({
            url: '/news_lv/events/view-events/month', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartViewMonth(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartViewMonth(data, labels) {
        var ctx1 = document.getElementById("viewMonth").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceViewMonth) {
            chartInstanceViewMonth.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

        chartInstanceViewMonth = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt xem",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }

    function view7LastDay() {
        $.ajax({
            url: '/news_lv/events/view-events/last7days', // URL API của bạn
            method: 'GET',
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.result.map(item => parseInt(item.split(': ')[1]));
                var labels = response.result.map(item => item.split(': ')[0]);

                updateChartView7LastDay(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartView7LastDay(data, labels) {
        var ctx1 = document.getElementById("view7LastDay").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceView7LastDay) {
            chartInstanceView7LastDay.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

        chartInstanceView7LastDay = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Lượt xem",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#5e72e4",
                    backgroundColor: gradientStroke1,
                    borderWidth: 3,
                    fill: true,
                    data: data,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#fbfbfb',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#ccc',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    }
    /*-------------------------------VIEW----------------------------------------*/
    function loadDashboardAdmin() {
        $('#content-container').load('/news_lv/page/dashboardAdmin', function () {
            fetchDataAndUpdateUI();

            favoriteYear();

            favoriteMonth()

            favorite7LastDay()

            viewYear()

            viewMonth()

            view7LastDay()
        })
    }
    /*=========================EVENT===============================*/
    console.log('Role: ', Role);

    var navAdmin = $('.nav-admin');
    var navManage = $('.nav-manage');
    var navAuthor = $('.nav-author');

    if (Role === 'ADMIN') {
        loadDashboardAdmin()
        $(document).on('click', '#dashboardAdmin', function (e) {
            e.preventDefault();
            loadDashboardAdmin()
        })
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