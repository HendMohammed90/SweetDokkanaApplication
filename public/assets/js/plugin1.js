/*jshint esversion: 6 */

//In All Pages
$(window).ready(function() {
  //the hover effect on li
  $(".my-nav .navbar-nav li a").append("<span></span>");
  $(".my-nav .navbar-nav li a").hover(
    function() {
      $(this)
        .find("span")
        .eq(0)
        .animate(
          {
            width: "100%",
            left: 0
          },
          300
        );
    },
    function() {
      $(this)
        .find("span")
        .eq(0)
        .animate(
          {
            width: 0,
            left: "50%"
          },
          300
        );
    }
  );

  //show cart
				
  (function (){ 
    var cartInfo=$('#cart-info'),
      cart=$('#cart');
    
    cartInfo.on('click',function(){
      cart.toggleClass('show-cart');	
    });
  
  })();
  
  //by java script
  // (function(){
  //   var cartInfo =document.getElementById('cart-info'),
  //       cart = document.getElementById('cart');
  //   cartInfo.addEventListener('click',function(){
  //     cart.classList.toggle('show-cart');
  //   });
  // })();

  	
  //add items to the cart
  (function (){ 
    var cartBtn=$('.store-item-icon');
    cartBtn.each(function(index,btn){
      
      $(btn).click(function(event){
        // console.log($(event.target));
        
        if($(event.target).parent().hasClass('store-item-icon')){
          var fullpath=$(event.target).parent().prev().attr('src'),
          item={},
          name=$(event.target).parents('.img-container').next().children().children().eq(0).text(),price=$(event.target).parents('.img-container').next().children().children().eq(1).text().slice(1).trim(),
          total=$('.cart-total-container');
          item.img=fullpath;
          item.name=name;
          item.price=price;
          // console.log(price);
          
          var carItem=$('<div>/</div>');
          
          carItem.addClass('cart-item d-flex justify-content-between my-3');
          carItem.html('<img src='+item.img+' class="img-fluid rounded-circle" id="item-img" alt=""><div class="item-text"><p id="cart-item-title" class="font-weight-bold mb-0">'+item.name+'</p><span>$ </span><span id="cart-item-price" class="cart-item-price" class="mb-0">'+item.price);
          
          
          carItem.insertBefore(total);

          alert('Item added to the cart');

          showTotals();
        } //end if
        
      }); //end click event
      
    }); //end each function
    
    //show Totals
    function showTotals(){
      var total=[],
        items=$('.cart-item-price'),
        totalMony,
        sumMony;
      
      items.each(function(index,item){
        total.push(parseFloat($(item).text()));
        
      });// end each function
      
      // console.log(total);
      
      totalMony=total.reduce(function(sum,ele){
        sum+=ele;
        return sum;
      });//end reduce callback function
      
      sumMony=totalMony.toFixed(2);
      // console.log(sumMony);
      
      $('#cart-total').text(sumMony);
      $('#item-count').text(total.length);
      $('.item-total').text(sumMony);
    } //end show Totals

    
  })();


  //dalet items from the cart
  (function(){

    var clearbutton = $(".navbar #cart .cart-buttons-container #clear-cart");
    clearbutton.on("click",function(event){
      event.preventDefault();
      // console.log(clearbutton);
      if(clearbutton.parent().hasClass('cart-buttons-container')){
        var item = [];
        item = $(event.target).parent().parent().find('.cart-item');
        // console.log(item);
        for (var i=0;i<item.length ; i++){
            item[i].remove();
            console.log("The items has been deleted "+ item[i]);
        }
        countTotal();
      }
    });

    //show countTotal
    function countTotal(){
      var total=[];

      $('#cart-total').text(total.length);
      $('#item-count').text(total.length);
      $('.item-total').text(total.length);
    } //end show countTotal


  })();
  
  
  
  //the smoth scrolling of the scroll button on header
  $("#slider .carousel-inner .carousel-item .carousel-caption button").on(
    "click",
    function() {
      $("html,body").animate(
        {
          scrollTop: $($(this).data("scroll")).offset().top
        },
        1500,
        "linear"
      );
    }
  );
  $("header .overlay .container button").on("click", function() {
    $("html,body").animate(
      {
        scrollTop: $($(this).data("scroll")).offset().top
      },
      1500,
      "linear"
    );
  });

  // the scroll-to-up button

  var scrolltoTop = $("#scroll-to-top");
  $(window).scroll(function() {
    // console.log($(window).scrollTop());
    var topPart = $(".topPart").offset().top;
    // console.log(topPart);
    const newLocal = 7000;
    var topValue = $(this).scrollTop();
    if (topValue >= topPart && topValue < newLocal) {
      if (scrolltoTop.is(":hidden")) {
        scrolltoTop.fadeIn("slow");
      }
    } else {
      scrolltoTop.fadeOut("slow");
    }
  });
  //click on scroll-to-top to go UP
  scrolltoTop.click(function(e) {
    e.preventDefault();
    $("html,body").animate(
      {
        scrollTop: "0"
      },
      1500
    );
  });

  
  //the popup section
  $(".popupbutton").click(function() {
    $($(this).data("show")).fadeIn();
  });
  $(".popup").click(function() {
    $(this).fadeOut();
  });
  $(".popup .inner").click(function(e) {
    e.stopPropagation();
  });
  $(".popup i").click(function() {
    $(this)
      .parentsUntil("body")
      .fadeOut();
  });
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $(".popup").fadeOut();
    }
  });

  //the buttons effect
  $(".mybutton").prepend("<span></span>");
  $(".mybutton").hover(
    function() {
      $(this)
        .find("span")
        .eq(0)
        .animate(
          {
            width: "100%",
            left: 0
          },
          300
        );
    },
    function() {
      $(this)
        .find("span")
        .eq(0)
        .animate(
          {
            width: 0,
            left: "50%"
          },
          300
        );
    }
  );

  //the gallery part
  // $(window).ready(function() {
  //   $("#gallery .navbar li:nth-child(1)").on("click", function() {
  //     $("#gallery .img-gallary").fadeTo("slow", 1);
  //   });
  //   $("#gallery .navbar li:nth-child(2)").on("click", function() {
  //     $("#gallery img.oriental")
  //       .fadeTo("slow", 1)
  //       .parent()
  //       .siblings("div")
  //       .not(".oriental")
  //       .css("display", "none");
  //   });
  //   $("#gallery .navbar li:nth-child(3)").on("click", function() {
  //     $("#gallery img.western")
  //       .fadeTo("slow", 1)
  //       .parent()
  //       .siblings("div")
  //       .not(".oriental")
  //       .css("display", "none");
  //   });
  // });

  //Filter btns
  (function (){ 
    var filterBtn=$('.filter-btn');
    
    filterBtn.each(function(index,btn){
      
      $(btn).click(function(evt){
        evt.preventDefault();
        const value=$(evt.target).attr('data-filter'),
            items=$('.store-item');
        
        items.each(function(index,item){
          
          if(value=='all'){
            $(item).show('slow');
          } else {
            
            if($(item).hasClass(value)){
              $(item).show('slow');
            }
            else{
              $(item).hide('slow');
            }	
          }
        });
          
      });
      
    });
    
  })();
  
  //Search input
  (function (){ 
    const search=$('#search-item');
    
    search.keyup(function(){
      
      var value=search.val().toLowerCase().trim(),
        items=$('.store-item');
      
      items.each(function(index,item){
        
        var type=$(item).attr('data-item'),
          length=value.length,
          match=type.slice(0,length);
           console.log(type);
           console.log(length);
           console.log(match);
        
        if(value==match){
          $(item).show('slow');
        }
        else{
          $(item).hide();
        }
        
        // if(type.includes(value)){
        //   $(item).show('slow');
        // }
        // else{
        //   $(item).hide();
        // }
      });
      
      
    });
    
  })();

  // Get the current year for the copyright
  $("#year").text(new Date().getFullYear());

  // this script for the bootstrap slider
  $(".carousel").carousel({
    interval: 10000,
    keyboard: true,
    pause: "hover",
    wrap: true,
    ride: false
  });
});

//In Products Page
$(window).ready(function() {
  // $("#menu .menu-part ul li .price i").append("<span></span>");
});
// the toggle of review part in productDescription page
$(window).ready(function() {
  $("#Description .container .col-12 button").on("click", function() {
    $(this)
      .find("i")
      .toggleClass("fa-plus , fa-minus");
    $(this)
      .next("form")
      .slideToggle(1000);
  });
});

// in Shopping Cart page
$(window).ready(function() {
  var cancelButtons = $("table tr td a");
  // console.log(cancelButtons);
  $(cancelButtons).on("click", function() {
    $(this)
      .parent()
      .parent()
      .remove();
  });
});
