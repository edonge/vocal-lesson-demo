export const genres = ['발라드', 'R&B', '락/밴드', '팝송', '인디', 'KPOP/아이돌', '뮤지컬'];
export const goals = ['입시', '취미', '축가/행사', '오디션', '녹음/커버'];
export const facilities = ['연습실', '작업실', '레코딩룸', '주차공간'];
export const tags = [
  '취미',
  '입시',
  '오디션',
  '발라드',
  'Kpop',
  '남성 전문',
  '발성',
  '고음',
  '호흡',
  '녹음',
  '톤',
  '무대',
  '입문',
];

export const locationSeed = [
  { id: 'district-mapo', name: '마포구', neighborhoods: ['서교동', '합정동', '연남동'] },
  { id: 'district-seongdong', name: '성동구', neighborhoods: ['행당1동', '성수1가1동', '옥수동'] },
  { id: 'district-gangnam', name: '강남구', neighborhoods: ['신사동', '청담동', '역삼1동'] },
  { id: 'district-songpa', name: '송파구', neighborhoods: ['잠실본동', '방이2동', '석촌동'] },
  { id: 'district-seocho', name: '서초구', neighborhoods: ['서초1동', '방배본동', '반포4동'] },
  { id: 'district-yongsan', name: '용산구', neighborhoods: ['한남동', '이태원1동', '청파동'] },
  { id: 'district-gangseo', name: '강서구', neighborhoods: ['화곡1동', '발산1동', '등촌1동'] },
];

export function neighborhoodId(districtId: string, name: string) {
  const slugMap: Record<string, string> = {
    합정동: 'hapjeong',
    서교동: 'seogyo',
    연남동: 'yeonnam',
    행당1동: 'haengdang1',
    성수1가1동: 'seongsu1',
    옥수동: 'oksu',
    신사동: 'sinsa',
    청담동: 'cheongdam',
    역삼1동: 'yeoksam1',
    잠실본동: 'jamsil',
    방이2동: 'bangi2',
    석촌동: 'seokchon',
    서초1동: 'seocho1',
    방배본동: 'bangbae',
    반포4동: 'banpo4',
    한남동: 'hannam',
    이태원1동: 'itaewon1',
    청파동: 'cheongpa',
    화곡1동: 'hwagok1',
    발산1동: 'balsan1',
    등촌1동: 'deungchon1',
  };
  return `${districtId}-${slugMap[name] ?? name}`;
}
