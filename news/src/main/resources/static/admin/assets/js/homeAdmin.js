$(document).ready(function () {
    showLoading()

    function toggleChartTimeout() {
        $('#favoriteYearCheckbox').prop('checked', true);
        $('#favoriteMonthCheckbox').prop('checked', true);
        $('#viewYearCheckbox').prop('checked', true);
        $('#viewMonthCheckbox').prop('checked', true);
        // Gọi hàm toggleChart cho các checkbox và biểu đồ tương ứng
        toggleChart($('#favoriteYearCheckbox'), $('#chartFavoriteYear'));
        toggleChart($('#favoriteMonthCheckbox'), $('#chartFavoriteMonth'));
        toggleChart($('#favorite7DaysCheckbox'), $('#chartFavorite7LastDay'));
        toggleChart($('#favoriteCustomCheckbox'), $('#chartFavoriteCustom'));
        toggleChart($('#viewYearCheckbox'), $('#chartViewYear'));
        toggleChart($('#viewMonthCheckbox'), $('#chartViewMonth'));
        toggleChart($('#view7DaysCheckbox'), $('#chartView7LastDay'));
        toggleChart($('#viewCustomCheckbox'), $('#chartViewCustom'));

        hideLoading()
        /*setTimeout(function () {
            $('#favoriteYearCheckbox').prop('checked', true);
            $('#favoriteMonthCheckbox').prop('checked', true);
            $('#viewYearCheckbox').prop('checked', true);
            $('#viewMonthCheckbox').prop('checked', true);
            // Gọi hàm toggleChart cho các checkbox và biểu đồ tương ứng
            toggleChart($('#favoriteYearCheckbox'), $('#chartFavoriteYear'));
            toggleChart($('#favoriteMonthCheckbox'), $('#chartFavoriteMonth'));
            toggleChart($('#favorite7DaysCheckbox'), $('#chartFavorite7LastDay'));
            toggleChart($('#favoriteCustomCheckbox'), $('#chartFavoriteCustom'));
            toggleChart($('#viewYearCheckbox'), $('#chartViewYear'));
            toggleChart($('#viewMonthCheckbox'), $('#chartViewMonth'));
            toggleChart($('#view7DaysCheckbox'), $('#chartView7LastDay'));
            toggleChart($('#viewCustomCheckbox'), $('#chartViewCustom'));
        }, 100); // Đặt độ trễ 100ms*/
    }

    setTimeout(toggleChartTimeout, 100)
    /*setTimeout(function () {
        $('#favoriteYearCheckbox').prop('checked', true);
        $('#favoriteMonthCheckbox').prop('checked', true);
        $('#viewYearCheckbox').prop('checked', true);
        $('#viewMonthCheckbox').prop('checked', true);
        // Gọi hàm toggleChart cho các checkbox và biểu đồ tương ứng
        toggleChart($('#favoriteYearCheckbox'), $('#chartFavoriteYear'));
        toggleChart($('#favoriteMonthCheckbox'), $('#chartFavoriteMonth'));
        toggleChart($('#favorite7DaysCheckbox'), $('#chartFavorite7LastDay'));
        toggleChart($('#favoriteCustomCheckbox'), $('#chartFavoriteCustom'));
        toggleChart($('#viewYearCheckbox'), $('#chartViewYear'));
        toggleChart($('#viewMonthCheckbox'), $('#chartViewMonth'));
        toggleChart($('#view7DaysCheckbox'), $('#chartView7LastDay'));
        toggleChart($('#viewCustomCheckbox'), $('#chartViewCustom'));
    }, 100); // Đặt độ trễ 100ms*/

    function toggleChart(checkbox, chart) {
        // Kiểm tra trạng thái của checkbox ngay khi hàm được gọi
        if (checkbox.is(':checked')) {
            chart.show();
            if (chart.is('#chartFavoriteMonth')) {
                $('#chartFavorite7LastDay').addClass('mt-4');
            }
            if (chart.is('#chartViewMonth')) {
                $('#chartView7LastDay').addClass('mt-4');
            }
        } else {
            chart.css('display', 'none');
            if (chart.is('#chartFavoriteMonth')) {
                $('#chartFavorite7LastDay').removeClass('mt-4');
            }
            if (chart.is('#chartViewMonth')) {
                $('#chartView7LastDay').removeClass('mt-4');
            }
        }

        // Gắn sự kiện change cho checkbox để cập nhật trạng thái biểu đồ
        checkbox.change(function() {
            if (checkbox.is(':checked')) {
                chart.show();
                if (chart.is('#chartFavoriteMonth')) {
                    $('#chartFavorite7LastDay').addClass('mt-4');
                }
                if (chart.is('#chartViewMonth')) {
                    $('#chartView7LastDay').addClass('mt-4');
                }
            } else {
                chart.css('display', 'none');
                if (chart.is('#chartFavoriteMonth')) {
                    $('#chartFavorite7LastDay').removeClass('mt-4');
                }
                if (chart.is('#chartViewMonth')) {
                    $('#chartView7LastDay').removeClass('mt-4');
                }
            }
        });
    }

    /*=========================EVENT===============================*/
    function loadDashboardAdmin() {
        $('#content-container').load('/news_lv/page/dashboardAdmin', function () {
            fetchDataAndUpdateUI();

            favoriteYear();

            favoriteMonth()

            favorite7LastDay()

            favoriteCustom()

            viewYear()

            viewMonth()

            view7LastDay()

            viewCustom()

            setTimeout(toggleChartTimeout, 100)
        })
    }
    /*=========================EVENT===============================*/
    function removeNavMenu() {
        var Role = sessionStorage.getItem('Role');
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
        } else {
            window.location.href = '/news_lv/page/error'
        }
    }

    removeNavMenu()
});

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
var chartInstanceFavoriteCustom; // Biến toàn cục để lưu trữ biểu đồ

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
    var ctx1 = document.getElementById("favoriteYear").getContext("2d");

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
    gradientStroke1.addColorStop(1, 'rgba(205, 37, 37, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(205, 37, 37, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(205, 37, 37, 0)');

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

