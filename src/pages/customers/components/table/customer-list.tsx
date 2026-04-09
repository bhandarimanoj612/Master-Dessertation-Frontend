

const CustomerList = ({ customers }: { customers: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {customers.map((customer: any) => (
      <div
        key={customer.id}
        className="bg-white dark:bg-[#23272f] rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
      >
        {/* ...card layout, actions, etc */}
      </div>
    ))}
  </div>
);

export default CustomerList;
