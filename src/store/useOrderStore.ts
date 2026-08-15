import { create } from 'zustand';
import { Order, OrderStatus, PaymentMethod } from '../types';
import { INITIAL_ORDERS } from '../data/seed';

interface OrderState {
  orders: Order[];
  activeTrackingOrder: Order | null;
  isCheckoutOpen: boolean;
  isMoMoModalOpen: boolean;
  pendingMoMoOrder: Order | null;
  
  // Actions
  openCheckout: () => void;
  closeCheckout: () => void;
  openMoMoModal: (order: Order) => void;
  closeMoMoModal: () => void;
  setActiveTrackingOrder: (order: Order | null) => void;
  
  createOrder: (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'tracking_code'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: INITIAL_ORDERS,
  activeTrackingOrder: null,
  isCheckoutOpen: false,
  isMoMoModalOpen: false,
  pendingMoMoOrder: null,

  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  openMoMoModal: (order) => set({ isMoMoModalOpen: true, pendingMoMoOrder: order }),
  closeMoMoModal: () => set({ isMoMoModalOpen: false, pendingMoMoOrder: null }),
  setActiveTrackingOrder: (order) => set({ activeTrackingOrder: order }),

  createOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      tracking_code: `NXR-TRK-${Math.floor(10000 + Math.random() * 89999)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    set((state) => ({
      orders: [newOrder, ...state.orders],
      activeTrackingOrder: newOrder,
    }));

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((o) => (o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o)),
    activeTrackingOrder: state.activeTrackingOrder?.id === orderId ? { ...state.activeTrackingOrder, status, updated_at: new Date().toISOString() } : state.activeTrackingOrder,
  })),
}));
