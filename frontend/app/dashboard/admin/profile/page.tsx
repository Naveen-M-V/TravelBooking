'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/lib/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save, KeyRound, User, Mail, Phone, Globe, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminProfilePage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState({ firstName: '', lastName: '', telephone: '', nationality: '', residency: '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) { router.push('/login'); return }
      setProfile({
        firstName:   user.firstName   || '',
        lastName:    user.lastName    || '',
        telephone:   (user as any).telephone  || '',
        nationality: (user as any).nationality || '',
        residency:   (user as any).residency   || '',
      })
    }
  }, [authLoading, user, isAdmin])

  const setProfileField = (k: keyof typeof profile, v: string) => setProfile(p => ({ ...p, [k]: v }))
  const setPasswordField = (k: keyof typeof passwords, v: string) => setPasswords(p => ({ ...p, [k]: v }))

  const handleSaveProfile = async () => {
    setSavingProfile(true); setProfileMsg(null)
    try {
      await apiClient.put('/auth/profile', profile)
      setProfileMsg({ type: 'ok', text: 'Profile updated successfully.' })
    } catch (e: any) {
      setProfileMsg({ type: 'err', text: e.response?.data?.error || 'Failed to update profile' })
    } finally { setSavingProfile(false) }
  }

  const handleChangePassword = async () => {
    setPasswordMsg(null)
    if (!passwords.current) { setPasswordMsg({ type: 'err', text: 'Current password is required' }); return }
    if (passwords.newPass.length < 8) { setPasswordMsg({ type: 'err', text: 'New password must be at least 8 characters' }); return }
    if (passwords.newPass !== passwords.confirm) { setPasswordMsg({ type: 'err', text: 'New passwords do not match' }); return }
    setSavingPassword(true)
    try {
      await apiClient.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.newPass })
      setPasswordMsg({ type: 'ok', text: 'Password changed successfully.' })
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (e: any) {
      setPasswordMsg({ type: 'err', text: e.response?.data?.error || 'Failed to change password' })
    } finally { setSavingPassword(false) }
  }

  if (authLoading || !user) return null

  const initials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : (user.email?.[0] ?? 'A').toUpperCase()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account details</p>
      </div>

      {/* ── Avatar strip ─────────────────────────────────── */}
      <Card>
        <CardContent className="p-5 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-teal-100 ring-2 ring-teal-300 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-teal-700">{initials}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              {profile.firstName || profile.lastName
                ? `${profile.firstName} ${profile.lastName}`.trim()
                : 'Administrator'}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
              Administrator
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Profile Form ─────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base"><User className="w-4 h-4" /> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input value={profile.firstName} onChange={e => setProfileField('firstName', e.target.value)} placeholder="First name" />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input value={profile.lastName} onChange={e => setProfileField('lastName', e.target.value)} placeholder="Last name" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2">
              <Input value={user.email || ''} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
              <span className="text-xs text-gray-400 whitespace-nowrap">Cannot change</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input value={profile.telephone} onChange={e => setProfileField('telephone', e.target.value)} placeholder="+965 9000 0000" />
            </div>
            <div className="space-y-1.5">
              <Label>Nationality</Label>
              <Input value={profile.nationality} onChange={e => setProfileField('nationality', e.target.value)} placeholder="e.g. Kuwaiti" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Country of Residence</Label>
            <Input value={profile.residency} onChange={e => setProfileField('residency', e.target.value)} placeholder="e.g. Kuwait" />
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${profileMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {profileMsg.type === 'ok' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2 w-full sm:w-auto">
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* ── Password Change ───────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="w-4 h-4" /> Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={passwords.current} onChange={e => setPasswordField('current', e.target.value)} placeholder="Enter current password" autoComplete="current-password" />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={passwords.newPass} onChange={e => setPasswordField('newPass', e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Password</Label>
            <Input type="password" value={passwords.confirm} onChange={e => setPasswordField('confirm', e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${passwordMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {passwordMsg.type === 'ok' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {passwordMsg.text}
            </div>
          )}

          <Button onClick={handleChangePassword} disabled={savingPassword} variant="outline" className="gap-2 w-full sm:w-auto">
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* ── Account Details ───────────────────────────────── */}
      <Card className="bg-gray-50">
        <CardContent className="p-4 text-xs text-gray-500 space-y-1">
          <p><span className="font-medium">Account ID:</span> {user.id || '—'}</p>
          <p><span className="font-medium">Role:</span> Administrator</p>
        </CardContent>
      </Card>
    </div>
  )
}
