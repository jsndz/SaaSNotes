'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function UpgradeBanner() {
  const { user, tenant } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();

  if (!tenant || tenant.plan !== 'free' || tenant.noteCount < tenant.maxNotes) {
    return null;
  }

  const handleUpgrade = async () => {
    if (user?.role !== 'admin') return;
    
    setIsUpgrading(true);
    try {
      await apiClient.upgradeTenant(tenant.slug);
      // Refresh the page to update tenant info
      router.refresh();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800">
                Note limit reached
              </h3>
              <p className="text-sm text-amber-700">
                You've reached the {tenant.maxNotes} note limit for the Free plan.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user?.role === 'admin' ? (
              <Button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}
              </Button>
            ) : (
              <div className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-md">
                Ask your Admin to upgrade
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}