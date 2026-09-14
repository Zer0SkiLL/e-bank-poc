import { Recipient, PaymentRequest, PaymentResult } from '../types/payment';
import { mockRecipients, mockAccounts } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getRecipients(): Promise<Recipient[]> {
    await delay(500);
    return [...mockRecipients];
  },

  async validateRecipient(recipientId: string): Promise<boolean> {
    await delay(300);
    return mockRecipients.some(r => r.id === recipientId);
  },

  async sendMoney(request: PaymentRequest): Promise<PaymentResult> {
    await delay(2000);
    
    const account = mockAccounts.find(a => a.id === request.fromAccountId);
    const recipient = mockRecipients.find(r => r.id === request.toRecipientId);
    
    if (!account || !recipient) {
      return { success: false, message: 'Invalid account or recipient' };
    }

    if (account.balance < request.amount) {
      return { success: false, message: 'Insufficient funds' };
    }

    const fee = request.amount > 1000 ? 2.50 : 0;
    
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      message: `Successfully sent $${request.amount.toFixed(2)} to ${recipient.name}`,
      fee,
    };
  },
};
