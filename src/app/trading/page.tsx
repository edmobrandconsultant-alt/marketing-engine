'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Modal } from '@/components/ui/Modal';
import { getMarketDayTraders } from '@/data/trading';
import type { NPCTrader, TradeOffer } from '@/data/trading';
import { getItemById } from '@/data/character-items';

function ItemBadge({ itemId, owned }: { itemId: string; owned: boolean }) {
  const item = getItemById(itemId);
  if (!item) return <span className="text-xs text-stone-400">{itemId}</span>;
  return (
    <span className={`
      inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium
      ${owned ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}
    `}>
      <span>{item.emoji}</span>
      <span className="truncate max-w-[80px]">{item.name}</span>
    </span>
  );
}

export default function TradingPage() {
  const router = useRouter();
  const gameStarted = useGameStore(s => s.gameStarted);
  const unlockedItems = useGameStore(s => s.unlockedItems);
  const executeTrade = useGameStore(s => s.executeTrade);
  const tradeHistory = useGameStore(s => s.tradeHistory);
  const checkItemUnlocks = useGameStore(s => s.checkItemUnlocks);

  const [selectedTrader, setSelectedTrader] = useState<NPCTrader | null>(null);
  const [tradeResult, setTradeResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!gameStarted) {
      router.push('/');
      return;
    }
    checkItemUnlocks();
  }, [gameStarted, router, checkItemUnlocks]);

  if (!gameStarted) return null;

  const traders = getMarketDayTraders();

  function canAffordTrade(offer: TradeOffer): boolean {
    // Check player has all requested items
    const available = [...unlockedItems];
    for (const reqItem of offer.requestedItems) {
      const idx = available.indexOf(reqItem);
      if (idx === -1) return false;
      available.splice(idx, 1);
    }
    return true;
  }

  function alreadyTraded(offerId: string): boolean {
    return tradeHistory.some(t => t.itemReceived.includes(offerId) || t.itemGiven.includes(offerId));
  }

  function handleTrade(traderId: string, offer: TradeOffer) {
    const success = executeTrade(traderId, offer.id);
    if (success) {
      const receivedNames = offer.offeredItems.map(id => getItemById(id)?.name ?? id).join(', ');
      setTradeResult({ success: true, message: `Trade complete! You received: ${receivedNames}` });
    } else {
      setTradeResult({ success: false, message: 'You don\'t have the items needed for this trade.' });
    }
  }

  return (
    <div className="h-full flex flex-col">
      <ResourceBar />

      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {/* Market Day Header */}
        <div className="bg-amber-50 pixel-border rounded-lg p-3 mb-4 text-center">
          <h1 className="font-bold text-lg text-amber-900">🏪 Market Day</h1>
          <p className="text-xs text-amber-700 mt-1">
            Local growers have gathered to trade! Browse their wares and swap items.
          </p>
        </div>

        {/* Player Inventory Summary */}
        <div className="bg-emerald-50 pixel-border-thin rounded-lg p-2 mb-4">
          <h3 className="text-xs font-bold text-emerald-800 mb-1">Your Items ({unlockedItems.length})</h3>
          <div className="flex flex-wrap gap-1">
            {unlockedItems.length === 0 ? (
              <p className="text-xs text-stone-400">No items yet — keep growing to unlock items!</p>
            ) : (
              unlockedItems.map((id, i) => {
                const item = getItemById(id);
                return item ? (
                  <span key={`${id}-${i}`} className="text-lg" title={item.name}>{item.emoji}</span>
                ) : null;
              })
            )}
          </div>
        </div>

        {/* Trader Cards */}
        <div className="space-y-3">
          {traders.map(trader => (
            <button
              key={trader.id}
              onClick={() => setSelectedTrader(trader)}
              className="w-full text-left bg-white pixel-border rounded-lg p-3 hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{trader.sprite}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-emerald-900">{trader.name}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{trader.specialty}</p>
                  <div className="text-[10px] text-emerald-600 mt-1">
                    {trader.offers.length} trade{trader.offers.length !== 1 ? 's' : ''} available
                  </div>
                </div>
                <span className="text-emerald-400 text-lg">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trader Detail Modal */}
      <Modal
        isOpen={!!selectedTrader}
        onClose={() => setSelectedTrader(null)}
        title={selectedTrader ? `${selectedTrader.sprite} ${selectedTrader.name}` : ''}
      >
        {selectedTrader && (
          <div>
            <p className="text-xs text-stone-600 mb-3">{selectedTrader.specialty}</p>

            <div className="space-y-3">
              {selectedTrader.offers.map(offer => {
                const canAfford = canAffordTrade(offer);
                const alreadyDone = tradeHistory.some(
                  t => t.traderId === selectedTrader.id &&
                    t.itemReceived === offer.offeredItems.join(',')
                );

                return (
                  <div
                    key={offer.id}
                    className={`
                      p-3 rounded-lg border-2
                      ${alreadyDone
                        ? 'bg-stone-100 border-stone-200 opacity-50'
                        : canAfford
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-white border-stone-200'
                      }
                    `}
                  >
                    {/* Speech bubble */}
                    <p className="text-xs text-stone-700 italic mb-2">
                      &quot;{offer.message}&quot;
                    </p>

                    {/* Trade details */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase text-stone-500 mb-0.5">You give</div>
                        <div className="flex flex-wrap gap-1">
                          {offer.requestedItems.map((id, i) => (
                            <ItemBadge key={`${id}-${i}`} itemId={id} owned={unlockedItems.includes(id)} />
                          ))}
                        </div>
                      </div>
                      <span className="text-lg">↔️</span>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase text-stone-500 mb-0.5">You get</div>
                        <div className="flex flex-wrap gap-1">
                          {offer.offeredItems.map((id, i) => (
                            <ItemBadge key={`${id}-${i}`} itemId={id} owned={false} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Trade button */}
                    {alreadyDone ? (
                      <div className="text-xs text-stone-400 font-bold text-center">Already traded</div>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleTrade(selectedTrader.id, offer)}
                        className="pixel-btn bg-emerald-600 text-white px-4 py-1.5 text-xs w-full"
                      >
                        Accept Trade
                      </button>
                    ) : (
                      <div className="text-xs text-red-400 font-bold text-center">
                        You need the items above to trade
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* Trade Result Modal */}
      <Modal
        isOpen={!!tradeResult}
        onClose={() => setTradeResult(null)}
        title={tradeResult?.success ? 'Trade Complete!' : 'Trade Failed'}
      >
        {tradeResult && (
          <div className="text-center py-2">
            <span className="text-4xl mb-2 block">{tradeResult.success ? '🤝' : '❌'}</span>
            <p className="text-sm text-stone-700">{tradeResult.message}</p>
          </div>
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}
