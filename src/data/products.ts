import { Product } from "@/context/CartContext";
import tomatoesImg from "@/assets/tomatoes.jpg";
import carrotsImg from "@/assets/carrots.jpg";
import lettuceImg from "@/assets/lettuce.jpg";
import peppersImg from "@/assets/peppers.jpg";
import broccoliImg from "@/assets/broccoli.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Tomatoes",
    price: 4.99,
    image: tomatoesImg,
    description: "Fresh, juicy organic tomatoes perfect for salads and cooking",
    unit: "per lb"
  },
  {
    id: "2", 
    name: "Fresh Carrots",
    price: 3.49,
    image: carrotsImg,
    description: "Sweet and crispy organic carrots, great for snacking",
    unit: "per lb"
  },
  {
    id: "3",
    name: "Green Lettuce",
    price: 2.99,
    image: lettuceImg,
    description: "Crisp romaine lettuce, perfect for fresh salads",
    unit: "per head"
  },
  {
    id: "4",
    name: "Bell Peppers",
    price: 5.99,
    image: peppersImg,
    description: "Colorful mix of red and yellow bell peppers",
    unit: "per lb"
  },
  {
    id: "5",
    name: "Fresh Broccoli",
    price: 4.49,
    image: broccoliImg,
    description: "Nutritious fresh broccoli crowns, steam or stir-fry",
    unit: "per head"
  }
];