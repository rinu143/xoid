
import { Order } from '../types';
// FIX: Corrected import to use the exported `productsData` and aliased it as `products`.
import { productsData as products } from './products';

export const mockOrders: Order[] = [
  { 
    id: 'Z01D-78923', 
    date: 'July 25, 2024', 
    customer: 'John Doe',
    total: '₹21998.00', 
    status: 'Shipped', 
    items: [
        { ...products[0], quantity: 1, size: 'L', cartItemId: '1-L' },
        { ...products[1], quantity: 1, size: 'L', cartItemId: '2-L' },
    ]
  },
  { 
    id: 'Z01D-54198', 
    date: 'June 12, 2024', 
    customer: 'Jane Smith',
    total: '₹7999.00', 
    status: 'Delivered', 
    items: [
         { ...products[2], quantity: 1, size: 'M', cartItemId: '3-M' },
    ]
  },
  {
    id: 'Z01D-66341',
    date: 'July 28, 2024',
    customer: 'Alex Ray',
    total: '₹9999.00',
    status: 'Processing',
    items: [
        { ...products[3], quantity: 1, size: 'M', cartItemId: '4-M' }
    ]
  }
];
