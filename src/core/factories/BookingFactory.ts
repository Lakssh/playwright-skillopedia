import { DataHelper } from '../helpers/DataHelper';
import { BOOKING_STATUS } from '../config/constants';

export interface Booking {
  id?: string;
  studentId?: string;
  mentorId?: string;
  courseId?: string;
  sessionDate: Date;
  sessionTime: string;
  duration: number; // in minutes
  status: string;
  price: number;
  notes?: string;
  meetingUrl?: string;
}

/**
 * BookingFactory - Factory for generating booking test data
 */
export class BookingFactory {
  /**
   * Create a booking
   * @param overrides - Optional property overrides
   */
  static create(overrides?: Partial<Booking>): Booking {
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];

    return {
      sessionDate: DataHelper.generateFutureDate(Math.floor(Math.random() * 14) + 1), // 1-14 days
      sessionTime: randomTime,
      duration: 60, // 60 minutes by default
      status: BOOKING_STATUS.PENDING,
      price: DataHelper.generatePrice(50, 200),
      notes: DataHelper.generateBio(),
      ...overrides,
    };
  }

  /**
   * Create pending booking
   * @param overrides - Optional property overrides
   */
  static createPending(overrides?: Partial<Booking>): Booking {
    return this.create({
      status: BOOKING_STATUS.PENDING,
      ...overrides,
    });
  }

  /**
   * Create confirmed booking
   * @param overrides - Optional property overrides
   */
  static createConfirmed(overrides?: Partial<Booking>): Booking {
    return this.create({
      status: BOOKING_STATUS.CONFIRMED,
      meetingUrl: `https://meet.example.com/${DataHelper.generateUUID()}`,
      ...overrides,
    });
  }

  /**
   * Create cancelled booking
   * @param overrides - Optional property overrides
   */
  static createCancelled(overrides?: Partial<Booking>): Booking {
    return this.create({
      status: BOOKING_STATUS.CANCELLED,
      sessionDate: DataHelper.generatePastDate(Math.floor(Math.random() * 7) + 1),
      ...overrides,
    });
  }

  /**
   * Create completed booking
   * @param overrides - Optional property overrides
   */
  static createCompleted(overrides?: Partial<Booking>): Booking {
    return this.create({
      status: BOOKING_STATUS.COMPLETED,
      sessionDate: DataHelper.generatePastDate(Math.floor(Math.random() * 30) + 1),
      ...overrides,
    });
  }

  /**
   * Create multiple bookings
   * @param count - Number of bookings to create
   * @param status - Booking status
   */
  static createMultiple(count: number, status?: string): Booking[] {
    return Array.from({ length: count }, () => {
      if (status) {
        return this.create({ status });
      }
      return this.create();
    });
  }

  /**
   * Create booking for specific date
   * @param date - Session date
   * @param overrides - Optional property overrides
   */
  static createForDate(date: Date, overrides?: Partial<Booking>): Booking {
    return this.create({
      sessionDate: date,
      ...overrides,
    });
  }

  /**
   * Create long session booking
   * @param overrides - Optional property overrides
   */
  static createLongSession(overrides?: Partial<Booking>): Booking {
    return this.create({
      duration: 120, // 2 hours
      price: DataHelper.generatePrice(100, 300),
      ...overrides,
    });
  }

  /**
   * Create short session booking
   * @param overrides - Optional property overrides
   */
  static createShortSession(overrides?: Partial<Booking>): Booking {
    return this.create({
      duration: 30, // 30 minutes
      price: DataHelper.generatePrice(25, 75),
      ...overrides,
    });
  }
}
