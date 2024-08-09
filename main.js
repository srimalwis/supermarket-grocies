// Adding a event listener to execute the function inside it after the HTML page is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = JSON.parse(localStorage.getItem("orderDet")) || {};// retrive previous orderDetails from the localStorage or it will create a empty object
    console.log(orderDetails);
    let BillId = orderDetails.BillId || 0;  // Getting the billId from the orderDetails. Defualt value is 0.
    //selecting the add to favourtie and apply favourite buttons by their id.
    const addToFav = document.getElementById('Add-to-fav-btn');
    const applyFav = document.getElementById('apply-fav-btn');
    //Defining a object of prices containing the respective product/item names and their prices.
    const prices = {
        carrot: 450.0,
        potato: 200.0,
        onion: 200.0,
        leeks: 350.0,
        cabbage: 250.0,
        cucumber: 200.0,
        apple: 900.0,
        banana: 300.0,
        orange: 500.0,
        mango: 400.0,
        papaya: 350.0,
        grapes: 300.0,
        milk: 1100.0,
        oatMilk: 600.0,
        butter: 350.0,
        yogurt: 80.0,
        iceCream: 1100.0,
        sustagen: 750.0,
        sugar: 1000.0,
        bakingPowder: 500.0,
        OliveOil: 900.0,
        salt: 500.0,
        vanillaExtract: 450.0,
        flour: 800.0,
        chickenBreast: 1200.0,
        beef: 1900.0,
        pork: 1300.0,
        fish: 2000.0,
        salmon: 200.0,
        sailfish: 2000.0,
        bacon: 1900.0
    };
    const order = document.getElementById("order-Now-btn");//selecting the order now button using its id.
    let cart = {};// initializing an empty object called cart
    const inputs = document.querySelectorAll('input[type="number"]');//selecting the all the inputfields with the type number.
    const tableEntry = document.querySelector('#cart-details tbody');//select the table tbody where the cart product details will apear
    let itemsTotal = 0;// initialize itemsToal to 0.
    // If order  button exists, when it get clicked by the user, a function to get the user inputs and execute operations related to them.
    if (order) {
        order.addEventListener("click", function () {
            tableEntry.innerHTML = '';// clears the current table entries
            // Itetrating the all the inputs one by one to get its name and the quantity
            inputs.forEach((input) => {
                const item = input.name;// retrive the name of the inputfield
                const Quantity = parseInt(input.value) || 0;// get the quantity value entered by the user. if it's not exists, it will pass the defualt value of the quantity to 0.
                // If Quantity is greater than 0, the details of the product, quantity and price are added to the cart object.
                if (Quantity > 0) {
                    const price = prices[item];
                    itemsTotal += (price * Quantity)
                    cart[item] = {
                        name: item,
                        quantity: Quantity,
                        itemPrice: price,
                        total: Quantity * price
                    };
                }
            });
            cart["bill"] = itemsTotal;// added new property bill to the cart object.
            cartDetailsInfo(cart, tableEntry);//calls cartDetails info function to update the cart table.
            localStorage.setItem("cart", JSON.stringify(cart));// saving the cart in localStorage.
        });
    }
    //function to add items in the cart to favourite
    function addToFavourite() {
        localStorage.setItem("fav", JSON.stringify(cart));// Saving the current cart in the localStorage as fav.
    }
    //function to apply the items intp the cart using favourite items (fav).
    function applyFavourite() {
        tableEntry.innerHTML = '';// clears the cart table
        cart = JSON.parse(localStorage.getItem("fav"));// retrieve the saved cart form the localStorage.
        cartDetailsInfo(cart, tableEntry);// calling the function carDetailsInfo to update the cart table.
        itemsTotal = cart["bill"];//set itemsToal to the value of the bill in the cart object
    }
    // adding a eventlistener to the add to favourite and apply favourite if they exists
    if (addToFav) {
        addToFav.addEventListener("click", addToFavourite); //when the add to favourite button is clicked, the function addToFavourite is called.
    }

    if (applyFav) {
        applyFav.addEventListener('click', applyFavourite);// calling the function applyFavourite whe the apply favourite button is clicked.
    }

    //payment // page //
    //function to update the cart details table using cart object and cart table destination as its parameters.
    function cartDetailsInfo(cartDet, cartTable) {
        let totalOrderBill = document.getElementById('total-order-bill');// select the element by its id 'tootal-order-bill'.

        //iterating over the cart items
        for (let key in cartDet) {
            if (cartDet.hasOwnProperty(key)) {
                //excluding the key bill in order to filter only the products
                if (key !== "bill") {
                    const row = document.createElement('tr');//creating a table row element .
                    //defining the table data inside the row element.
                    row.innerHTML = `<td>${cartDet[key].name}</td>
                                     <td>${cartDet[key].quantity}</td>
                                     <td>${cartDet[key].total}</td>`;
                    cartTable.appendChild(row);// appends row to the table
                }
            }
        }
        totalOrderBill.innerText = `Rs.${cartDet["bill"].toFixed(2)} `;// updates the text inside span elemnt to the toal of the order bill.
    }
    const payButtonElement = document.getElementById('pay-btn');// select the pay button element.
    //if the pay button is exists, adding a eventlistener to it,so that when it's get clicked, it will redirect the user to the payment page.
    if (payButtonElement) {
        payButtonElement.addEventListener("click", function () {
            window.location.href = "pay-order.html";
        });
    }
    const orderDetailsTable = document.getElementById('order-details');// select the order details table in the payment page.
    //If the orderDetailsTable exists, it retrieve cart from the local storage and updates the cart details.
    if (orderDetailsTable) {
        let totalOrderBill;
        totalOrderBill = document.getElementById('total-order-bill');// selecting the element to output the total.
        const cartTable2 = document.querySelector('#order-details tbody');// selecting the table body
        cart = JSON.parse(localStorage.getItem("cart"));// retrive the cart from the localStorage.
        cartDetailsInfo(cart, cartTable2);// calling the function with the relavent parameters provided.

    }
    const confirmOderBtn = document.getElementById('checkout-btn');//selecting the pay button element.
    const changeOrderBtn = document.getElementById('Go-to-order-Page-btn');// selecting the change order  button element.
    const deliveryDetails = {};// initializing an empty object to save delivery details.
    const paymentDetails = {};//initializing an empty object to save payment details
    //if the pay button exists, adding a event listener to it.
    if (confirmOderBtn) {
        confirmOderBtn.addEventListener("click", confirmOrder);// when the pay button is clicked, it will call the function confrimOrder.
    }
    //defining a function to retirieve and save the information details in the inputfields. Then, if all the details are provided and correct, a confirmation message including delivery date and order id is provided.
    function confirmOrder() {
        //getting the user inputs reguarding customer details.
        const customerName = document.getElementById('dd-name').value;
        const customerAddress = document.getElementById('dd-address').value;
        const deliveredCity = document.getElementById('dd-city').value;
        const phoneNumber = document.getElementById('dd-ph-number').value;
        //card details
        //getting the user inputs reguarding payment details.
        const cardHolderName = document.getElementById('ch-name').value;
        const cardNumber = document.getElementById('ch-number').value;
        const postalCode = parseInt(document.getElementById('postal-code').value);
        const CVCNumber = parseInt(document.getElementById('CVC-number').value);
        //selecting the elemnts to output the confirmation message reguarding the payment and order.
        const orderSec = document.getElementById('order-sec');
        const confirmMessage = document.getElementById('confirm-message');
        const orderId = document.getElementById('order-id-spn');
        const deliveryDate = document.getElementById('delivery-date-spn');
        const orderConfirmedDetails = document.getElementById('order-confirm-details');

        //getting the current date and adding 2 to get the delivery date, which is two days after the current date.
        let currentDate = new Date();
        console.log(currentDate)
        currentDate.setDate(currentDate.getDate() + 2);
        //customizing the date to a readable format.
        let customDate = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        //if all the input fields are filed, the details will get updated to the local storage
        if (customerName && customerAddress && deliveredCity && phoneNumber && cardHolderName && cardNumber && postalCode && CVCNumber) {
            //getting the delivery details inputs to the deliveryDetails object
            deliveryDetails['customerName'] = customerName;
            deliveryDetails['customerAddress'] = customerAddress;
            deliveryDetails['deliveredCity'] = deliveredCity;
            deliveryDetails['phoneNumber'] = phoneNumber;
            //getting card details inputs into the payment Details object
            paymentDetails['cardHolderName'] = cardHolderName;
            paymentDetails['cardNumber'] = cardNumber;
            paymentDetails['postalCode'] = postalCode;
            paymentDetails['CVCNumber'] = CVCNumber;

            //saving the customerdetails and payment details seperately in the localSotrage.
            localStorage.setItem("deliveryDetails", JSON.stringify(deliveryDetails));
            localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));
            //hiding the orderSec which included the delivery details and payment details form.
            orderSec.style.display = "none";
            //displaying the confirmation message, which includes the delivery date and the order ID.
            confirmMessage.style.display = "block";
            confirmOderBtn.style.display = "none";
            changeOrderBtn.style.display = "none";
            //adding one to the BillId, so that every billID is different.
            BillId++;
            orderId.innerText = BillId;// displaying the billID
            const DateOfDelivery = currentDate.toLocaleDateString(undefined, customDate);
            deliveryDate.innerText = DateOfDelivery; //displaying the diliveryDate.
            orderConfirmedDetails.innerText = "Order Details";// changing the cart table heading


            orderDetails['BillId'] = BillId;//saving the new BillId into the orderDetails object
            orderDetails['DateOfDelivery'] = DateOfDelivery;// saving the new delivery date into the orderDetails object.
            localStorage.setItem("orderDet", JSON.stringify(orderDetails));// updating the localStorage data.

        }
    }
    const goBackToCart = document.getElementById('Go-to-order-Page-btn');//selecting the change order button by its id.
    if (goBackToCart) {
        //If goBackToCart(change order) exists; adding a eventlistener to that button.
        goBackToCart.addEventListener("click", function () {
            //when the button is get clicked, it will redirect the user back to the order page, where we can order/ change products in the cart.
            console.log("button clicked");
            window.location.href = "Order_page.html";
        });
    }

});
