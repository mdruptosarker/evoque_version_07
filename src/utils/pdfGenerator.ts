import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export function generateOrderInvoicePDF(order: Order, action: 'download' | 'open' = 'download'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Luxury minimalist color palette
  const darkNeutral = '#111827';
  const lightGrey = '#F9FAFB';
  const borderGrey = '#E5E7EB';

  // 1. Header Banner & Brand Name
  doc.setFillColor(lightGrey);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(darkNeutral);
  doc.text('EVOQUE', 18, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#6B7280');
  doc.text('PREMIUM HIGH-FASHION ESSENTIALS', 18, 28);
  doc.text('Rangpur, Dhaka, Bangladesh | evoque.hq@gmail.com | +880 1603642630', 18, 33);

  // Logo Badge Placeholder right side
  doc.setDrawColor('#D1D5DB');
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth - 45, 12, 28, 22, 3, 3, 'D');
  doc.setFontSize(8);
  doc.setTextColor('#9CA3AF');
  doc.text('EVOQUE', pageWidth - 38, 24);
  doc.text('LOGO SLOT', pageWidth - 39, 28);

  // 2. Invoice Title & Order Meta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(darkNeutral);
  doc.text('OFFICIAL INVOICE', 18, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#4B5563');
  doc.text(`Order ID: ${order.id}`, 18, 68);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 18, 74);
  doc.text(`Payment Method: ${order.paymentMethod}`, 18, 80);
  doc.text(`Order Status: ${order.status}`, 18, 86);
  if (order.trackingNumber) {
    doc.text(`Courier Tracking: ${order.courierName || 'Steadfast'} (#${order.trackingNumber})`, 18, 92);
  }

  // 3. Customer Shipping Address Box
  const addrBoxTop = 56;
  const addrBoxLeft = 110;
  doc.setFillColor('#FFFFFF');
  doc.setDrawColor(borderGrey);
  doc.roundedRect(addrBoxLeft, addrBoxTop, 82, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor('#374151');
  doc.text('BILLED & SHIPPED TO:', addrBoxLeft + 6, addrBoxTop + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#1F2937');
  doc.text(order.customerName, addrBoxLeft + 6, addrBoxTop + 15);
  
  // Multi-line address wrapping
  const splitAddress = doc.splitTextToSize(order.shippingAddress || 'N/A', 70);
  doc.text(splitAddress, addrBoxLeft + 6, addrBoxTop + 21);
  
  const phoneTop = addrBoxTop + 21 + (splitAddress.length * 4.5);
  doc.text(`Phone: ${order.phone || 'N/A'}`, addrBoxLeft + 6, Math.min(phoneTop, addrBoxTop + 33));

  // 4. Itemized Order Table
  const tableData = order.items.map(item => [
    item.name + (item.selectedSize ? ` (Size: ${item.selectedSize})` : '') + (item.selectedColor ? ` [${item.selectedColor}]` : ''),
    item.code,
    item.quantity.toString(),
    `BDT ${(item.price || 0).toLocaleString()}`,
    `BDT ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}`
  ]);

  const startY = order.trackingNumber ? 102 : 96;

  autoTable(doc, {
    startY: startY,
    head: [['Product Description', 'SKU / Code', 'Qty', 'Unit Price', 'Line Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: darkNeutral,
      textColor: '#FFFFFF',
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: '#374151',
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 32 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 18, right: 18 }
  });

  // 5. Financial Totals & COD Summary
  const pageHeight = doc.internal.pageSize.getHeight();
  let tableEndY = (doc as any).lastAutoTable.finalY + 8;

  // Check if summary fits on current page or needs a new page
  if (tableEndY + 55 > pageHeight - 20) {
    doc.addPage();
    tableEndY = 25;
  }

  // Totals box on the right
  const totalsLeft = pageWidth - 85;
  let currentY = tableEndY;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#4B5563');
  doc.text('Subtotal:', totalsLeft, currentY);
  doc.text(`BDT ${(order.subtotal || 0).toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });

  currentY += 6;
  doc.text('Delivery Charge:', totalsLeft, currentY);
  doc.text(`BDT ${(order.deliveryCharge || 0).toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });

  if ((order.discountAmount || 0) > 0) {
    currentY += 6;
    doc.setTextColor('#059669'); // Green discount
    doc.text('Discount:', totalsLeft, currentY);
    doc.text(`- BDT ${(order.discountAmount || 0).toLocaleString()}`, pageWidth - 18, currentY, { align: 'right' });
  }

  currentY += 8;
  doc.setDrawColor('#9CA3AF');
  doc.setLineWidth(0.5);
  doc.line(totalsLeft, currentY - 4, pageWidth - 18, currentY - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNeutral);
  doc.text('GRAND TOTAL:', totalsLeft, currentY + 2);
  doc.text(`BDT ${(order.total || 0).toLocaleString()}`, pageWidth - 18, currentY + 2, { align: 'right' });

  // 6. COD Reminder Banner & Footer
  let bannerY = currentY + 12;
  if (bannerY + 20 > pageHeight - 20) {
    doc.addPage();
    bannerY = 25;
  }

  doc.setFillColor('#FEF3C7'); // Light yellow warning tint
  doc.setDrawColor('#F59E0B');
  doc.roundedRect(18, bannerY, pageWidth - 36, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor('#B45309');
  doc.text('PAYMENT NOTICE: CASH ON DELIVERY (COD)', 24, bannerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor('#92400E');
  doc.text('Please ensure exact cash amount is ready upon delivery by our authorized courier partner.', 24, bannerY + 11);

  // Footer Note positioned strictly at bottom of the page
  const footerY = pageHeight - 12;
  doc.setFontSize(8);
  doc.setTextColor('#9CA3AF');
  doc.text('Thank you for choosing EVOQUE. For any order inquiries, contact evoque.hq@gmail.com with your Order ID.', pageWidth / 2, footerY, { align: 'center' });

  // Output
  const fileName = `EVOQUE_Invoice_${order.id}.pdf`;
  if (action === 'open') {
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(fileName);
  }
}
