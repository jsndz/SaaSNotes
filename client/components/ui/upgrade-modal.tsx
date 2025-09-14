'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crown, Sparkles, Check, X } from 'lucide-react';
import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { user, tenant } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    if (user?.role !== 'admin') return;
    
    setIsUpgrading(true);
    try {
      await apiClient.upgradeTenant(tenant?.slug || '');
      // Refresh the page to update tenant info
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const features = [
    { name: 'Unlimited Notes', included: true },
    { name: 'Advanced Search', included: true },
    { name: 'Priority Support', included: true },
    { name: 'Team Collaboration', included: true },
    { name: 'Export Options', included: true },
  ];

  const freeFeatures = [
    { name: '3 Notes Maximum', included: false },
    { name: 'Basic Search', included: false },
    { name: 'Community Support', included: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-amber-600" />
            <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            You've reached the free plan limit. Upgrade to Pro to create unlimited notes and unlock premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Current Plan: Free</h3>
                <p className="text-sm text-gray-600">
                  {tenant?.noteCount || 0} / {tenant?.maxNotes || 3} notes used
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-400">$0</div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
          </div>

          {/* Pro Plan Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Pro Plan Features</h3>
            </div>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free Plan Limitations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Free Plan Limitations</h3>
            <div className="space-y-3">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan Pricing */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Pro Plan</h3>
                <p className="text-sm text-gray-600">Unlimited everything</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">$9</div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          {user?.role === 'admin' ? (
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}
            </Button>
          ) : (
            <div className="w-full sm:w-auto text-center">
              <div className="text-sm text-amber-700 bg-amber-100 px-4 py-2 rounded-md">
                Ask your Admin to upgrade
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
