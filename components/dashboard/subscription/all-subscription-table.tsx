type Props = {
  data: any[];
};

export function SubscriptionTable({ data }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Transaction ID",
                "Plan",
                "Amount",
                "Date",
                "Next Billing",
                "Status",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 font-bold uppercase">{sub.id}</td>
                <td className="px-6 py-5">{sub.plan}</td>
                <td className="px-6 py-5 font-black">{sub.amount}</td>
                <td className="px-6 py-5 text-gray-500">{sub.date}</td>
                <td className="px-6 py-5 text-gray-500">{sub.nextBilling}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      sub.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
