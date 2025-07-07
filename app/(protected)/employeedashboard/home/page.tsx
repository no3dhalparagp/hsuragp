"use client"

import ServiceCalendar from '@/components/ServiceCalendar';
import { ServiceType } from '@prisma/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const BookingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDayClick = (date: Date) => {
    // Create new URLSearchParams from existing ones
    const params = new URLSearchParams(searchParams.toString());
    // Set/update the date parameter
    params.set('date', date.toISOString());

    // Update URL while preserving other parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <h1>Service Availability Calendar</h1>
      <ServiceCalendar onDayClick={handleDayClick} />
    </div>
  );
};

export default BookingPage;
