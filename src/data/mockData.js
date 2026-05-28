export const PICKER_PROFILE = {
  id: 'PKR-4821',
  name: 'Rajesh Kumar',
  phone: '9876543210',
  warehouse: 'Dark Store #07 - Koramangala',
  shift: 'Morning (6AM - 2PM)',
  joinDate: '2024-08-15',
  rating: 4.8,
  totalOrders: 2847,
  language: 'en',
};

export const DASHBOARD_STATS = {
  ordersCompleted: 23,
  ordersTarget: 35,
  accuracy: 98.2,
  earningsToday: 847,
  avgPickTime: '2m 14s',
  itemsPicked: 156,
  rank: 3,
  totalPickers: 18,
};

export const PRODUCTS = [
  { id: 'P001', name: 'Amul Taaza Toned Milk', brand: 'Amul', weight: '500 ml', barcode: '8901030793509', image: null, rack: 'A-12', shelf: 'S2', category: 'Dairy', isCold: true, isFragile: false, price: 27 },
  { id: 'P002', name: 'Britannia Brown Bread', brand: 'Britannia', weight: '400 g', barcode: '8901063012547', image: null, rack: 'A-14', shelf: 'S1', category: 'Bakery', isCold: false, isFragile: true, price: 45 },
  { id: 'P003', name: 'Haldiram Aloo Bhujia', brand: 'Haldiram', weight: '200 g', barcode: '8904004400636', image: null, rack: 'B-02', shelf: 'S3', category: 'Snacks', isCold: false, isFragile: true, price: 65 },
  { id: 'P004', name: 'Coca-Cola Original', brand: 'Coca-Cola', weight: '750 ml', barcode: '5449000000996', image: null, rack: 'B-05', shelf: 'S1', category: 'Beverages', isCold: true, isFragile: false, price: 40 },
  { id: 'P005', name: 'Maggi 2-Min Noodles', brand: 'Nestle', weight: '280 g', barcode: '8901058851427', image: null, rack: 'C-08', shelf: 'S2', category: 'Instant Food', isCold: false, isFragile: false, price: 56 },
  { id: 'P006', name: 'Amul Butter', brand: 'Amul', weight: '100 g', barcode: '8901030311536', image: null, rack: 'A-12', shelf: 'S3', category: 'Dairy', isCold: true, isFragile: false, price: 56 },
  { id: 'P007', name: 'Lays Classic Salted', brand: 'PepsiCo', weight: '52 g', barcode: '8901491100113', image: null, rack: 'B-02', shelf: 'S1', category: 'Snacks', isCold: false, isFragile: true, price: 20 },
  { id: 'P008', name: 'Dettol Handwash', brand: 'Reckitt', weight: '200 ml', barcode: '8901396364795', image: null, rack: 'D-01', shelf: 'S2', category: 'Personal Care', isCold: false, isFragile: false, price: 99 },
  { id: 'P009', name: 'Parle-G Gold Biscuits', brand: 'Parle', weight: '100 g', barcode: '8904004402582', image: null, rack: 'C-03', shelf: 'S1', category: 'Biscuits', isCold: false, isFragile: true, price: 25 },
  { id: 'P010', name: 'Mother Dairy Curd', brand: 'Mother Dairy', weight: '400 g', barcode: '8906002430235', image: null, rack: 'A-14', shelf: 'S3', category: 'Dairy', isCold: true, isFragile: false, price: 35 },
  { id: 'P011', name: 'Surf Excel Liquid', brand: 'HUL', weight: '500 ml', barcode: '8901030628160', image: null, rack: 'D-06', shelf: 'S1', category: 'Cleaning', isCold: false, isFragile: false, price: 149 },
  { id: 'P012', name: 'Real Fruit Juice Mango', brand: 'Dabur', weight: '1L', barcode: '8901396515050', image: null, rack: 'B-05', shelf: 'S2', category: 'Beverages', isCold: true, isFragile: false, price: 99 },
];

const generateOrderItems = (count) => {
  const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((product, idx) => ({
    ...product,
    qty: Math.floor(Math.random() * 3) + 1,
    picked: false,
    orderItemId: `OI-${Date.now()}-${idx}`,
  }));
};

// Dynamic timer: 1 item=30s, 3=60s, 6=120s, 10=240s. Linear interpolation.
export const calculateTimerSeconds = (itemCount) => {
  if (itemCount <= 1) return 30;
  if (itemCount <= 3) return 30 + ((itemCount - 1) / 2) * 30; // 30-60
  if (itemCount <= 6) return 60 + ((itemCount - 3) / 3) * 60;  // 60-120
  if (itemCount <= 10) return 120 + ((itemCount - 6) / 4) * 120; // 120-240
  return 240 + (itemCount - 10) * 24; // beyond 10
};

