<<<<<<< HEAD
// catalogServer.js

// our database
=======
// databse.js // our database

>>>>>>> 46d724d (requests tested on postman)
export const data = [
  {
    id: 1,
    title: "How to get a good grade in DOS in 40 minutes a day",
    topic: "distributed systems",
    price: 40,
    quantity: 10,
  },
  {
    id: 2,
    title: "RPCs for Noobs",
    topic: "distributed systems",
    price: 50,
    quantity: 5,
  },
  {
    id: 3,
    title: "Xen and the Art of Surviving Undergraduate School",
    topic: "undergraduate school",
    price: 35,
    quantity: 8,
  },
  {
    id: 4,
    title: "Cooking for the Impatient Undergrad",
    topic: "undergraduate school",
    price: 20,
    quantity: 15,
  },
];

/////functions to handle database queries////

export function getBooksByTopic(topic) {
<<<<<<< HEAD
  return catalog.filter(
    (book) => book.topic.toLowerCase() === topic.toLowerCase()
  ); //case insensitive
}
export function getBookInfo(id) {
  return catalog.find((book) => book.id === Number(id)); // Convert id to a number
=======
  return data.filter(
    (book) => book.topic.toLowerCase() === topic.toLowerCase() //case insensitive
  ); 
}

export function getBookInfo(id) {
  return data.find((book) => book.id === Number(id)); // convert id to a number
>>>>>>> 46d724d (requests tested on postman)
}
