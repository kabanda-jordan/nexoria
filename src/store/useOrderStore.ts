import { create } from 'zustand';
import { Order, OrderStatus, PaymentMethod } from '../types';
import { INITIAL_ORDERS } from '../data/seed';
import { api } from '../services/api';

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

    api
      .createOrder(newOrder)
      .then(({ order }) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === newOrder.id ? { ...o, ...order } : o)),
          activeTrackingOrder:
            state.activeTrackingOrder?.id === newOrder.id
              ? { ...state.activeTrackingOrder, ...order }
              : state.activeTrackingOrder,
        }));
      })
      .catch((e) => console.warn('[api] create order failed, order kept locally', e));

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o)),
      activeTrackingOrder: state.activeTrackingOrder?.id === orderId ? { ...state.activeTrackingOrder, status, updated_at: new Date().toISOString() } : state.activeTrackingOrder,
    }));
    api.updateOrderStatus(orderId, status).catch((e) => console.warn('[api] update order status failed', e));
  },
}));

// Hydrate orders from the live D1-backed API.
(async () => {
  try {
    const res = await api.getOrders();
    useOrderStore.setState({ orders: res.orders });
  } catch (e) {
    console.warn('[api] order hydrate failed, using local seed data', e);
  }
})();
