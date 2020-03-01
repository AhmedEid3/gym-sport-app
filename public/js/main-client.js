$(document).ready(function() {
  $(".example").DataTable();
});

$(document).ready(function() {
  $("a.back").click(function() {
    parent.history.back();
    return false;
  });

  // remaining session
  $(".custom-control-input").on("click", function() {
    const self = this;
    if ($(".custom-control-input").is(":checked")) {
      $.post(
        "/remain-session/",
        {
          trainNumber: 1,
          clientId: $(".clientID").text()
        },
        function(data, status) {
          const date = new Date(data);
          $($(self).siblings(".custom-control-label")).text(
            date.toLocaleString() + " +1"
          );
          console.log(1);
        }
      );
    }
    // else {
    //   $.post(
    //     "/remain-session/",
    //     {
    //       trainNumber: -1,
    //       clientId: $(".clientID").text()
    //     },
    //     function(data, status) {
    //       const date = new Date(data);
    //       $($(self).siblings(".custom-control-label")).text(
    //         date.toLocaleString() + " -1"
    //       );
    //       console.log(-1);
    //     }
    //   );
    // }
  });
});
