/**
 * СЕРВИС ДЛЯ ЮKASSA (API v3)
 */

export interface PaymentRequest {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
}

export const yookassaApi = {
  /**
   * Запрос на создание платежа (используя прокси Vite)
   */
  createPayment: async ({ amount, description, orderId, customerEmail }: PaymentRequest) => {
    try {
      const response = await fetch('/yookassa-api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': `booking-${orderId}-${Date.now()}`
        },
        body: JSON.stringify({
          amount: {
            value: amount.toFixed(2),
            currency: 'RUB'
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: window.location.origin
          },
          description: description,
          metadata: {
            order_id: orderId
          },
          // ОБЯЗАТЕЛЬНО для 54-ФЗ
          receipt: {
            customer: {
              email: customerEmail
            },
            items: [
              {
                description: description,
                quantity: "1.00",
                amount: {
                  value: amount.toFixed(2),
                  currency: 'RUB'
                },
                vat_code: "1",
                payment_mode: "full_prepayment",
                payment_subject: "service"
              }
            ]
          }
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.description || 'Ошибка API ЮKassa');
      }

      return await response.json();
    } catch (error: any) {
      console.error('YooKassa Error:', error);
      throw error;
    }
  }
};

