// CLIENT SIDE JAVASCRIPT FETCHING

//const fetch = require("node-fetch");
const url = "https://http-challenge.whitehatcoaches.org.uk"

//FIRST REQUEST (default method is GET) --------------
// fetch( url, {options} )
fetch(url)
  .then((res) => res.text())
  .then((msg) => console.log(msg))
  .catch(console.error)
  .then(() => {
    //SECOND REQUEST --------------
    fetch(url + "/apprentices", {
        method: "POST",
        // Content-Type of the header is required for the browser to know how to decode the Body
        headers: {
          'Content-Type': 'application/json'
        },
        // We pass information in the body
        body: JSON.stringify({ name: "Sarah" })
      })
      .then((res) => res.text())
      .then((msg) => {
        const [yourId] = msg.match(/(?<=\/)[a-zA-Z0-9]+(?=')/)
        console.log(yourId, msg)
        return yourId
      })
      .then((yourId) => {
        //THIRD REQUEST --------------
        fetch(url + "/apprentices/" + yourId, {
            method: "GET"
          })
          .then((res) => res.text())
          .then((msg) => {
            console.log(msg)
          })
        return yourId
      })
      .then((yourId) => {
        //FOURTH REQUEST --------------
        fetch(url + "/apprentices/" + yourId, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            // the body needs to be in a query string format for x-www-form-urlencoded
            body: "guests=Josie,Dawid,Isabella" 
          })
          .then((res) => res.text())
          .then((msg) => {
            console.log(msg)
          })
        return yourId
      })
      .then((yourId) => {
        //FIFTH REQUEST --------------
        fetch(url + "/apprentices/" + yourId + "/menus?starter=Soup&main=Roast&dessert=Cake", {
            method: "GET",
          })
          .then((res) => res.text())
          .then((msg) => {
            console.log(msg)
          })
      })

  })
