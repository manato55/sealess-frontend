const DEPARTMENT: string[] = [
  '経営企画部',
  '開発部',
  'キャリア採用部',
  '財務経理部',
  '建設ICT事業部',
  '情報共有システム事業部',
  'マーケティング部',
];

const SECTION: {
  management: string[];
  dev: string[];
} = {
  management: [
    '新ソリューション推進課１',
    '新ソリューション推進課２',
    'ブランディング推進室',
    '総務・労務課',
    'WEB制作課',
  ],
  dev: ['本社開発室', '静岡開発室', '名古屋開発室', '札幌開発室'],
};

const JOBTITLE: string[] = [
  '部長',
  '課長',
  '係長',
  '主任',
  'リーダー',
  'エキスパート',
  'シニアエキスパート',
];

export { DEPARTMENT, SECTION, JOBTITLE };
