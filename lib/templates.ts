import type { BodyType, Goal, TransformPeriod } from './types'

// Template library: maps body type + goal + period to a curated transformation image
// Replace these URLs with your actual licensed template images in Supabase storage
// Structure: templates[bodyType][goal][period] = imageUrl

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/templates'

type TemplateMap = Record<BodyType, Record<Goal, Record<TransformPeriod, string>>>

export const TEMPLATES: TemplateMap = {
  lean_male: {
    cut:   { '1month': `${BASE}/lean_male_cut_1m.jpg`,   '3months': `${BASE}/lean_male_cut_3m.jpg`,   '6months': `${BASE}/lean_male_cut_6m.jpg`   },
    build: { '1month': `${BASE}/lean_male_build_1m.jpg`, '3months': `${BASE}/lean_male_build_3m.jpg`, '6months': `${BASE}/lean_male_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/lean_male_bulk_1m.jpg`,  '3months': `${BASE}/lean_male_bulk_3m.jpg`,  '6months': `${BASE}/lean_male_bulk_6m.jpg`  },
  },
  average_male: {
    cut:   { '1month': `${BASE}/avg_male_cut_1m.jpg`,   '3months': `${BASE}/avg_male_cut_3m.jpg`,   '6months': `${BASE}/avg_male_cut_6m.jpg`   },
    build: { '1month': `${BASE}/avg_male_build_1m.jpg`, '3months': `${BASE}/avg_male_build_3m.jpg`, '6months': `${BASE}/avg_male_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/avg_male_bulk_1m.jpg`,  '3months': `${BASE}/avg_male_bulk_3m.jpg`,  '6months': `${BASE}/avg_male_bulk_6m.jpg`  },
  },
  overweight_male: {
    cut:   { '1month': `${BASE}/ovw_male_cut_1m.jpg`,   '3months': `${BASE}/ovw_male_cut_3m.jpg`,   '6months': `${BASE}/ovw_male_cut_6m.jpg`   },
    build: { '1month': `${BASE}/ovw_male_build_1m.jpg`, '3months': `${BASE}/ovw_male_build_3m.jpg`, '6months': `${BASE}/ovw_male_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/ovw_male_bulk_1m.jpg`,  '3months': `${BASE}/ovw_male_bulk_3m.jpg`,  '6months': `${BASE}/ovw_male_bulk_6m.jpg`  },
  },
  obese_male: {
    cut:   { '1month': `${BASE}/obese_male_cut_1m.jpg`,   '3months': `${BASE}/obese_male_cut_3m.jpg`,   '6months': `${BASE}/obese_male_cut_6m.jpg`   },
    build: { '1month': `${BASE}/obese_male_build_1m.jpg`, '3months': `${BASE}/obese_male_build_3m.jpg`, '6months': `${BASE}/obese_male_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/obese_male_bulk_1m.jpg`,  '3months': `${BASE}/obese_male_bulk_3m.jpg`,  '6months': `${BASE}/obese_male_bulk_6m.jpg`  },
  },
  lean_female: {
    cut:   { '1month': `${BASE}/lean_female_cut_1m.jpg`,   '3months': `${BASE}/lean_female_cut_3m.jpg`,   '6months': `${BASE}/lean_female_cut_6m.jpg`   },
    build: { '1month': `${BASE}/lean_female_build_1m.jpg`, '3months': `${BASE}/lean_female_build_3m.jpg`, '6months': `${BASE}/lean_female_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/lean_female_bulk_1m.jpg`,  '3months': `${BASE}/lean_female_bulk_3m.jpg`,  '6months': `${BASE}/lean_female_bulk_6m.jpg`  },
  },
  average_female: {
    cut:   { '1month': `${BASE}/avg_female_cut_1m.jpg`,   '3months': `${BASE}/avg_female_cut_3m.jpg`,   '6months': `${BASE}/avg_female_cut_6m.jpg`   },
    build: { '1month': `${BASE}/avg_female_build_1m.jpg`, '3months': `${BASE}/avg_female_build_3m.jpg`, '6months': `${BASE}/avg_female_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/avg_female_bulk_1m.jpg`,  '3months': `${BASE}/avg_female_bulk_3m.jpg`,  '6months': `${BASE}/avg_female_bulk_6m.jpg`  },
  },
  overweight_female: {
    cut:   { '1month': `${BASE}/ovw_female_cut_1m.jpg`,   '3months': `${BASE}/ovw_female_cut_3m.jpg`,   '6months': `${BASE}/ovw_female_cut_6m.jpg`   },
    build: { '1month': `${BASE}/ovw_female_build_1m.jpg`, '3months': `${BASE}/ovw_female_build_3m.jpg`, '6months': `${BASE}/ovw_female_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/ovw_female_bulk_1m.jpg`,  '3months': `${BASE}/ovw_female_bulk_3m.jpg`,  '6months': `${BASE}/ovw_female_bulk_6m.jpg`  },
  },
  obese_female: {
    cut:   { '1month': `${BASE}/obese_female_cut_1m.jpg`,   '3months': `${BASE}/obese_female_cut_3m.jpg`,   '6months': `${BASE}/obese_female_cut_6m.jpg`   },
    build: { '1month': `${BASE}/obese_female_build_1m.jpg`, '3months': `${BASE}/obese_female_build_3m.jpg`, '6months': `${BASE}/obese_female_build_6m.jpg` },
    bulk:  { '1month': `${BASE}/obese_female_bulk_1m.jpg`,  '3months': `${BASE}/obese_female_bulk_3m.jpg`,  '6months': `${BASE}/obese_female_bulk_6m.jpg`  },
  },
}

export function getTemplate(bodyType: BodyType, goal: Goal, period: TransformPeriod): string {
  return TEMPLATES[bodyType]?.[goal]?.[period] ?? TEMPLATES.average_male.build['3months']
}

// Stats microcopy per goal + period
export const STATS: Record<Goal, Record<TransformPeriod, { muscle: string; fat: string }>> = {
  cut: {
    '1month':  { muscle: '+1kg muscle', fat: '-2% body fat' },
    '3months': { muscle: '+3kg muscle', fat: '-6% body fat' },
    '6months': { muscle: '+5kg muscle', fat: '-12% body fat' },
  },
  build: {
    '1month':  { muscle: '+2kg muscle', fat: '-1% body fat' },
    '3months': { muscle: '+5kg muscle', fat: '-3% body fat' },
    '6months': { muscle: '+9kg muscle', fat: '-5% body fat' },
  },
  bulk: {
    '1month':  { muscle: '+3kg muscle', fat: '+1% body fat' },
    '3months': { muscle: '+7kg muscle', fat: '+2% body fat' },
    '6months': { muscle: '+14kg muscle', fat: '+3% body fat' },
  },
}
