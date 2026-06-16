import type { Story } from '../types';

const generateScript = (text: string, totalDuration: number) => {
  const sentences = text.split(/[。！？]/).filter(s => s.trim());
  const lineDuration = totalDuration / sentences.length;
  
  return sentences.map((text, index) => ({
    id: `line-${index}`,
    text: text.trim() + '。',
    startTime: index * lineDuration,
    endTime: (index + 1) * lineDuration,
  }));
};

const fairyTaleText = `在很远很远的森林里，住着一只圆嘟嘟的小熊。
它有一双亮晶晶的眼睛，和一个软软的大肚子。
每天晚上，小熊都会躺在草地上看星星。
星星们一闪一闪的，好像在跟小熊说晚安。
有一天，一颗小星星从天上掉了下来。
小星星说：我迷路了，你能帮我找到回家的路吗？
小熊点点头，抱着小星星开始了旅程。
它们穿过了开满花朵的草地。
它们跨过了清澈见底的小溪。
它们爬上了最高最高的山顶。
在山顶上，小熊看到了整片星空。
小星星开心地说：谢谢你，小熊！我看到我的家了！
小星星慢慢地飞回了天上。
它变成了最亮最亮的那颗星星。
从那以后，每天晚上，最亮的星星都会对着小熊眨眼睛。
小熊也会对着星星挥挥它圆滚滚的小爪子。
然后，小熊就打个大大的哈欠。
翻个身，抱着软软的枕头。
慢慢地，慢慢地进入了甜甜的梦乡。
晚安，小熊。晚安，小星星。
愿每一个小朋友，都能做一个最美最美的梦。`;

const natureStoryText = `夜深了，森林里静悄悄的。
月亮婆婆轻轻地拨开云朵，露出温柔的笑脸。
银色的月光洒在树叶上，好像给树叶披上了一层薄纱。
小溪潺潺地流着，唱着轻柔的摇篮曲。
叮咚，叮咚，水花在石头上跳着舞。
树林里，猫头鹰站在树枝上，眨着圆圆的大眼睛。
它在站岗，保护着森林里的小动物们。
小松鼠缩在树洞里，抱着蓬松的大尾巴。
它今天收集了好多松果，睡得可香了。
小兔子蜷在草丛里，耳朵轻轻地耷拉着。
它梦见自己在胡萝卜田里奔跑。
萤火虫提着小灯笼，在夜空中飞来飞去。
一闪，一闪，好像天上的星星掉到了草地上。
风轻轻地吹过，树叶沙沙地响。
好像在说：睡吧，睡吧，我亲爱的宝贝。
所有的小动物都睡着了。
森林里只剩下小溪的歌声和风声。
还有月亮婆婆，一直在天上守护着大家。
晚安，森林。晚安，所有的小动物们。
明天，太阳公公会带来新的一天。`;

const whiteNoiseText = `这是一个安静的夜晚。
你听，外面下起了小雨。
滴滴答答，滴滴答答。
雨点轻轻地敲打着窗户。
好像在唱一首温柔的歌。
闭上眼睛，放松你的身体。
让思绪慢慢地飘远。
想象自己躺在一片柔软的云朵上。
云朵轻轻地摇啊摇。
雨还在下，淅淅沥沥。
空气中弥漫着泥土的清香。
深呼吸，再深呼吸。
感受雨水带来的宁静。
所有的烦恼都被雨水冲走了。
只剩下平静和安宁。
继续听着雨声。
慢慢地，慢慢地。
你的眼皮越来越重。
身体越来越放松。
就这样，静静地。
进入甜美的梦乡。`;

const starryNightText = `夜空里有无数颗小星星。
它们一闪一闪的，好像在眨眼睛。
银河像一条银色的丝带，横跨在夜空中。
流星划过天际，留下一道美丽的光迹。
你躺在草地上，仰望着星空。
周围是那么安静，那么美好。
一颗小星星对你说：许个愿吧。
你闭上眼睛，许下了一个甜甜的愿望。
小星星说：你的愿望一定会实现的。
说完，它就眨了眨眼睛。
夜风吹过，带着青草的香味。
你感觉自己轻飘飘的，好像要飞起来一样。
飞啊飞，飞到了星星中间。
星星们围着你跳舞，唱歌。
它们的歌声轻轻的，柔柔的。
听着听着，你就睡着了。
在星星的怀抱里，做了一个美美的梦。
晚安，小星星。晚安，小宝贝。
愿你今晚有一个最甜的梦。`;

