$(document).ready(function() {
  $(".example").DataTable();

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
          $($(self).parents(".col-auto")).fadeOut(1000);
          // location.reload();
          window.location.href =
            "http://localhost/details-member/" + $(".clientID").text();
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

  // validating form
  (function() {
    "use strict";
    window.addEventListener(
      "load",
      function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName("needs-validation");
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener(
            "submit",
            function(event) {
              if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
              }
              form.classList.add("was-validated");
            },
            false
          );
        });
      },
      false
    );
  })();

  // datepicker
  $(function() {
    var from = $("#membershipStartingDate")
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 2,
          // minDate: new Date(),
          dateFormat: "yy-mm-dd"
        })
        .on("change", function() {
          to.datepicker("option", "minDate", getDate(this));
        }),
      to = $("#membershipExpiryDate")
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 2,
          dateFormat: "yy-mm-dd"
        })
        .on("change", function() {
          from.datepicker("option", "maxDate", getDate(this));
        });

    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate("yy-mm-dd", element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  });
});

// spinner loading
$(window).on("load", function() {
  // Spinner Loading
  $(".spinner-loading").fadeOut(function() {
    $(this).remove();
  });
});
