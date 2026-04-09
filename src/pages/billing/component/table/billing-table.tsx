import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

const BillingTable = () => {
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

  const [searchTerm] = useState("");
  const [statusFilter] = useState("All");
  const [_showDetailsModal, setShowDetailsModal] = useState(false);
  const [_selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [_showPaymentModal, setShowPaymentModal] = useState(false);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "All" || invoice.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4" />;
      case "Partially Paid":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Partially Paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300 ">
                Invoice
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Customer
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Device
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Amount
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Status
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Date
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-neutral-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-neutral-300">
                      {invoice.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-neutral-300">
                      {invoice.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.customerPhone}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-neutral-300">
                      {invoice.deviceType}
                    </div>
                    <div className="text-sm text-gray-500">{invoice.issue}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900 dark:text-neutral-400">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  {invoice.status === "Partially Paid" && (
                    <div className="text-sm text-orange-600">
                      Paid: {formatCurrency(invoice.paidAmount ?? 0)}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border space-x-1 ${getStatusColor(invoice.status)}`}
                  >
                    {getStatusIcon(invoice.status)}
                    <span>{invoice.status}</span>
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900 dark:text-neutral-400">
                    {new Date(invoice.dateCreated).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {invoice.status !== "Paid" && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPaymentModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                        title="Record Payment"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingTable;
