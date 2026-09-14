import { Recipient, PaymentRequest, PaymentResult } from '../types/payment';
import { mockRecipients, mockAccounts } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Payment service providing mock API calls for money transfers.
 * Handles recipient lookup, validation, and mock payment processing
 * with fee calculation for amounts over $1,000.
 */
export const paymentService = {
  /**
   * Retrieves all available payment recipients.
   * @returns Promise resolving to an array of Recipient objects.
   */
  async getRecipients(): Promise<Recipient[]> {
    await delay(500);
    return [...mockRecipients];
  },

  /**
   * Validates whether a recipient ID corresponds to a known recipient.
   * @param recipientId - The unique identifier of the recipient.
   * @returns Promise resolving to true if the recipient exists.
   */
  async validateRecipient(recipientId: string): Promise<boolean> {
    await delay(300);
    return mockRecipients.some(r => r.id === recipientId);
  },

  /**
   * Processes a mock money transfer between accounts.
   * Applies a $2.50 fee for transfers exceeding $1,000.
   * @param request - The payment request containing account, recipient, amount, and optional note.
   * @returns Promise resolving to a PaymentResult with success status and transaction ID.
   */
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
