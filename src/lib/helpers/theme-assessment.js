import {dig, mutable} from "lib/helpers/object";

const idToName = {
  "3f715970-6fff-4852-853f-ce3dc9291b32": "Action-Taker",
  "5f36d2be-d06f-4f11-9450-e749e5fc19d6": "Analyzer",
  "eed19717-2014-48ec-b520-bb71f96ebc78": "Inventor",
  "a88cd7e9-11b7-4a5c-b190-4b343e30344c": "Mentor",
  "b397ab57-b128-47d6-ac2c-46f5574107b2": "Naturalist",
  "c47d1d99-8f08-44a7-acee-9047732aee29": "Planner",
  "55071620-bca6-4f15-b466-de8733a834a8": "Visionary"
};
const baseURL = "https://cdn.traitify.com/widgets/career-deck";
const blendToVideo = (blend) => {
  const name1 = idToName[blend.personality_type_1.id];
  const name2 = idToName[blend.personality_type_2.id];
  if(!name1 || !name2) { return; }

  const names = [name1, name2].map((name) => name.toLowerCase()).sort();

  // TODO: Sort? Do we remove it or do they have videos in both orders
  // TODO: Actually put videos here
  // TODO: captions, thumbnail
  if(names) { return "https://cdn.traitify.com/content/paradox-archetype-videos/GamesmanV2.mp4"; }
  return `${baseURL}/videos/${names.join("/")}.mp4`;
};
const nameToBadge = (name, {style} = {style: "black"}) => (
  `${baseURL}/badges/${style}/${name.toLowerCase()}.png`
);
const themeType = (type) => {
  if(!type) { return type; }

  const name = idToName[type.id];
  if(!name) { return type; }

  const blackBadge = nameToBadge(name);
  const {badge} = type;
  badge.image_large = blackBadge;
  badge.image_medium = blackBadge;
  badge.image_small = blackBadge;

  const details = type.details || [];
  details.push({body: nameToBadge(name, {style: "color"}), title: "Paradox - Badge"});

  return {...type, badge, details};
};
const themeBlend = (blend) => {
  const details = blend.details || [];
  const video = blendToVideo(blend);

  if(video) { details.push({body: video, title: "Paradox - Video"}); }

  return {
    ...blend,
    details,
    personality_type_1: themeType(blend.personality_type_1),
    personality_type_2: themeType(blend.personality_type_2)
  };
};
const themeTrait = (trait) => {
  const type = trait.personality_type;

  return {...trait, personality_type: themeType(type)};
};

export default function themeAssessment({data, theme}) {
  if(data.deck_id !== "career-deck") { return data; }
  if((dig(data, "personality_types", "length") || 0) === 0) { return data; }
  if(theme !== "paradox") { return data; }

  const themedData = mutable(data);
  const {
    personality_blend: blend,
    personality_traits: traits,
    personality_types: types
  } = themedData;

  themedData.personality_traits = traits.map((trait) => ({
    ...trait, personality_trait: themeTrait(trait.personality_trait)
  }));
  themedData.personality_types = types.map((type) => ({
    ...type, personality_type: themeType(type.personality_type)
  }));

  if(blend) { themedData.personality_blend = themeBlend(blend); }

  return themedData;
}
