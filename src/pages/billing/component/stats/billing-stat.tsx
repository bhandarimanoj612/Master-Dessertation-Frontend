import {
  AlertTriangle,
  Calculator,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const BillingStat = () => {
  const [invoices] = useState([
    {
      id: "INV-2024-001",
      customerId: "CUST-001",
      customerName: "Ramesh Sharma",
      customerEmail: "ramesh@email.com",
      customerPhone: "9841234567",
      customerAddress: "Kathmandu, Nepal",
      deviceType: "iPhone 13 Pro",
      deviceModel: "A2483",
      issue: "Screen replacement and battery change",
      repairId: "RPR-2024-001",
      technicianName: "Suresh KC",
      dateCreated: "2024-08-05",
      dueDate: "2024-08-12",
      status: "Paid",
      paymentMethod: "Cash",
      paymentDate: "2024-08-08",
      items: [
        {
          id: 1,
          description: "iPhone 13 Pro Screen Replacement",
          quantity: 1,
          unitPrice: 15000,
          total: 15000,
        },
        {
          id: 2,
          description: "iPhone 13 Pro Battery Replacement",
          quantity: 1,
          unitPrice: 5000,
          total: 5000,
        },
        {
          id: 3,
          description: "Labor Charges",
          quantity: 1,
          unitPrice: 2000,
          total: 2000,
        },
      ],
      subtotal: 22000,
      taxRate: 13,
      taxAmount: 2860,
      discountAmount: 500,
      totalAmount: 24360,
      notes:
        "Device was in good condition. Customer satisfied with repair quality.",
    },
    {
      id: "INV-2024-002",
      customerId: "CUST-002",
      customerName: "Sita Rai",
      customerEmail: "sita@email.com",
      customerPhone: "9812345678",
      customerAddress: "Pokhara, Nepal",
      deviceType: "Samsung Galaxy S22",
      deviceModel: "SM-S901B",
      issue: "Camera module replacement",
      repairId: "RPR-2024-002",
      technicianName: "Raj Thapa",
      dateCreated: "2024-08-07",
      dueDate: "2024-08-14",
      status: "Pending",
      paymentMethod: "",
      paymentDate: "",
      items: [
        {
          id: 1,
          description: "Samsung Galaxy S22 Camera Module",
          quantity: 1,
          unitPrice: 8000,
          total: 8000,
        },
        {
          id: 2,
          description: "Labor Charges",
          quantity: 1,
          unitPrice: 1500,
          total: 1500,
        },
      ],
      subtotal: 9500,
      taxRate: 13,
      taxAmount: 1235,
      discountAmount: 0,
      totalAmount: 10735,
      notes: "Priority repair - customer needs phone urgently.",
    },
    {
      id: "INV-2024-003",
      customerId: "CUST-003",
      customerName: "Krishna Gurung",
      customerEmail: "krishna@email.com",
      customerPhone: "9823456789",
      customerAddress: "Lalitpur, Nepal",
      deviceType: "Dell Inspiron 15",
      deviceModel: "3501",
      issue: "Motherboard repair and SSD upgrade",
      repairId: "RPR-2024-003",
      technicianName: "Hari Bahadur",
      dateCreated: "2024-08-06",
      dueDate: "2024-08-13",
      status: "Overdue",
      paymentMethod: "",
      paymentDate: "",
      items: [
        {
          id: 1,
          description: "Motherboard Repair",
          quantity: 1,
          unitPrice: 12000,
          total: 12000,
        },
        {
          id: 2,
          description: "SSD 512GB",
          quantity: 1,
          unitPrice: 7500,
          total: 7500,
        },
        {
          id: 3,
          description: "Labor Charges",
          quantity: 2,
          unitPrice: 1000,
          total: 2000,
        },
      ],
      subtotal: 21500,
      taxRate: 13,
      taxAmount: 2795,
      discountAmount: 1000,
      totalAmount: 23295,
      notes: "Customer requested SSD upgrade during repair process.",
    },
    {
      id: "INV-2024-004",
      customerId: "CUST-004",
      customerName: "Maya Tamang",
      customerEmail: "maya@email.com",
      customerPhone: "9834567890",
      customerAddress: "Bhaktapur, Nepal",
      deviceType: "MacBook Air M1",
      deviceModel: "MGN63",
      issue: "Keyboard replacement",
      repairId: "RPR-2024-004",
      technicianName: "Maya Shrestha",
      dateCreated: "2024-08-08",
      dueDate: "2024-08-15",
      status: "Partially Paid",
      paymentMethod: "Digital Payment",
      paymentDate: "2024-08-09",
      items: [
        {
          id: 1,
          description: "MacBook Air M1 Keyboard",
          quantity: 1,
          unitPrice: 18000,
          total: 18000,
        },
        {
          id: 2,
          description: "Labor Charges",
          quantity: 1,
          unitPrice: 3000,
          total: 3000,
        },
      ],
      subtotal: 21000,
      taxRate: 13,
      taxAmount: 2730,
      discountAmount: 0,
      totalAmount: 23730,
      paidAmount: 15000,
      remainingAmount: 8730,
      notes: "Customer made partial payment. Remaining amount due on delivery.",
    },
  ]);

  // Calculate statistics
  const stats = {
    totalInvoices: invoices.length,
    totalRevenue: invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    pendingAmount: invoices
      .filter(
        (inv) =>
          inv.status === "Pending" ||
          inv.status === "Overdue" ||
          inv.status === "Partially Paid"
      )
      .reduce((sum, inv) => sum + (inv.remainingAmount || inv.totalAmount), 0),
    overdueCount: invoices.filter((inv) => inv.status === "Overdue").length,
    paidCount: invoices.filter((inv) => inv.status === "Paid").length,
    pendingCount: invoices.filter((inv) => inv.status === "Pending").length,
    avgInvoiceAmount: Math.round(
      invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / invoices.length
    ),
  };

  const formatCurrency = (amount: any) => {
    return `NPR ${amount.toLocaleString()}`;
  };
  return (
    // Statistics Cards Component

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-10">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <FileText className="w-6 h-6 text-white dark:text-neutral-300" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              {stats.totalInvoices}
            </div>
            <div className="text-sm text-gray-500">Total Invoices</div>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {stats.paidCount} Paid • {stats.pendingCount} Pending
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <DollarSign className="w-6 h-6 text-white " />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
        </div>
        <div className="flex items-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+8% from last month</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              {formatCurrency(stats.pendingAmount)}
            </div>
            <div className="text-sm text-gray-500">Pending Amount</div>
          </div>
        </div>
        <div className="text-sm text-red-600">
          {stats.overdueCount} Overdue invoices
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-neutral-300">
              {formatCurrency(stats.avgInvoiceAmount)}
            </div>
            <div className="text-sm text-gray-500">Avg Invoice</div>
          </div>
        </div>
        <div className="text-sm text-purple-600">Per repair average</div>
      </div>
    </div>
  );
};

export default BillingStat;
