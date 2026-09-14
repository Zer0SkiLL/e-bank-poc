export interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  bankName?: string;
  avatar?: string;
  isFavorite: boolean;
}

export interface PaymentRequest {
  fromAccountId: string;
  toRecipientId: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  fee?: number;
}
