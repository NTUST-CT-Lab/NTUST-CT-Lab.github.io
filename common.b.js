// Waiting for the DOM to be ready
$(document).ready(function() {
    loadContentWithoutTag(() => {
        app.mount('#app');
    });
});
