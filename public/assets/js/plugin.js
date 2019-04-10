/*jshint esversion: 6 */
//In All Pages
$(window).ready(function() {
  // Get the current year for the copyright
  $("#year").text(new Date().getFullYear());

  //the side navbar

  $(".side-navbar i").click(function() {
    $(".side-navbar").toggleClass("ihidden");
    if ($(".side-navbar").hasClass("ihidden")) {
      $("body").animate(
        {
          "margin-left": $(".side-navbar").innerWidth()
        },
        1000
      );
      $(".side-navbar").animate(
        {
          left: 0
        },
        1000
      );
      // $(".side-navbar i").toggleClass("fa-bars , fa-times");
    } else {
      $(".side-navbar").animate(
        {
          left: -$(".side-navbar").outerWidth()
        },
        1000
      );
      $("body").animate(
        {
          "margin-left": 0
        },
        1000
      );
      // $(".side-navbar i").toggleClass("fa-times,fa-bars");
    }
  });
  // in orders  page
  var cancelButtons = $("table tr td a.btn-danger");
  // console.log(cancelButtons);
  $(cancelButtons).on("click", function() {
    $(this)
      .parent()
      .parent()
      .remove();
  });

  // the toggle of customer info part in customers page 
  $("#all-customers .container table tr td a").on("click", function() {
    $("#cust-info .container")
      .slideToggle(1000);
  });

  // the toggle of Admin info part in 
  $("#admin-info .edit").click( function(){
    $("#admin-info .edit-form").slideToggle(1000);
  });


  //Trying for Ajax request
  // Create a request variable and assign a new XMLHttpRequest object to it.
  // var request = new XMLHttpRequest();

  // // Open a new connection, using the GET request on the URL endpoint
  // request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);

  // request.onload = function () {

  //   const app = document.getElementById('table');

  //   // Begin accessing JSON data here
  //   var data = JSON.parse(this.response);

  //   if (request.status >= 200 && request.status < 400) {
  //     data.forEach(movie => {
  //       const name = document.getElementById("name");
  //       name.textContent = movie.title;
  //       const price = document.getElementById("price");
  //       price.textContent = movie.rt_score;

  //       console.log(movie.title);
  //     });
  //   } else {
  //     console.log('error');
  //   }
  // };


  
  // request.send();



});




