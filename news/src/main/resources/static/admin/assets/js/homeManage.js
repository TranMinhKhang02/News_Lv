$(document).ready(function () {
    var category = sessionStorage.getItem('categories');
    function fetchDataAndUpdateUIMange() {
        $.ajax({
            url: '/news_lv/events/today/views',
            method: 'GET',
            data: {
                category: category
            },
            success: function (data) {
                updateViewTodayMange(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/today/favorites',
            method: 'GET',
            data: {
                category: category
            },
            success: function (data) {
                updateFavoriteTodayManage(data.result);
            },
            error: function (error) {
                console.error('Error fetching favorite events this week:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/week/views',
            method: 'GET',
            data: {
                category: category
            },
            success: function (data) {
                updateViewWeekMange(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events today:', error);
            }
        });

        $.ajax({
            url: '/news_lv/events/week/favorites',
            method: 'GET',
            data: {
                category: category
            },
            success: function (data) {
                updateFavoriteWeekMange(data.result);
            },
            error: function (error) {
                console.error('Error fetching view events this week:', error);
            }
        });
    }

    function updateFavoriteTodayManage(data) {
        // Cập nhật giao diện với dữ liệu yêu thích hôm nay
        $('#favorite-today-manage').text(data);
    }

    function updateFavoriteWeekMange(data) {
        // Cập nhật giao diện với dữ liệu yêu thích tuần này
        $('#favorite-week-manage').text(data);
    }

    function updateViewTodayMange(data) {
        // Cập nhật giao diện với dữ liệu lượt xem hôm nay
        $('#view-today-manage').text(data);
    }

    function updateViewWeekMange(data) {
        // Cập nhật giao diện với dữ liệu lượt xem tuần này
        $('#view-week-manage').text(data);
    }

    /*-------------------------------FAVORITE YEAR-------------------------------*/
    var chartInstanceFavoriteYearManage; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceFavoriteMonthManage; // Biến toàn cục để lưu trữ biểu đồ

    function favoriteYearManage() {
        $.ajax({
            url: '/news_lv/events/year/favorites', // URL API của bạn
            method: 'GET',
            data: {
                category: category
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartFavoriteYearManage(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartFavoriteYearManage(data, labels) {
        var ctx1 = document.getElementById("favoriteYear-manage").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceFavoriteYearManage) {
            chartInstanceFavoriteYearManage.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstanceFavoriteYearManage = new Chart(ctx1, {
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

    function favoriteMonthManage() {
        $.ajax({
            url: '/news_lv/events/month/favorites', // URL API của bạn
            method: 'GET',
            data: {
                category: category
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartFavoriteMonthManage(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartFavoriteMonthManage(data, labels) {
        var ctx1 = document.getElementById("favoriteMonth-manage").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceFavoriteMonthManage) {
            chartInstanceFavoriteMonthManage.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

        chartInstanceFavoriteMonthManage = new Chart(ctx1, {
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
    var chartInstanceViewYearManage; // Biến toàn cục để lưu trữ biểu đồ
    var chartInstanceViewMonthManage; // Biến toàn cục để lưu trữ biểu đồ

    function viewYearManage() {
        $.ajax({
            url: '/news_lv/events/year/views', // URL API của bạn
            method: 'GET',
            data: {
                category: category
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartViewYearManage(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartViewYearManage(data, labels) {
        var ctx1 = document.getElementById("viewYear-manage").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceViewYearManage) {
            chartInstanceViewYearManage.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

        chartInstanceViewYearManage = new Chart(ctx1, {
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

    function viewMonthManage() {
        $.ajax({
            url: '/news_lv/events/month/views', // URL API của bạn
            method: 'GET',
            data: {
                category: category
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartViewMonthManage(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }

    function updateChartViewMonthManage(data, labels) {
        var ctx1 = document.getElementById("viewMonth-manage").getContext("2d");

        // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceViewMonthManage) {
            chartInstanceViewMonthManage.destroy();
        }

        var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

        chartInstanceViewMonthManage = new Chart(ctx1, {
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

    var Role = sessionStorage.getItem('Role')
    if (Role === 'ADMIN_MANAGE') {
        loadDashboardManage()
        $(document).on('click', '#dashboardAdmin', function (e) {
            e.preventDefault();
            loadDashboardManage()
        })
    }

    function loadDashboardManage() {
        $('#content-container').load('/news_lv/page/dashboardManage', function () {
            fetchDataAndUpdateUIMange();

            favoriteYearManage();

            favoriteMonthManage()

            viewYearManage()

            viewMonthManage()
        })
    }
});