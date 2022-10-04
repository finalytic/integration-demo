import { ServiceClass } from '@finalytic/integration-v1';
import { day } from '@finalytic/utils';

export type Unit = {
  id: number;
  name: string;
  updatedAt: number;
  address: string;
};
export type Booking = {
  id: number;
  guestName: string;
  checkin: string;
  checkout: string;
  unitId: number;
  updatedAt: number;
};
export type Payment = {
  id: number;
  sentAt: string;
  amount: number;
  reference: string;
  lines: [string, number][];
};

// Extend from ServiceClass, no constructor necessary
export class RentalApi extends ServiceClass {
  // Implement the connect function
  async connect(credentials: { apiKey: string }) {
    console;
    return credentials;
  }

  /*@Collection('payment', {
    key: 'id',
    expand: item => x,
    paginate:
  })*/
  public async getPayments() {
    const items = Array(3)
      .fill(0)
      .map<Payment>((_, id) => ({
        id,
        reference: `Unit ${id}`,
        sentAt: day().toISOString(),
        amount: id * 100,
        lines: [
          ['Accommodation', id * 100],
          ['Cleaning', 50],
          ['OTA', -50],
        ],
      }));
    return items;
  }
  public async getUnits() {
    const items = Array(3)
      .fill(0)
      .map<Unit>((_, id) => ({
        id,
        name: `Unit ${id}`,
        updatedAt: +new Date(),
        address: `Holibay St. ${id}`,
      }));
    return items;
  }
  public async getBookings(start?: string, end?: string, l = 3) {
    const units = await this.getUnits();
    const items = Array(l)
      .fill(0)
      .map<Booking>((_, id) => ({
        id,
        guestName: `Mr. ${id}`,
        checkin: day(end).toISOString(),
        checkout: day(end).add(2, 'd').toISOString(),
        unitId: id % units.length,
        updatedAt: +new Date(),
      }));
    return items;
  }
  public async verify() {
    return true;
  }
  public async sendEmail(email: string, message: string) {
    return { id: '12', email, message };
  }
  public async revokeEmail(id: string) {
    return { id: '12' };
  }
}
