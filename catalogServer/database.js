// databse.js // our database

export const data = [
  {
    id: 1,
    title: "How to get a good grade in DOS in 40 minutes a day",
    topic: "distributed systems",
    price: 2000,
    quantity: 4,
  },
  {
    id: 2,
    title: "RPCs for Noobs",
    topic: "distributed systems",
    price: 60,
    quantity: 6,
  },
  {
    id: 3,
    title: "Xen and the Art of Surviving Undergraduate School",
    topic: "undergraduate school",
    price: 40,
    quantity: 8,
  },
  {
    id: 4,
    title: "Cooking for the Impatient Undergrad",
    topic: "undergraduate school",
    price: 15,
    quantity: 30,
  },
];

/////functions to handle database queries////
export function getBooksByTopic(topic) {
  return data.filter(
    (book) => book.topic.toLowerCase() === topic.toLowerCase()
  ); //case insensitive
}

export function getBookInfo(id) {
  return data.find((book) => book.id === Number(id)); // convert id to a number
}
