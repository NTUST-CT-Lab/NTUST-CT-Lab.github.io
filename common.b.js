// Waiting for the DOM to be ready
$(document).ready(function() {
    $(".include").each(function() {
        if (!!$(this).attr("include")) {
            var $includeObj = $(this);
            $(this).load($(this).attr("include"), function(html) {
                $includeObj.after(html).remove(); // remove the include tag
            })
        }
    });
});
