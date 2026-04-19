import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { Booking } from '@/utils/database';

export async function downloadBookingTicketPdf(booking: Booking): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a5', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;
  let y = margin;

  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageW, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('SWA Yatra — E-Ticket', margin, 13);

  doc.setTextColor(33, 33, 33);
  y = 28;
  doc.setFontSize(10);

  const row = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    const valueX = margin + 36;
    const maxW = pageW - margin - valueX;
    const lines = doc.splitTextToSize(value, maxW);
    doc.text(lines, valueX, y);
    y += Math.max(7, lines.length * 5);
  };

  row('Booking ID', booking.id);
  row('Place', booking.placeName);
  row('Visit date', new Date(booking.date).toLocaleDateString());
  row('Visit time', String(booking.time));
  row('Visitors', String(booking.visitors));
  row('Contact', booking.name);
  row('Email', booking.email);
  row('Phone', booking.phone);
  row('Amount', `INR ${booking.amount}`);
  row('Payment', booking.paymentStatus);
  row('Status', booking.status);
  if (booking.paymentId) {
    row('Payment ref', booking.paymentId);
  }

  y += 2;
  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  if (booking.qrCode) {
    const dataUrl = await QRCode.toDataURL(booking.qrCode, {
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'M',
    });
    const qrMm = 42;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Entry QR', margin, y);
    y += 5;
    doc.addImage(dataUrl, 'PNG', margin, y, qrMm, qrMm);
    y += qrMm + 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90);
    doc.text('Show this QR at the venue entrance.', margin, y);
    doc.setTextColor(33, 33, 33);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, margin, pageH - 6);

  const safeId = booking.id.replace(/[^\w.-]+/g, '_');
  doc.save(`ticket-${safeId}.pdf`);
}
