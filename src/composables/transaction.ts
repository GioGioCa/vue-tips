import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Interfaces
export interface PaymentTips {
  valueMoney: number;
  paymentMethod: string;
  splitAmount: number;
  peopleAmount: number;
  id?: string;
}

export interface Transaction {
  id: string;
  totalTips: number;
  payments: PaymentTips[];
  createdAt: Date;
}

// Clase con métodos + conexión Firebase
export class TransactionManager implements Transaction {
  id: string;
  totalTips: number;
  payments: PaymentTips[] = [];
  createdAt: Date;

  constructor(id: string, totalTips: number, createdAt?: Date) {
    this.id = id;
    this.totalTips = totalTips;
    this.createdAt = createdAt ?? new Date();
  }

  addPayment(payment: PaymentTips): void {
    const currentTotal = this.getTotalPaid();
    if (currentTotal + payment.valueMoney > this.totalTips) {
      throw new Error('El pago excede el total de la transacción.');
    }
    this.payments.push(payment);
  }

  getTotalPaid(): number {
    return this.payments.reduce((sum, p) => sum + p.valueMoney, 0);
  }

  isComplete(): boolean {
    return this.getTotalPaid() >= this.totalTips;
  }

  getPayments(): PaymentTips[] {
    return this.payments;
  }

  removePayment(paymentId: string): void {
    this.payments = this.payments.filter(p => p.id !== paymentId);
  }

  // 🔥 Guardar en Firestore
  async saveToFirestore(): Promise<void> {
    const docRef = doc(db, 'transactions', this.id);
    await setDoc(docRef, {
      id: this.id,
      totalTips: this.totalTips,
      payments: this.payments,
      createdAt: this.createdAt,
    });
  }

  // 🔥 Actualizar solo los pagos
  async updatePayments(): Promise<void> {
    const docRef = doc(db, 'transactions', this.id);
    await updateDoc(docRef, {
      payments: this.payments,
    });
  }

  // 🔥 Leer desde Firestore
  static async loadFromFirestore(id: string): Promise<TransactionManager | null> {
    const docRef = doc(db, 'transactions', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Transaction;
      const tm = new TransactionManager(data.id, data.totalTips, data.createdAt.toDate?.() ?? new Date(data.createdAt));
      tm.payments = data.payments;
      return tm;
    } else {
      return null;
    }
  }

  // 🔥 Eliminar
  async delete(): Promise<void> {
    const docRef = doc(db, 'transactions', this.id);
    await deleteDoc(docRef);
  }
}
