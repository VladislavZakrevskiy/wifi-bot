import 'telegraf';

declare module 'telegraf' {
  interface Context {
    message?: {
      successful_payment?: SuccessfulPayment;
    };
  }
}
