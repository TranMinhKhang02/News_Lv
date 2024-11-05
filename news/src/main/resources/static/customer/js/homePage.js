// home.js
(function ($) {
    "use strict";

    $(document).ready(function () {
        // Fetch and render categories
        fetchCategories();
        fetchNewsByCreatedDate()
        fetchNewsByView()
        fetchNewsByLikes()
    });

    // Fetch categories
    function fetchCategories() {
        $.ajax({
            url: '/news_lv/category',
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && Array.isArray(response.result)) {
                    renderCategories(response.result);
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
            error: function(error) {
                console.error('Error fetching categories:', error);
            }
        });
    }

    // Render categories
    function renderCategories(categories) {
        var container = $('#specific-container .row');
        categories.forEach(function(category) {
            var categoryHtml = createCategoryHtml(category);
            container.append(categoryHtml);
            fetchNewsByCategory(category.code, `#${category.code}-news`);
        });
    }

    // Create category HTML
    function createCategoryHtml(category) {
        return `
            <div class="col-lg-6 py-3">
                <div class="bg-light py-2 px-4 mb-3">
                    <h3 class="m-0" data-category-code="${category.code}">${category.name}</h3>
                </div>
                <div class="owl-carousel owl-carousel-3 carousel-item-2 position-relative" id="${category.code}-news">
                    <!-- News items will be dynamically added here -->
                </div>
            </div>
        `;
    }

    //Fetch news by createdDate
    function fetchNewsByCreatedDate() {
        let latestNewsContainer = $('#latest-news-carousel');
        latestNewsContainer.empty();
        $.ajax({
            url: '/news_lv/news/top10ByCreatedDate',
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && Array.isArray(response.result)) {
                    response.result.forEach(function(news) {
                        var newsItem = renderNewsByCreatedDate(news);
                        latestNewsContainer.append(newsItem);
                    });
                    initializeCarousel4Item(latestNewsContainer)
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
        })
    }

    function renderNewsByCreatedDate(news) {
        return `
            <div class="position-relative overflow-hidden" style="height: 300px;">
                <img class="img-fluid w-100 h-100" src="${news.thumbnail}" style="object-fit: cover;">
                <div class="overlay">
                    <div class="mb-1" style="font-size: 13px;">
                        <a class="text-white" href="">${news.categories[0].name}</a>
                        <span class="px-1 text-white">/</span>
                        <a class="text-white" href="">${new Date(news.createdDate).toLocaleDateString()}</a>
                    </div>
                    <a class="h4 m-0 text-white title-news-4item" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
                </div>
            </div>
        `;
    }

    function fetchNewsByView() {
        let mostViewNewsContainer = $('#views-news-carousel');
        mostViewNewsContainer.empty();
        $.ajax({
            url: '/news_lv/news/top5ByViewCount',
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && Array.isArray(response.result)) {
                    response.result.forEach(function(news) {
                        var newsItem = renderNewsByViews(news);
                        mostViewNewsContainer.append(newsItem);
                    });
                    initializeCarousel1Item(mostViewNewsContainer)
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
        })
    }

    function renderNewsByViews(news) {
        return `
            <div class="position-relative overflow-hidden" style="height: 435px;">
                <img class="img-fluid h-100" src="${news.thumbnail}" style="object-fit: cover;">
                <div class="overlay">
                    <div class="mb-1">
                        <a class="text-white" href="">${news.categories[0].name}</a>
                        <span class="px-2 text-white">/</span>
                        <a class="text-white" href="">${new Date(news.createdDate).toLocaleDateString()}</a>
                    </div>
                    <a class="h2 m-0 text-white font-weight-bold" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
                </div>
            </div>
        `;
    }

    function fetchNewsByLikes() {
        let mostLikeNewsContainer = $('#likes-news-carousel');
        mostLikeNewsContainer.empty();
        $.ajax({
            url: '/news_lv/news/top5ByLikeCount',
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && Array.isArray(response.result)) {
                    response.result.forEach(function(news) {
                        var newsItem = renderNewsByLikes(news);
                        mostLikeNewsContainer.append(newsItem);
                    });
                    initializeCarousel3Item(mostLikeNewsContainer)
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
        })
    }

    function renderNewsByLikes(news) {
        return `
            <div class="d-flex">
                <img src="${news.thumbnail}" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="d-flex align-items-center bg-light px-3" style="height: 80px;">
                    <a class="text-secondary font-weight-semi-bold" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
                </div>
            </div>
        `;
    }

    // Fetch news by category
    function fetchNewsByCategory(categoryCode, elementId) {
        $.ajax({
            url: '/news_lv/news/by-category?category=' + categoryCode,
            method: 'GET',
            success: function(response) {
                if (response.code === 1000 && Array.isArray(response.result)) {
                    renderNews(response.result, elementId);
                    initializeCarousel(elementId); // Initialize carousel
                } else {
                    console.error('Expected an array but got:', response.result);
                }
            },
            error: function(error) {
                console.error('Error fetching news:', error);
            }
        });
    }

    // Render news
    function renderNews(data, elementId) {
        var newsContainer = $(elementId);
        newsContainer.empty(); // Clear existing content
        if (Array.isArray(data)) {
            data.forEach(function(news) {
                var newsItem = createNewsItem(news);
                newsContainer.append(newsItem);
            });
        } else {
            console.error('Expected an array but got:', data);
        }
    }

    // Create news item
    function createNewsItem(news) {
        return `
            <div class="position-relative">
                <img class="img-fluid-custom w-100" src="${news.thumbnail}" style="object-fit: cover;">
                <div class="overlay position-relative bg-light">
                    <div class="mb-2" style="font-size: 13px;">
                        <a href="">${news.categories[0].name}</a>
                        <span class="px-1">/</span>
                        <span>${new Date(news.modifiedDate).toLocaleDateString()}</span>
                    </div>
                    <a class="h4 m-0 title-news" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
                </div>
            </div>
        `;
    }

    $('.saveNews').on('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
        getFavorite(1, 5); // Gọi hàm getFavorite với trang 1 và kích thước 5
        window.location.href = $(this).attr('href'); // Chuyển hướng đến trang myInfo
    });


    // =================================CAROUSEL================================


    function initializeCarousel1Item(elementId) {
        $(elementId).owlCarousel('destroy'); // Destroy existing carousel
        $(elementId).owlCarousel({
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
    }

    function initializeCarousel3Item(elementId) {
        elementId.owlCarousel('destroy');
        $(elementId).owlCarousel({
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
    }
    // Initialize carousel
    function initializeCarousel(elementId) {
        $(elementId).owlCarousel('destroy'); // Destroy existing carousel
        $(elementId).owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            margin: 30,
            nav : true,
            dots: false,
            loop: true,
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
    }

    function initializeCarousel4Item(elementId) {
        $(elementId).owlCarousel('destroy'); // Destroy existing carousel
        $(elementId).owlCarousel({
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
    }
})(jQuery);