export const MOCK_ORDERS = [
  {
    id: 'ORD-7842',
    items: generateOrderItems(5),
    status: 'pending',
    createdAt: new Date(Date.now() - 120000).toISOString(),
    customerArea: 'Sector 4, HSR Layout',
    bagCount: 2,
    deliveryAgent: 'Arun Mehta',
  },
  {
    id: 'ORD-7843',
    items: generateOrderItems(3),
    status: 'pending',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    customerArea: 'Koramangala 5th Block',
    bagCount: 1,
    deliveryAgent: 'Suresh Yadav',
  },
  {
    id: 'ORD-7844',
    items: generateOrderItems(7),
    status: 'pending',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    customerArea: 'Indiranagar 12th Main',
    bagCount: 3,
    deliveryAgent: 'Vikram Singh',
  },
  {
    id: 'ORD-7845',
    items: generateOrderItems(4),
    status: 'pending',
    createdAt: new Date(Date.now() - 480000).toISOString(),
    customerArea: 'BTM Layout 2nd Stage',
    bagCount: 1,
    deliveryAgent: 'Rahul Sharma',
  },
  {
    id: 'ORD-7839',
    items: generateOrderItems(4),
    status: 'delivered',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    customerArea: 'Sector 3, HSR Layout',
    bagCount: 1,
    deliveryAgent: 'Karan Malhotra',
    completionTime: 84, // 1 min 24s
    earnings: 25,
    accuracy: 100
  },
  {
    id: 'ORD-7835',
    items: generateOrderItems(6),
    status: 'delivered',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    customerArea: 'Koramangala 4th Block',
    bagCount: 2,
    deliveryAgent: 'Vijay Dev',
    completionTime: 142, // 2 min 22s
    earnings: 30,
    accuracy: 83
  }
];

export const EARNINGS_DATA = {
  today: { 
    total: 847, 
    basePay: 600, 
    incentives: 180, 
    bonuses: 67, 
    orders: 23, 
    hours: 5.5,
    ordersList: [
      { id: 'ORD-7842', amount: 42, time: '11:42 AM' },
      { id: 'ORD-7843', amount: 31, time: '12:15 PM' },
      { id: 'ORD-7839', amount: 35, time: '10:05 AM' },
      { id: 'ORD-7835', amount: 45, time: '09:20 AM' },
      { id: 'ORD-7831', amount: 27, time: '08:15 AM' }
    ]
  },
  weekly: { total: 5240, basePay: 3600, incentives: 1200, bonuses: 440, orders: 142 },
  monthly: { total: 21800, basePay: 15000, incentives: 4800, bonuses: 2000, orders: 580 },
  accuracy: { today: 98.2, weekly: 97.8, monthly: 97.5 },
};

export const NOTIFICATIONS = [
  { id: 'N1', type: 'order', title: 'New Order Assigned', message: 'ORD-7844 needs immediate picking', time: '2 min ago', read: false, link: '/orders' },
  { id: 'N2', type: 'incentive', title: 'Bonus Earned', message: 'Speed Bonus +50 credited', time: '15 min ago', read: false, link: '/earnings' },
  { id: 'N3', type: 'system', title: 'Shift Reminder', message: 'Your shift ends in 2 hours', time: '1 hr ago', read: true, link: '/profile' },
  { id: 'N4', type: 'alert', title: 'Rack B-05 Restocked', message: 'Cold beverages section updated', time: '2 hr ago', read: true, link: '/orders' },
  { id: 'N5', type: 'incentive', title: 'Weekly Target Update', message: 'You are 8 orders away from weekly bonus', time: '3 hr ago', read: true, link: '/earnings' },
];

export const getRackColor = (rack) => {
  const letter = rack.charAt(0).toUpperCase();
  const map = { A: 'rack-a', B: 'rack-b', C: 'rack-c', D: 'rack-d', E: 'rack-e', F: 'rack-f' };
  return map[letter] || 'rack-a';
};

export const getOptimizedRoute = (items) => {
  const unpicked = items.filter(i => !i.picked);
  return [...items].sort((a, b) => {
    if (a.picked && !b.picked) return 1;
    if (!a.picked && b.picked) return -1;
    const aKey = a.rack.charAt(0) + a.rack.split('-')[1].padStart(3, '0');
    const bKey = b.rack.charAt(0) + b.rack.split('-')[1].padStart(3, '0');
    return aKey.localeCompare(bKey);
  });
};
