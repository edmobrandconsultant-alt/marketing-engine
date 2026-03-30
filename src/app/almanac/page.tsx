'use client';

import { useState } from 'react';
import { plants } from '@/data/plants';
import { biodiversityFeatures } from '@/data/biodiversity-features';
import { getCurrentSeason, canPlantInSeason } from '@/game/seasons';
import { BottomNav } from '@/components/ui/BottomNav';
import { ResourceBar } from '@/components/ui/ResourceBar';
import { plantMap } from '@/data/plants';
import { getFeedingLevel, getFamilyEmoji, getPlantFamily, getFamilyName, ROTATION_EDUCATIONAL } from '@/game/crop-rotation';

type Tab = 'plants' | 'companions' | 'rotation' | 'biodiversity';

export default function AlmanacPage() {
  const [tab, setTab] = useState<Tab>('plants');
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const season = getCurrentSeason();

  const plant = selectedPlant ? plantMap.get(selectedPlant) : null;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-green-50">
      <ResourceBar />

      {/* Header */}
      <div className="bg-emerald-800 px-4 py-3">
        <h1 className="text-white font-bold text-lg">Plant Almanac</h1>
        <p className="text-emerald-300 text-xs">Your guide to growing and biodiversity</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-emerald-700">
        {(['plants', 'companions', 'rotation', 'biodiversity'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedPlant(null); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${
              tab === t ? 'bg-emerald-600 text-white' : 'text-emerald-300'
            }`}
          >
            {t === 'plants' ? '🌱 Plants' : t === 'companions' ? '🤝 Pairs' : t === 'rotation' ? '🔄 Rotation' : '🌸 Wildlife'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollable pb-20 p-3">
        {/* PLANTS TAB */}
        {tab === 'plants' && !plant && (
          <div className="grid grid-cols-2 gap-2">
            {plants.map(p => {
              const inSeason = canPlantInSeason(p.season, season);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlant(p.id)}
                  className="bg-white p-3 rounded-lg pixel-border-thin text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.sprite[3]}</span>
                    <div>
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{p.type}</div>
                    </div>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {inSeason && (
                      <span className="text-[8px] px-1 bg-green-100 text-green-700 rounded">In Season</span>
                    )}
                    <span className="text-[8px] px-1 bg-gray-100 text-gray-500 rounded">{p.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* PLANT DETAIL */}
        {tab === 'plants' && plant && (
          <div className="space-y-3">
            <button
              onClick={() => setSelectedPlant(null)}
              className="text-emerald-600 text-xs font-bold"
            >
              &larr; Back to all plants
            </button>

            <div className="bg-white p-4 rounded-lg pixel-border text-center">
              <div className="flex justify-center gap-3 text-3xl mb-2">
                {plant.sprite.map((s, i) => (
                  <span key={i} className="opacity-80">{s}</span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-emerald-900">{plant.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{plant.description}</p>
            </div>

            <div className="bg-white p-3 rounded-lg pixel-border-thin space-y-2">
              <h3 className="font-bold text-sm text-emerald-800">Growing Info</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Type:</span> <span className="font-bold capitalize">{plant.type}</span></div>
                <div><span className="text-gray-500">Water:</span> <span className="font-bold capitalize">{plant.waterNeeds}</span></div>
                <div><span className="text-gray-500">Difficulty:</span> <span className="font-bold capitalize">{plant.difficulty}</span></div>
                <div><span className="text-gray-500">Growth:</span> <span className="font-bold">{plant.growthTimeMinutes}min</span></div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Seasons: </span>
                {plant.season.map(s => (
                  <span key={s} className={`text-[10px] px-1 mx-0.5 rounded ${
                    s === season ? 'bg-green-200 text-green-800 font-bold' : 'bg-gray-100 text-gray-500'
                  }`}>{s}</span>
                ))}
              </div>
            </div>

            {plant.companionIds.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg pixel-border-thin">
                <h3 className="font-bold text-sm text-green-800 mb-1">Good Companions</h3>
                <div className="flex flex-wrap gap-1">
                  {plant.companionIds.map(id => {
                    const comp = plantMap.get(id);
                    return comp ? (
                      <span key={id} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {comp.sprite[3]} {comp.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {plant.antagonistIds.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg pixel-border-thin">
                <h3 className="font-bold text-sm text-red-800 mb-1">Keep Apart</h3>
                <div className="flex flex-wrap gap-1">
                  {plant.antagonistIds.map(id => {
                    const ant = plantMap.get(id);
                    return ant ? (
                      <span key={id} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        {ant.sprite[3]} {ant.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="bg-amber-50 p-3 rounded-lg pixel-border-thin">
              <h3 className="font-bold text-sm text-amber-800 mb-1">Real Growing Tip</h3>
              <p className="text-xs text-amber-700">{plant.realWorldTip}</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg pixel-border-thin">
              <h3 className="font-bold text-sm text-purple-800 mb-1">Fun Fact</h3>
              <p className="text-xs text-purple-700">{plant.funFact}</p>
            </div>
          </div>
        )}

        {/* COMPANIONS TAB */}
        {tab === 'companions' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 mb-2">
              Companion planting means growing plants that help each other. Green pairs grow well together, red pairs should be kept apart!
            </p>
            {plants.filter(p => p.companionIds.length > 0).map(p => (
              <div key={p.id} className="bg-white p-3 rounded-lg pixel-border-thin">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{p.sprite[3]}</span>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
                {p.companionIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {p.companionIds.map(id => {
                      const comp = plantMap.get(id);
                      return comp ? (
                        <span key={id} className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          {comp.sprite[3]} {comp.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {p.antagonistIds.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.antagonistIds.map(id => {
                      const ant = plantMap.get(id);
                      return ant ? (
                        <span key={id} className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                          {ant.sprite[3]} {ant.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ROTATION TAB - Dowding's No-Dig Approach */}
        {tab === 'rotation' && (
          <div className="space-y-3">
            {/* Dowding intro */}
            <div className="bg-emerald-50 p-3 rounded-lg pixel-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👨‍🌾</span>
                <h3 className="font-bold text-sm text-emerald-900">Charles Dowding&apos;s No-Dig Rotation</h3>
              </div>
              <div className="text-xs text-emerald-700 leading-relaxed whitespace-pre-line">
                {ROTATION_EDUCATIONAL}
              </div>
            </div>

            {/* Feeding levels guide */}
            <div className="bg-white p-3 rounded-lg pixel-border-thin">
              <h3 className="font-bold text-sm text-gray-800 mb-2">Plant Feeding Levels</h3>
              <p className="text-[10px] text-gray-600 mb-2">
                Dowding groups plants by how much they take from the soil. Follow hungry feeders with nitrogen-fixers for best results!
              </p>

              {/* Heavy feeders */}
              <div className="mb-2">
                <div className="text-[10px] font-bold text-red-700 mb-1">🔴 Hungry Feeders</div>
                <div className="flex flex-wrap gap-1">
                  {plants.filter(p => getFeedingLevel(p.id) === 'heavy').map(p => (
                    <span key={p.id} className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                      {p.sprite[3]} {p.name}
                    </span>
                  ))}
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">Need lots of nutrients. Follow with legumes.</p>
              </div>

              {/* Moderate feeders */}
              <div className="mb-2">
                <div className="text-[10px] font-bold text-amber-700 mb-1">🟡 Moderate Feeders</div>
                <div className="flex flex-wrap gap-1">
                  {plants.filter(p => getFeedingLevel(p.id) === 'moderate').map(p => (
                    <span key={p.id} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {p.sprite[3]} {p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Light feeders */}
              <div className="mb-2">
                <div className="text-[10px] font-bold text-green-700 mb-1">🟢 Light Feeders</div>
                <div className="flex flex-wrap gap-1">
                  {plants.filter(p => getFeedingLevel(p.id) === 'light').map(p => (
                    <span key={p.id} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {p.sprite[3]} {p.name}
                    </span>
                  ))}
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">Can repeat in the same spot, especially in no-dig beds.</p>
              </div>

              {/* Nitrogen fixers */}
              <div className="mb-1">
                <div className="text-[10px] font-bold text-emerald-700 mb-1">⭐ Nitrogen Fixers (Givers)</div>
                <div className="flex flex-wrap gap-1">
                  {plants.filter(p => getFeedingLevel(p.id) === 'giver').map(p => (
                    <span key={p.id} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                      {p.sprite[3]} {p.name}
                    </span>
                  ))}
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">Leave nitrogen in the soil for the next crop. Leave roots in the ground after harvest!</p>
              </div>
            </div>

            {/* Plant families */}
            <div className="bg-white p-3 rounded-lg pixel-border-thin">
              <h3 className="font-bold text-sm text-gray-800 mb-2">Plant Families</h3>
              <p className="text-[10px] text-gray-600 mb-2">
                Brassicas and nightshades benefit most from rotation. Other families can repeat more freely in no-dig beds.
              </p>
              {(['solanaceae', 'brassica', 'legume', 'allium', 'umbelliferae'] as const).map(family => {
                const familyPlants = plants.filter(p => getPlantFamily(p.id) === family);
                if (familyPlants.length === 0) return null;
                const sensitive = family === 'solanaceae' || family === 'brassica';
                return (
                  <div key={family} className={`mb-2 p-2 rounded ${sensitive ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <span>{getFamilyEmoji(family)}</span>
                      <span className="text-[10px] font-bold text-gray-800">{getFamilyName(family)} Family</span>
                      {sensitive && <span className="text-[8px] bg-amber-200 text-amber-800 px-1 rounded">Rotate!</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {familyPlants.map(p => (
                        <span key={p.id} className="text-[10px] bg-white px-1.5 py-0.5 rounded">
                          {p.sprite[3]} {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dowding's simple sequence */}
            <div className="bg-amber-50 p-3 rounded-lg pixel-border-thin">
              <h3 className="font-bold text-sm text-amber-800 mb-2">Dowding&apos;s Simple Sequence</h3>
              <div className="space-y-1 text-xs text-amber-700">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>🫘 <strong>Legumes</strong> (peas, beans) — fix nitrogen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>🥬 <strong>Brassicas</strong> (cabbage, radish) — use the nitrogen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>🥕 <strong>Roots &amp; alliums</strong> (carrots, onions) — lighter needs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>🍅 <strong>Nightshades</strong> (tomatoes, potatoes) — hungry feeders</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-600 mt-2">
                Then back to legumes! Add compost between each crop and never leave soil bare.
              </p>
            </div>
          </div>
        )}

        {/* BIODIVERSITY TAB */}
        {tab === 'biodiversity' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 mb-2">
              Build these features in your garden to help wildlife and boost your plants!
            </p>
            {biodiversityFeatures.map(f => (
              <div key={f.id} className="bg-white p-3 rounded-lg pixel-border-thin">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{f.sprite}</span>
                  <div>
                    <div className="font-bold text-sm">{f.name}</div>
                    <div className="text-[10px] text-emerald-600">{f.bonus.description}</div>
                  </div>
                </div>
                <div className="bg-amber-50 p-2 rounded text-[10px] text-amber-700 mb-1">
                  <span className="font-bold">Tip:</span> {f.realWorldTip}
                </div>
                <div className="bg-purple-50 p-2 rounded text-[10px] text-purple-700">
                  <span className="font-bold">Fact:</span> {f.funFact}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
