// data/faqs.ts

export interface Faq {
  question: string;
  answer: string;
}

export const allFaqs: Faq[] = [
  {
    question: "What is your return and exchange policy?",
    answer: "We maintain a strict no-return and no-exchange policy. Products, once sold, are not eligible for return or replacement for any reason, including change of mind or wrong selection."
  },
  {
    question: "Can I cancel or change my order after placing it?",
    answer: "No. Once an order has been placed and confirmed, it cannot be cancelled, modified, or changed under any circumstances."
  },
  {
    question: "How long will it take to receive my order?",
    answer: "Orders are typically shipped within 8-14 days. We hand over the shipment to our courier partners within 3-5 days from the date of your order and payment."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we do. For international buyers, orders are shipped and delivered through registered international courier companies or International Speed Post."
  },
  {
    question: "What should I do if my product arrives damaged?",
    answer: "In the rare event you receive a damaged or defective product, please contact our Customer Support immediately with proper evidence, including an unboxing video and images. Such cases are reviewed on a case-by-case basis."
  },
  {
    question: "What material is the 'Void Echo Tee' made from?",
    answer: "The Void Echo Tee is crafted from ultra-soft, heavyweight cotton for a modern, relaxed silhouette."
  },
  {
    question: "Are my photos saved when I use the Virtual Try-On feature?",
    answer: "No, your privacy is important to us. Photos uploaded for Virtual Try-On are processed temporarily to generate the preview and are not stored, saved, or retained in our database after your session ends."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our team by emailing support@xoid.com or calling +91 9400106048. Our support hours are 9 AM to 6 PM IST, Monday to Friday."
  },
  {
    question: "What is the Noir Canvas Tee like?",
    answer: "The Noir Canvas Tee is our quintessential oversized black t-shirt. It's designed for understated luxury with premium fabric and flawless construction."
  },
  {
    question: "Is the Chrome Fragment Tee in stock?",
    answer: "Currently, the Chrome Fragment Tee is out of stock in all sizes. We recommend checking back later for restocks."
  }
];
