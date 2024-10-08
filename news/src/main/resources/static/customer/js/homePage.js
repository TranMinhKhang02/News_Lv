// home.js
(function ($) {
    "use strict";

    $(document).ready(function () {
        // Fetch and render categories
        fetchCategories();
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
                <img class="img-fluid w-100" src="${news.thumbnail}" style="object-fit: cover;">
                <div class="overlay position-relative bg-light">
                    <div class="mb-2" style="font-size: 13px;">
                        <a href="">${news.categories[0].name}</a>
                        <span class="px-1">/</span>
                        <span>${new Date(news.modifiedDate).toLocaleDateString()}</span>
                    </div>
                    <a class="h4 m-0 title-news" href="/news_lv/page/single?newsId=${news.id}">${news.title}</a>
<!--                    <a class="h4 m-0 title-news" href="">${news.title}</a>-->
                </div>
            </div>
        `;
    }


    // =================================CAROUSEL================================

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
})(jQuery);