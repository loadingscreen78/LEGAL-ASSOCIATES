import jsPDF from 'jspdf';

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  shippingAddress: {
    full_name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  items?: Array<{
    product_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

// Function to load image and convert to base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = url;
  });
};

export const generateInvoicePDF = async (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [30, 41, 59]; // Midnight Blue
  const goldColor: [number, number, number] = [212, 175, 55]; // Gold
  const grayColor: [number, number, number] = [100, 116, 139];
  const lightGray: [number, number, number] = [241, 245, 249];

  // Header Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Gold accent line
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.rect(0, 55, pageWidth, 3, 'F');

  // Try to load and add logo
  try {
    const logoBase64 = await loadImageAsBase64('/logo.png');
    // Draw a gold circle background for logo
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.circle(28, 27, 12, 'F');
    // Add logo image
    doc.addImage(logoBase64, 'PNG', 18, 17, 20, 20);
  } catch (error) {
    // If logo fails to load, draw a placeholder circle with "LA"
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.circle(28, 27, 12, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LA', 28, 30, { align: 'center' });
  }

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LEGAL ASSOCIATES', 45, 25);
  
  // Tagline
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Your Trusted Legal Publications Partner', 45, 33);
  
  // Gold underline for company name
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.5);
  doc.line(45, 36, 120, 36);

  // Invoice Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 20, 22, { align: 'right' });
  
  // Invoice Number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`#${data.orderNumber}`, pageWidth - 20, 32, { align: 'right' });

  // Payment Status Badge
  const statusColor = data.paymentStatus === 'paid' ? [16, 185, 129] : [217, 119, 6];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  const statusText = data.paymentStatus?.toUpperCase() || 'PENDING';
  const statusWidth = doc.getTextWidth(statusText) + 16;
  doc.roundedRect(pageWidth - 20 - statusWidth, 40, statusWidth, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, pageWidth - 20 - statusWidth / 2, 46.5, { align: 'center' });

  // Reset text color
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  // Bill To Section
  let yPos = 75;
  
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(15, yPos - 5, 85, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('BILLED TO', 20, yPos + 5);
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(data.shippingAddress.full_name || 'Customer', 20, yPos + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  
  const addressLines = [];
  if (data.shippingAddress.address) addressLines.push(data.shippingAddress.address);
  if (data.shippingAddress.pincode) addressLines.push(`PIN: ${data.shippingAddress.pincode}`);
  if (data.shippingAddress.phone) addressLines.push(`Phone: ${data.shippingAddress.phone}`);
  
  addressLines.forEach((line, index) => {
    doc.text(line, 20, yPos + 23 + (index * 6));
  });

  // Invoice Details Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(110, yPos - 5, 85, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('INVOICE DETAILS', 115, yPos + 5);
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Date:', 115, yPos + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(data.orderDate, 145, yPos + 15);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Payment:', 115, yPos + 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(data.paymentMethod || 'Online', 145, yPos + 23);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Status:', 115, yPos + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(data.paymentStatus?.toUpperCase() || 'PENDING', 145, yPos + 31);

  // Items Table
  yPos = 140;
  
  // Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', 20, yPos + 8);
  doc.text('QTY', 120, yPos + 8, { align: 'center' });
  doc.text('PRICE', 150, yPos + 8, { align: 'right' });
  doc.text('TOTAL', pageWidth - 20, yPos + 8, { align: 'right' });

  yPos += 18;
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'normal');

  // Items
  const items = data.items && data.items.length > 0 
    ? data.items 
    : [{ product_title: 'Order Items', quantity: 1, unit_price: data.totalAmount, total_price: data.totalAmount }];

  items.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    }
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(item.product_title.substring(0, 40), 20, yPos + 3);
    doc.text(item.quantity.toString(), 120, yPos + 3, { align: 'center' });
    doc.text(`₹${item.unit_price.toFixed(2)}`, 150, yPos + 3, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`₹${item.total_price.toFixed(2)}`, pageWidth - 20, yPos + 3, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    yPos += 12;
  });

  // Divider line
  yPos += 5;
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);

  // Totals Section
  yPos += 15;
  const totalsX = pageWidth - 90;
  
  // Subtotal
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`₹${data.totalAmount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
  
  // Shipping
  yPos += 10;
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Shipping:', totalsX, yPos);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('₹0.00', pageWidth - 20, yPos, { align: 'right' });
  
  // Tax
  yPos += 10;
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Tax (0%):', totalsX, yPos);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('₹0.00', pageWidth - 20, yPos, { align: 'right' });

  // Grand Total
  yPos += 15;
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.roundedRect(totalsX - 10, yPos - 8, pageWidth - totalsX + 5, 16, 3, 3, 'F');
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', totalsX, yPos + 3);
  doc.setFontSize(14);
  doc.text(`₹${data.totalAmount.toFixed(2)}`, pageWidth - 20, yPos + 3, { align: 'right' });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 45;
  
  // Footer background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 15, pageWidth, 60, 'F');
  
  // Gold line
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.rect(15, footerY - 15, pageWidth - 30, 2, 'F');
  
  // Small logo in footer
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.circle(pageWidth / 2, footerY, 8, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('LA', pageWidth / 2, footerY + 3, { align: 'center' });
  
  // Thank you message
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for your purchase!', pageWidth / 2, footerY + 15, { align: 'center' });
  
  // Contact info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('For any queries, please contact us at support@legalassociates.com', pageWidth / 2, footerY + 23, { align: 'center' });
  
  // Company info
  doc.setFontSize(8);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('LEGAL ASSOCIATES', pageWidth / 2, footerY + 32, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Your Trusted Legal Publications Partner', pageWidth / 2, footerY + 38, { align: 'center' });

  // Terms & Conditions (small print)
  doc.setFontSize(7);
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 46, { align: 'center' });

  // Save the PDF
  doc.save(`Invoice_${data.orderNumber}.pdf`);
};
