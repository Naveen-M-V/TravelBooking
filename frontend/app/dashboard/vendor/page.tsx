export default function VendorDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">My Packages</h2>
          <p className="text-gray-600">Manage your packages</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Bookings</h2>
          <p className="text-gray-600">View received bookings</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600">Performance metrics</p>
        </div>
      </div>
    </div>
  )
}
