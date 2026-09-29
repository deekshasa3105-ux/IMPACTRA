/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HomeOverviewView } from './components/HomeOverviewView';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#080403] text-slate-100 antialiased selection:bg-orange-500 selection:text-white overflow-hidden">
      {/* Seamless Single Hero Canvas (Top banner removed as requested) */}
      <main className="flex-1 flex flex-col">
        <HomeOverviewView />
      </main>
    </div>
  );
}
