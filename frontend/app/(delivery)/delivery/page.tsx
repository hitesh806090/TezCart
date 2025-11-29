'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DeliveryPage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [jobAvailable, setJobAvailable] = useState(true); // For demonstration

  // Mock data for the job request
  const jobData = {
    earnings: '₹85',
    distance: '4.2 km total',
    pickup: 'Star Electronics',
    drop: 'Sector 42'
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold">Delivery Partner</h1>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isOnline ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Today's Earnings Widget */}
      <div className="p-4">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Today&apos;s Earnings</p>
          <p className="text-2xl font-bold text-emerald-400">₹450</p>
        </div>
      </div>

      {/* Job Request Card - Only show when job is available */}
      {jobAvailable && (
        <div className="p-4">
          <Card className="bg-zinc-900 border-zinc-800 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-emerald-400 text-3xl font-bold">{jobData.earnings}</p>
                <p className="text-zinc-400 text-sm mt-1">{jobData.distance}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
                    <div className="w-0.5 h-8 bg-zinc-700"></div>
                    <div className="w-2 h-2 bg-zinc-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-zinc-300"><span className="font-medium">Pickup:</span> {jobData.pickup}</p>
                    <p className="text-zinc-300 mt-2"><span className="font-medium">Drop:</span> {jobData.drop}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => setJobAvailable(false)}
                >
                  Reject
                </Button>
                <Button 
                  className="w-1/2 bg-emerald-500 text-black hover:bg-emerald-400"
                  onClick={() => {
                    setJobAvailable(false);
                    // In a real app, this would navigate to the delivery screen
                  }}
                >
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offline Message - Show when no job is available and delivery partner is offline */}
      {!jobAvailable && !isOnline && (
        <div className="p-4 text-center">
          <p className="text-zinc-500">No active jobs. Turn online to start receiving orders.</p>
        </div>
      )}

      {/* No Jobs Message - Show when no job is available but delivery partner is online */}
      {!jobAvailable && isOnline && (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center">
            <div className="h-3 w-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <p className="text-zinc-400">Looking for orders...</p>
          </div>
        </div>
      )}

      {/* Placeholder content when no job is available to maintain spacing */}
      {!jobAvailable && (
        <div className="p-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
            <p className="text-zinc-400">{isOnline ? 'Searching for nearby orders...' : 'Go online to start receiving orders'}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black border-t border-zinc-800">
        <div className="flex justify-around p-3">
          <button className="flex flex-col items-center text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">History</span>
          </button>
          <button className="flex flex-col items-center text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DeliveryPage;