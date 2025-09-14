'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, FileText, Sparkles, Settings, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const { user, tenant } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [stats, setStats] = useState({
    totalNotes: 0,
    activeUsers: 0,
    storageUsed: '12.3 MB',
    lastActivity: '2 hours ago'
  });

  useEffect(() => {
    // Load admin stats
    if (tenant) {
      setStats(prev => ({
        ...prev,
        totalNotes: tenant.noteCount,
        activeUsers: 3 // Mock data
      }));
    }
  }, [tenant]);

  const handleUpgrade = async () => {
    if (!tenant) return;
    
    setIsUpgrading(true);
    try {
      await apiClient.upgradeTenant(tenant.slug);
      window.location.reload(); // Refresh to get updated tenant info
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!tenant) return null;

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your workspace settings and subscription
              </p>
            </div>

            {/* Plan Status Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {tenant.plan === 'pro' ? (
                        <>
                          <Crown className="h-5 w-5 text-yellow-600" />
                          <span>Pro Plan</span>
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Active</Badge>
                        </>
                      ) : (
                        <>
                          <Settings className="h-5 w-5 text-gray-600" />
                          <span>Free Plan</span>
                          <Badge variant="secondary">Current</Badge>
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {tenant.plan === 'pro' 
                        ? 'Unlimited notes and advanced features'
                        : `${tenant.noteCount}/${tenant.maxNotes} notes used`
                      }
                    </CardDescription>
                  </div>
                  
                  {tenant.plan === 'free' && (
                    <Button 
                      onClick={handleUpgrade} 
                      disabled={isUpgrading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              {tenant.plan === 'free' && (
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Unlock Pro Features</h3>
                    <ul className="text-sm text-blue-800 space-y-1 mb-3">
                      <li>• Unlimited notes</li>
                      <li>• Advanced collaboration tools</li>
                      <li>• Priority support</li>
                      <li>• Export capabilities</li>
                    </ul>
                    <div className="text-lg font-bold text-blue-900">
                      $9.99/month
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNotes}</div>
                  <p className="text-xs text-muted-foreground">
                    {tenant.plan === 'free' ? `${tenant.maxNotes - stats.totalNotes} remaining` : 'Unlimited'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {tenant.plan === 'free' ? '3 max' : 'Unlimited'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.storageUsed}</div>
                  <p className="text-xs text-muted-foreground">
                    {tenant.plan === 'free' ? 'of 100 MB' : 'Unlimited'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">{stats.lastActivity}</p>
                </CardContent>
              </Card>
            </div>

            {/* Workspace Info */}
            <Card>
              <CardHeader>
                <CardTitle>Workspace Information</CardTitle>
                <CardDescription>Details about your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Workspace Name</label>
                    <div className="mt-1 text-sm text-gray-900">{tenant.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Workspace Slug</label>
                    <div className="mt-1 text-sm text-gray-900 font-mono">{tenant.slug}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your Role</label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plan Status</label>
                    <div className="mt-1">
                      <Badge 
                        variant={tenant.plan === 'pro' ? 'default' : 'secondary'}
                        className={tenant.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                      >
                        {tenant.plan === 'pro' ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            Pro
                          </>
                        ) : (
                          'Free'
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}