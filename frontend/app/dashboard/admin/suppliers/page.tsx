'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Building2, Mail, Phone, UserCircle } from 'lucide-react'

export default function AdminSuppliersLockedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <p className="text-sm text-gray-500 mt-0.5">Planned module (currently locked)</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Lock className="h-5 w-5" />
            Supplier Directory is Temporarily Locked
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900 space-y-2">
          <p>This page is visible for planning purposes but actions are disabled for now.</p>
          <p>Current flow uses manual supplier name/email fields inside package create/edit.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Intended System (Phase 2)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-2 flex items-center gap-2"><Building2 className="h-4 w-4" /> Supplier Profiles</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>Supplier company name</li>
              <li>Primary contact person</li>
              <li className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Supplier email</li>
              <li className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Supplier phone</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-2 flex items-center gap-2"><UserCircle className="h-4 w-4" /> Workflow</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>Link suppliers to packages</li>
              <li>Send package enquiry to supplier</li>
              <li>Receive supplier quote</li>
              <li>Admin sends final quote to customer</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