const oceanDreamText = `蓝色的大海，在月光下闪闪发光。
海浪轻轻地拍打着沙滩。
哗——哗——
一下，又一下，那么有节奏。
你躺在沙滩上，听着海浪的声音。
海风轻轻地吹过，带着咸咸的味道。
远处，有一艘小船在海面上漂啊漂。
船上点着一盏小灯，一闪一闪的。
海豚在海里游泳，它们跳出水面，又钻回去。
溅起的水花在月光下像珍珠一样。
珊瑚礁里，小鱼们都睡着了。
它们随着海水轻轻地摇啊摇。
海浪的声音，像是大海在唱歌。
唱着一首温柔的摇篮曲。
睡吧，睡吧，我亲爱的宝贝。
大海会保护你的梦。
梦里，你变成了一条小鱼。
在蓝色的海里，自由地游来游去。
晚安，大海。晚安，小宝贝。
愿你的梦像大海一样蓝，一样美。`;

const forestLullabyText = `古老的森林里，住着许多小精灵。
它们有着透明的翅膀，和闪闪的眼睛。
每当夜晚来临，小精灵们就会出来。
它们在花丛中飞舞，在树叶间穿梭。
今晚，小精灵们要开一个音乐会。
萤火虫提着小灯笼来照明。
蟋蟀拉着小提琴，伴奏着美妙的音乐。
小精灵们轻轻地唱着歌。
歌声那么轻，那么柔，像羽毛一样。
花朵听着听着，就合上了花瓣睡着了。
小草听着听着，就弯下腰睡着了。
大树听着听着，叶子也不摇晃了。
整个森林都安静下来了。
只有小精灵的歌声，还在轻轻地飘着。
飘啊飘，飘到了你的耳边。
你听，它们在唱什么呢？
它们在唱：睡吧，睡吧，可爱的小朋友。
梦里会有甜甜的糖果，和会飞的独角兽。
晚安，小精灵。晚安，大森林。
晚安，每一个听话的好孩子。`;

export const stories: Story[] = [
  {
    id: 'fairy-1',
    title: '小熊和小星星',
    category: 'fairy',
    duration: 300,
    ageRange: '3-6岁',
    petRecommendation: '这是我最喜欢的故事！星星好温柔~',
    coverColor: 'from-purple-400 to-pink-400',
    coverEmoji: '🐻✨',
    audioUrl: '/audio/stories/fairy-1.mp3',
    script: generateScript(fairyTaleText, 300),
  },
  {
    id: 'nature-1',
    title: '森林的夜晚',
    category: 'nature',
    duration: 280,
    ageRange: '2-5岁',
    petRecommendation: '森林里的小动物们都好可爱呀～',
    coverColor: 'from-green-400 to-teal-400',
    coverEmoji: '🌲🌙',
    audioUrl: '/audio/stories/nature-1.mp3',
    script: generateScript(natureStoryText, 280),
  },
  {
    id: 'whitenoise-1',
    title: '雨声沙沙',
    category: 'whitenoise',
    duration: 600,
    ageRange: '全年龄',
    petRecommendation: '听着雨声睡觉最舒服了zzz',
    coverColor: 'from-blue-400 to-cyan-400',
    coverEmoji: '🌧️💤',
    audioUrl: '/audio/stories/whitenoise-1.mp3',
    script: generateScript(whiteNoiseText, 600),
  },
  {
    id: 'fairy-2',
    title: '星空下的梦',
    category: 'fairy',
    duration: 320,
    ageRange: '3-7岁',
    petRecommendation: '星星会唱歌哦！你听得到吗？',
    coverColor: 'from-indigo-400 to-purple-400',
    coverEmoji: '⭐🌙',
    audioUrl: '/audio/stories/fairy-2.mp3',
    script: generateScript(starryNightText, 320),
  },
  {
    id: 'nature-2',
    title: '海浪摇篮曲',
    category: 'nature',
    duration: 260,
    ageRange: '0-4岁',
    petRecommendation: '大海的声音最治愈啦~',
    coverColor: 'from-blue-500 to-indigo-400',
    coverEmoji: '🌊🐚',
    audioUrl: '/audio/stories/nature-2.mp3',
    script: generateScript(oceanDreamText, 260),
  },
  {
    id: 'whitenoise-2',
    title: '精灵的歌声',
    category: 'whitenoise',
    duration: 480,
    ageRange: '全年龄',
    petRecommendation: '小精灵会在你梦里跳舞哦～',
    coverColor: 'from-emerald-400 to-green-400',
    coverEmoji: '🧚🎵',
    audioUrl: '/audio/stories/whitenoise-2.mp3',
    script: generateScript(forestLullabyText, 480),
  },
];

export const getStoryById = (id: string): Story | undefined => {
  return stories.find(story => story.id === id);
};

export const getStoriesByCategory = (category: string): Story[] => {
  if (category === 'all') return stories;
  return stories.filter(story => story.category === category);
};
