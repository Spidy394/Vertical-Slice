export type Product = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    productUrl: string;
    stockStatus: 'available' | 'out of stock';
}