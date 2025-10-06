export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1SEyeiKZBjsmEk2LZrr7VNkD',
    name: 'Remera luck ra',
    description: 'hola',
    mode: 'subscription'
  }
];