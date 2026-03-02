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

export default function CustomerProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', telephone: '', nationality: '', residency: '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push('/login'); return }
      setProfile({
        firstName:   user.firstName   || '',
        lastName:    user.lastName    || '',
        telephone:   (user as any).telephone  || '',
        nationality: (user as any).nationality || '',
        residency:   (user as any).residency   || '',
      })
    }
  }, [authLoading, user, router])

  const set = (k: keyof typeof profile, v: string) => setProfile(p => ({ ...p, [k]: v }))
  const setPwd = (k: keyof typeof passwords, v: string) => setPasswords(p => ({ ...p, [k]: v }))

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
    if (passwords.newPass !== passwords.confirm) {
      setPasswordMsg({ type: 'err', text: 'New passwords do not match.' }); return
    }
    if (passwords.newPass.length < 8) {
      setPasswordMsg({ type: 'err', text: 'New password must be at least 8 characters.' }); return
    }
    setSavingPassword(true); setPasswordMsg(null)
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      })
      setPasswordMsg({ type: 'ok', text: 'Password changed successfully.' })
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (e: any) {
      setPasswordMsg({ type: 'err', text: e.response?.data?.error || 'Failed to change password' })
    } finally { setSavingPassword(false) }
  }

  if (authLoading || !user) return null

  const Msg = ({ msg }: { msg: typeof profileMsg }) => msg ? (
    <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      {msg.type === 'ok' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg.text}
    </div>
  ) : null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>

      {/* Profile Info */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input value={profile.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Ahmed" />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input value={profile.lastName}  onChange={e => set('lastName', e.target.value)}  placeholder="Al-Rashidi" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /> Email</Label>
            <Input value={user.email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" /> Phone Number</Label>
            <Input value={profile.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+966 5XX XXX XXXX" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-gray-400" /> Nationality</Label>
              <Input value={profile.nationality} onChange={e => set('nationality', e.target.value)} placeholder="e.g. Saudi Arabian" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-gray-400" /> Country of Residence</Label>
              <Input value={profile.residency}   onChange={e => set('residency', e.target.value)}   placeholder="e.g. Saudi Arabia" />
            </div>
          </div>
          <Msg msg={profileMsg} />
          <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2 bg-teal-600 hover:bg-teal-500">
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={passwords.current} onChange={e => setPwd('current', e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={passwords.newPass} onChange={e => setPwd('newPass', e.target.value)} placeholder="Min. 8 characters" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm New Password</Label>
            <Input type="password" value={passwords.confirm} onChange={e => setPwd('confirm', e.target.value)} placeholder="Re-enter new password" />
          </div>
          <Msg msg={passwordMsg} />
          <Button onClick={handleChangePassword} disabled={savingPassword} variant="outline" className="gap-2">
            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