function favoriteCustom(startDate, endDate) {
    if (startDate && endDate) {
        $.ajax({
            url: '/news_lv/events/favorite-events/custom', // URL API của bạn
            method: 'GET',
            data: {
                startDate: startDate,
                endDate: endDate
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartFavoriteCustom(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }
}

function updateChartFavoriteCustom(data, labels) {
    var ctx1 = document.getElementById("favoriteCustom").getContext("2d");

    // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
    if (chartInstanceFavoriteCustom) {
        chartInstanceFavoriteCustom.destroy();
    }

    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

    chartInstanceFavoriteCustom = new Chart(ctx1, {
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
var chartInstanceViewCustom; // Biến toàn cục để lưu trữ biểu đồ

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

function viewCustom() {
    var startDate = $('#startDateView').val();
    var endDate = $('#endDateView').val();
    if (startDate && endDate) {
        $.ajax({
            url: '/news_lv/events/view-events/custom', // URL API của bạn
            method: 'GET',
            data: {
                startDate: startDate,
                endDate: endDate
            },
            success: function(response) {
                // Giả sử response là một mảng dữ liệu như bạn đã cung cấp
                var data = response.map(item => parseInt(item.split(': ')[1]));
                var labels = response.map(item => item.split(': ')[0]);

                updateChartViewCustom(data, labels);
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }
}

function updateChartViewCustom(data, labels) {
    var ctx1 = document.getElementById("viewCustom").getContext("2d");

    // Kiểm tra và hủy biểu đồ cũ nếu tồn tại
    if (chartInstanceViewCustom) {
        chartInstanceViewCustom.destroy();
    }

    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');

    chartInstanceViewCustom = new Chart(ctx1, {
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

$(document).on('click', '#fetchCustomStats', function () {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    favoriteCustom(startDate, endDate);
})

$(document).on('click', '#fetchViewCustom', function () {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    viewCustom(startDate, endDate);
})

$(document).on('click', '#profileAdmin', function (e) {
    e.preventDefault();
    $('#content-container').load('/news_lv/page/profileAdmin', function(response, status, xhr) {
        var titlePage = $('.titlePage')
        titlePage.html('Thông tin');
        var titlePageHeading = $('.titlePage-heading')
        titlePageHeading.html('Thông tin tài khoản');

        var user = JSON.parse(sessionStorage.getItem('user'));
        var userNameSession = sessionStorage.getItem('userName');
        var fullNameSession = sessionStorage.getItem('fullName');
        var emailSession = sessionStorage.getItem('email');
        var dobSession = sessionStorage.getItem('dob');
        var phoneSession = sessionStorage.getItem('phone');
        var roleNameSession = sessionStorage.getItem('roleName');
        var avatarSession = sessionStorage.getItem('avatar');

        var avatarSrc = user && user.avatar ? user.avatar : (avatarSession ? avatarSession : defaultAvatarPath);

        var avatar = $('#avatar');
        var fullNameInput = $('#fullNameInput');
        var userName = $('#userName');
        var emailInput = $('#emailInput');
        var fullName = $('#fullName');
        var email = $('#email');
        var dob = $('#dob');
        var phoneNumber = $('#phoneNumber');
        var phoneNumberInput = $('#phoneNumberInput');
        var roleName = $('#roleName');

        if (user) {
            userName.val(user.userName);
            fullNameInput.val(user.fullName);
            emailInput.val(user.email);
            dob.val(user.dob);
            phoneNumberInput.val(user.phoneNumber);
            fullName.text(user.fullName);
            email.text(user.email);
            phoneNumber.text(user.phoneNumber);
            roleName.text(user.role.name);
            avatar.attr('src', user.avatar ? user.avatar : defaultAvatarPath);
        } else {
            userName.val(userNameSession);
            fullNameInput.val(fullNameSession);
            emailInput.val(emailSession);
            dob.val(dobSession);
            phoneNumberInput.val(phoneSession);
            fullName.text(fullNameSession);
            email.text(emailSession);
            phoneNumber.text(phoneSession);
            roleName.text(roleNameSession);
            avatar.attr('src', avatarSession ? avatarSession : defaultAvatarPath);
        }

        /*if (status == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        } else {
            console.log("Content loaded successfully");
            console.log(response);
        }*/
        const showPass = $('#showPass');
        const password = $('#password');
        const passwordPrevious = $('#passwordPrevious');

        showPass.on('change', function() {
            if (showPass.is(':checked')) {
                password.attr('type', 'text');
                passwordPrevious.attr('type', 'text');
            } else {
                password.attr('type', 'password');
                passwordPrevious.attr('type', 'password');
            }
        });
    });
});

$('#logoutButton').on('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định

    /*sessionStorage.removeItem('userLogin');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('currentNewsId');

    // Xóa local storage
    sessionStorage.clear();

    localStorage.clear();

    // Đánh dấu trạng thái logout trong sessionStorage
    sessionStorage.setItem('isLoggedOut', 'true');

    // Redirect tới trang logout kèm theo URL hiện tại dưới dạng query parameter
    window.location.href = '/news_lv/page/home';*/
    $.ajax({
        url: '/news_lv/page/logout',
        method: 'GET',
        success: function(response) {
            // Xóa sessionStorage
            sessionStorage.removeItem('userLogin');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('currentNewsId');
            sessionStorage.clear();

            // Xóa localStorage
            localStorage.clear();

            // Đánh dấu trạng thái logout trong sessionStorage
            sessionStorage.setItem('isLoggedOut', 'true');

            // Ẩn nút login
            $('#login-btn').hide();

            // Redirect tới trang logout kèm theo URL hiện tại dưới dạng query parameter
            window.location.href = '/news_lv/page/home';
        },
        error: function(xhr, status, error) {
            console.error("Error during logout:", error);
        }
    });
    // $('#login-btn').hide();
});

// Hàm toggleChart để ẩn/hiện biểu đồ khi checkbox thay đổi
/*
function toggleChart(checkbox, chart) {
    checkbox.change(function() {
        if (checkbox.is(':checked')) {
            chart.css('display', 'block');
            console.log('Show chart');
        } else {
            chart.css('display', 'none');
            console.log('Hide chart');
        }
    });
}

// Gọi hàm toggleChart cho các checkbox và biểu đồ tương ứng
toggleChart($('#favoriteYearCheckbox'), chartFavoriteYear);
toggleChart($('#favoriteMonthCheckbox'), chartFavoriteMonth);
toggleChart($('#favorite7DaysCheckbox'), chartFavorite7LastDay);
toggleChart($('#viewYearCheckbox'), chartViewYear);
toggleChart($('#viewMonthCheckbox'), chartViewMonth);
toggleChart($('#view7DaysCheckbox'), chartView7LastDay);
toggleChart($('#favoriteCustomCheckbox'), chartFavoriteCustom);
toggleChart($('#viewCustomCheckbox'), chartViewCustom);*/
