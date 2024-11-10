export class Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  status: string;
  image1: string ;  // Có thể là chuỗi hoặc tệp nếu bạn đang upload file
  image2: string ;
  category: string; // ID của category
  distinctiveIds: string; // Mảng ID của distinctives
}
