function showLoading() {
    console.log('showLoading');
    $('#loading-overlay').removeClass('d-none');
    $('#loading').removeClass('d-none');
}

function hideLoading() {
    console.log('hideLoading');
    $('#loading-overlay').addClass('d-none');
    $('#loading').addClass('d-none');
}