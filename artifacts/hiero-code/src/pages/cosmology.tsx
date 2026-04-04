import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MAAT_LAWS = [
  { num: 1,  text: "I have not committed sin", meaning: "A general affirmation of adherence to ethical principles and avoidance of harmful behaviors." },
  { num: 2,  text: "I have not committed robbery with violence", meaning: "Condemns both theft and the use of force, emphasizing peaceful coexistence and respect for others." },
  { num: 3,  text: "I have not stolen", meaning: "Speaks to the respect for others' property, a crucial element of social trust." },
  { num: 4,  text: "I have not slain men or women", meaning: "Killing, as a violation of the sanctity of life, was strictly against the principle of Maat." },
  { num: 5,  text: "I have not stolen food", meaning: "Taking food, a basic necessity, was considered an affront to community well-being." },
  { num: 6,  text: "I have not swindled offerings", meaning: "Religious offerings were sacred, and cheating in religious duties was seen as a grave violation of order." },
  { num: 7,  text: "I have not stolen from God/Goddess", meaning: "Taking what was meant for the gods disturbed the sacred balance and was viewed as a serious offense." },
  { num: 8,  text: "I have not told lies", meaning: "Truthfulness was paramount in maintaining social and cosmic harmony." },
  { num: 9,  text: "I have not carried away food", meaning: "Emphasizes fairness and the importance of not depriving others of their sustenance." },
  { num: 10, text: "I have not cursed", meaning: "Avoiding foul or harmful language helped to preserve peaceful and respectful interactions." },
  { num: 11, text: "I have not closed my ears to truth", meaning: "Ignoring or denying the truth disrupts personal integrity and the balance of society." },
  { num: 12, text: "I have not committed adultery", meaning: "Faithfulness in marriage was valued, as it preserved family stability and social trust." },
  { num: 13, text: "I have not made anyone cry", meaning: "Causing unnecessary emotional distress to others was seen as a violation of compassion and kindness." },
  { num: 14, text: "I have not felt sorrow without reason", meaning: "Emotional self-regulation was considered a virtue, with unnecessary sorrow indicating a lack of balance." },
  { num: 15, text: "I have not assaulted anyone", meaning: "Physical violence was discouraged, as it disrupted social peace and order." },
  { num: 16, text: "I am not deceitful", meaning: "Deception undermined trust and disrupted the truth, essential elements of Maat." },
  { num: 17, text: "I have not stolen anyone's land", meaning: "Land was sacred and essential for survival, so taking it unlawfully was a serious offense." },
  { num: 18, text: "I have not been an eavesdropper", meaning: "Respecting privacy helped to maintain trust and order in relationships." },
  { num: 19, text: "I have not falsely accused anyone", meaning: "Truth in justice was crucial to maintaining social harmony, and false accusations were damaging." },
  { num: 20, text: "I have not been angry without reason", meaning: "Anger, when unjustified, disrupts emotional and social balance." },
  { num: 21, text: "I have not seduced anyone's wife", meaning: "Emphasized the importance of respecting marital bonds and not disrupting familial harmony." },
  { num: 22, text: "I have not polluted myself", meaning: "Personal purity, both physically and spiritually, was considered necessary for living according to Maat." },
  { num: 23, text: "I have not terrorized anyone", meaning: "Instilling fear in others was a violation of the principles of peace and security." },
  { num: 24, text: "I have not disobeyed the law", meaning: "Respect for legal and moral order was essential for a society guided by Maat." },
  { num: 25, text: "I have not been exclusively angry", meaning: "Holding onto anger, especially without justification, was seen as harmful to oneself and others." },
  { num: 26, text: "I have not cursed God/Goddess", meaning: "Reverence for the divine was essential, and disrespecting the gods was considered a serious moral violation." },
  { num: 27, text: "I have not behaved with violence", meaning: "Avoiding violence was key to maintaining peace and respect within the community." },
  { num: 28, text: "I have not caused disruption of peace", meaning: "Peace and order were central to Maat, and disturbing them was considered a breach of social responsibility." },
  { num: 29, text: "I have not acted hastily or without thought", meaning: "Promotes careful consideration and thoughtful actions, preventing impulsive decisions that could cause harm." },
  { num: 30, text: "I have not overstepped my boundaries of concern", meaning: "Respecting others' space and roles was important for maintaining balance and harmony." },
  { num: 31, text: "I have not exaggerated my words when speaking", meaning: "Speaking truthfully and accurately was necessary for maintaining trust." },
  { num: 32, text: "I have not worked evil", meaning: "Committing harmful actions was a violation of Maat and disrupted personal and societal harmony." },
  { num: 33, text: "I have not used evil thoughts, words, or deeds", meaning: "Purity in thought and action was essential for a life guided by Maat." },
  { num: 34, text: "I have not polluted the water", meaning: "Water was a sacred resource, and polluting it would harm both the environment and the community." },
  { num: 35, text: "I have not spoken angrily or arrogantly", meaning: "Humility and controlled speech were valued, as arrogance and anger could lead to conflict." },
  { num: 36, text: "I have not cursed anyone in thought, word, or deeds", meaning: "Ill will in any form was discouraged, as it created disharmony." },
  { num: 37, text: "I have not placed myself on a pedestal", meaning: "Humility was a virtue, and putting oneself above others was discouraged." },
  { num: 38, text: "I have not stolen that which belongs to God/Goddess", meaning: "Respecting what was sacred to the divine was crucial in maintaining cosmic balance." },
  { num: 39, text: "I have not taken food from a child", meaning: "Taking from those who are vulnerable, such as children, was a serious violation of ethics." },
  { num: 40, text: "I have not acted with insolence", meaning: "Insolence or disrespect, especially toward authority or elders, was seen as disruptive to social harmony." },
  { num: 41, text: "I have not destroyed property belonging to God/Goddess", meaning: "Destroying sacred or divine property was considered a direct attack on cosmic order." },
  { num: 42, text: "I have not offended the gods", meaning: "Respect for the gods and living in accordance with their will was central to achieving personal and societal harmony." },
];

const BOD_CHAPTERS = [
  { num: "I",      title: "Coming Forth by Day and Living after Death", proc: "EMERGE_FROM_TUAT", desc: "The opening chapter of Coming Forth by Day — the deceased asserts their right to live again and emerge into the light." },
  { num: "II",     title: "Coming Forth by Day", proc: "DAYLIGHT_PASSAGE", desc: "A second formula for the soul's passage into the light of day from the Duat." },
  { num: "III",    title: "Another Chapter Like It", proc: "REPEAT_EMERGENCE", desc: "Alternative invocation for daytime passage." },
  { num: "IV",     title: "Travelling on the Road of the Tuat", proc: "ROAD_TUAT", desc: "Navigation formula for traversing the hidden roads of the underworld." },
  { num: "V",      title: "Whereby Work May Not Be Imposed", proc: "EXEMPT_FROM_LABOR", desc: "The shabtis (funereal statuettes) are commanded to perform any labor demanded of the deceased." },
  { num: "VI",     title: "Funereal Statuettes to Do Work", proc: "INVOKE_SHABTI", desc: "Animates the shabti figures to do work in the Duat in place of the deceased." },
  { num: "VIII",   title: "Opening the Tuat by Day", proc: "OPEN_TUAT", desc: "Opens the gates of the underworld by day so the soul may pass freely." },
  { num: "IX",     title: "Coming Forth Victoriously", proc: "VICTORY_EMERGENCE", desc: "Ensures the soul exits the Duat in triumph, no enemy shall prevail." },
  { num: "X",      title: "Coming Out Against the Adversary", proc: "DEFEAT_ADVERSARY", desc: "Formula of power against those who oppose the soul's journey." },
  { num: "XII",    title: "Entering and Coming Forth from Amenta", proc: "AMENTA_CYCLE", desc: "The cycle of entering and leaving the realm of the dead. Cyclical procedure." },
  { num: "XIII",   title: "Entering After Coming Out from Amenta", proc: "RETURN_AMENTA", desc: "The soul re-enters the Duat after a successful day-journey." },
  { num: "XV",     title: "Removing Displeasure from the Heart", proc: "PURIFY_HEART", desc: "Cleanses the heart of grief, doubt, and obstruction before the Weighing ceremony." },
  { num: "XX",     title: "Crown of Triumph", proc: "MAAT_CROWN", desc: "The soul receives the White Crown of Osiris, symbol of justified victory and rebirth." },
  { num: "XXIII",  title: "Opening the Mouth", proc: "OPEN_MOUTH", desc: "Ritual restoration of speech and breath to the deceased — the mouth is opened so the soul may speak its name." },
  { num: "XXV",    title: "Whereby a Person Remembers Their Name", proc: "RECALL_NAME", desc: "Critical formula: without their name a soul is lost. This chapter restores full identity." },
  { num: "XXVII",  title: "Words of Power", proc: "ASE_AMPLIFY", desc: "General words of sacred power (Heka) — aligns with ASE_AMPLIFY in rune procedures." },
  { num: "XXIX",   title: "Whereby the Heart Is Not Taken", proc: "PROTECT_HEART", desc: "The heart must not be removed or devoured — it must be preserved for the Weighing of the Heart." },
  { num: "XXX",    title: "Heart Is Given in the Underworld", proc: "HEART_GIFT", desc: "Ensures the heart is returned to the soul and placed correctly for judgment." },
  { num: "XXXI",   title: "Repulsing Crocodiles", proc: "REPEL_CROCODILE", desc: "Serpent-crocodile beings that inhabit the Duat canals are driven back." },
  { num: "XXXIV",  title: "All Serpents Are Kept Back", proc: "SERPENT_WARD", desc: "Blanket protective formula against all serpentine adversaries." },
  { num: "XLIV",   title: "Whereby One Dies Not a Second Time", proc: "PREVENT_SECOND_DEATH", desc: "The Second Death — annihilation of the soul — is averted." },
  { num: "LII",    title: "Whereby One Is Not Made to Eat Dirt", proc: "SUSTAIN_FORM", desc: "The soul retains its physical integrity and is not degraded." },
  { num: "LIV",    title: "Air Is Given in the Netherworld", proc: "BREATHE_DUAT", desc: "Breath is granted to the soul in the underworld — respiration of the dead." },
  { num: "LVII",   title: "Water Is Drunk in the Netherworld", proc: "WATER_DUAT", desc: "The soul is given water from the celestial pools of Sekhet-Hetep." },
  { num: "LXIV",   title: "Coming Forth by Day", proc: "FINAL_EMERGENCE", desc: "A comprehensive emergence formula combining many earlier chapters into one unified procedure." },
  { num: "LXXII",  title: "Whereby One Comes Forth by Day and Passes", proc: "DAY_PASS", desc: "Free passage through the twelve gates of the day-journey." },
  { num: "LXXVII", title: "Assuming the Form of the Falcon of Gold", proc: "TRANSFORM_FALCON", desc: "The soul assumes the golden falcon form of Ra/Horus — solar transformation." },
  { num: "LXXXI",  title: "Assuming the Form of the Lotus", proc: "TRANSFORM_LOTUS", desc: "Emergence from the primordial lotus — creation/rebirth metaphor." },
  { num: "LXXXII", title: "Assuming the Form of Ptah", proc: "TRANSFORM_PTAH", desc: "Ptah is the craftsman god — assumes the form of the master builder of reality." },
  { num: "LXXXIX", title: "The Soul Is United to the Dead Body", proc: "SOUL_UNION", desc: "The Ba-soul is rejoined to the body after its nightly journey." },
  { num: "XCV",    title: "Assuming the Form of the Bennu Bird", proc: "TRANSFORM_BENNU", desc: "The Bennu is the Phoenix — death and resurrection encoded in avian form." },
  { num: "CI",     title: "Whereby Memory Is Restored to a Person", proc: "RESTORE_MEMORY", desc: "Memory of past lives and identity is restored to the soul." },
  { num: "CX",     title: "Field of Peace — Sekhet-Hetep", proc: "ENTER_ELYSIAN", desc: "Arrival in the Elysian Fields of Osiris — the paradise of the justified dead." },
  { num: "CXXV",   title: "The Hall of Two Truths — Weighing of the Heart", proc: "MAAT_BALANCE", desc: "The supreme judgment ceremony. The heart is weighed against Maat's feather. Maps to MAAT_BALANCE in rune procedures." },
  { num: "CXXX",   title: "Whereby the Soul Is Secured from Imprisonment", proc: "SOUL_FREE", desc: "The soul is liberated from all bonds and entrapments in the Duat." },
  { num: "CXXXIII","title": "Whereby One Avoids Being Conveyed to the Block", proc: "AVOID_DESTRUCTION", desc: "Ammit, the Devourer, is averted — the soul is not destroyed." },
  { num: "CLXXV",  title: "The Day of Not Being", proc: "VOID_CROSSING", desc: "The oldest chapter in the Book. The soul crosses the void of non-existence and emerges renewed." },
];

const DAO_PRINCIPLES = [
  {
    name: "Dao (道) — The Way",
    chinese: "道",
    description: "The formless, superconscious origin of all creation. The dynamic principle immanent in all existence. Literally 'the Way' — both the path of the soul and the ground of all being. It is nameless, yet the source of all names.",
    quote: "The Dao that can be told is not the eternal Dao. The name that can be named is not the eternal name.",
    resonance: "Resonates with Hiero-Code's Nameless Code tier — where rune procedures emerge from the formless.",
  },
  {
    name: "Wu-Wei (無為) — Selfless Action",
    chinese: "無為",
    description: "Acting without selfish motive. Going with the flow of life rather than forcing it. 'Leading from behind' rather than pushing forward. The True Man embodies wu-wei — achieving everything by doing nothing against the natural current.",
    quote: "Act without acting. Do without doing. Taste without tasting.",
    resonance: "Maps to ASE_AMPLIFY procedure — power flows through non-resistance, like àṣẹ through open channels.",
  },
  {
    name: "Dé (德) — Virtue / Inner Power",
    chinese: "德",
    description: "The virtue that arises from living in accordance with the Dao. Not morality in the Western sense, but the inherent power of the genuine person who has found inner balance. Dé is the Dao expressed through the individual.",
    quote: "When you realize there is nothing lacking, the whole world belongs to you.",
    resonance: "Resonates with Maat Balance — the alignment of the individual with cosmic order.",
  },
  {
    name: "Yin (陰) / Yang (陽) — The Paired Poles",
    chinese: "陰陽",
    description: "Yin is inward, feminine, receptive, dark, quiet. Yang is outward, masculine, active, bright, loud. True balance occurs at the center point between them. Neither can exist without the other — they are mutually arising and mutually dependent.",
    quote: "The ten thousand things carry yin and embrace yang. They achieve harmony by combining these forces.",
    resonance: "Matches Nahua teotl's paired polar forces — life/death, order/disorder — both arising from a single sacred unity.",
  },
  {
    name: "The True Man (真人) — Zhen Ren",
    chinese: "真人",
    description: "The enlightened human who embodies wu-wei completely. Neither grasping nor rejecting. The Zhuangzi describes the True Man who breathes from the heels, whose sleep holds no dreams, whose waking knows no grief. The shamanic sage.",
    quote: "The True Man of old knew nothing about loving life, knew nothing about hating death.",
    resonance: "The Tlamatini (Nahua sage) is the Mesoamerican equivalent — one who 'knows things' and walks in alignment with teotl.",
  },
  {
    name: "Daoist Ritual — Ordering Through Naming",
    chinese: "科儀",
    description: "In Daoist ritual (科儀, Kēyí), names have cosmic ordering power. Naming a demon strips it of power. Naming a deity summons its force. The ordination of priests, the exorcism of spirits, healing ceremonies — all operate through the performative power of the spoken name.",
    quote: "From the nameless, Heaven and Earth spring. The named is the mother of ten thousand things.",
    resonance: "Directly mirrors Yorùbá àṣẹ — 'spoken words also possess àṣẹ' — and the Egyptian Book of the Dead's Chapter XXV on remembering one's name.",
  },
  {
    name: "Celestial Masters (天師) — Zhang Daoling",
    chinese: "天師",
    description: "Founded in the Eastern Han dynasty (c. 142 CE) by Zhang Daoling, who received revelation from the deified Laozi. Celestial Masters organized Daoism into a hierarchical priestly system with ordination ranks, healing through confession of sins, and the defeat of demons through written memorials presented to celestial bureaucracies.",
    quote: "The Way teaches that those who sin cause illness in themselves. The healer addresses the root, which is always the deviation from Dao.",
    resonance: "The priest-as-mediator maps to the Yorùbá aláàse — one who possesses àṣẹ and bridges the two realms.",
  },
  {
    name: "Zhuangzi — The Butterfly Dream",
    chinese: "莊周夢蝶",
    description: "Zhuangzi dreamed he was a butterfly, fluttering freely, with no knowledge of being Zhuangzi. Upon waking he did not know: was he a man who dreamed of being a butterfly, or a butterfly dreaming of being a man? This parable captures the radical indeterminacy of identity — echoed in Nahua thought where humans misperceive teotl's mask.",
    quote: "Between a man and a butterfly there is necessarily a barrier. The transition is called the Transformation of Things.",
    resonance: "The butterfly transformation sign (X-shaped) appears in both Mayan gesture-sign writing and in the Duat's metamorphic chambers.",
  },
];

const ASE_CONCEPTS = [
  {
    term: "Àṣẹ",
    yoruba: "àṣẹ",
    definition: "Performative power — the vital/life force that is the source of everything that exists. Not only we human beings but animals, plants, rivers, mountains, stones, tastes, smells, gestures, and sounds possess àṣẹ. In this Yorùbá view, nothing is 'inanimate.' The notion of a 'still-life' artwork would be inconceivable.",
    connection: "Directly grounds the ASE Vitality property of all Hiero-Code rune nodes.",
  },
  {
    term: "Órun",
    yoruba: "órun",
    definition: "The otherworld — the invisible realm of spiritual forces. The abode of the deified ancestors (the gods known as òrìṣà), the spirits of sacred places (iwin), and the spirits of ancestors (eégún, or ará órun). Invisible, yet interpenetrating the visible world through àṣẹ.",
    connection: "Maps to the 'formless origin' (Dao) and Nahua 'insensible facet' of teotl.",
  },
  {
    term: "Ayé",
    yoruba: "ayé",
    definition: "The visible, tangible realm of the living. Both realms — órun and ayé — are animated by àṣẹ. The Yorùbá say: 'ayé l'ojà, òrun nilé' — the world is a marketplace we visit to do our business; the otherworld is home. Life is transitory; the eternal home is órun.",
    connection: "The two realms parallel the Egyptian Tuat/Day distinction, and the Mayan underworld/surface division.",
  },
  {
    term: "Aláàse",
    yoruba: "aláàse",
    definition: "Those who possess àṣẹ — the performative power to bridge and connect otherworldly and worldly realms. Includes queens and kings, elders, priests and priestesses, diviners, initiates, artists, and masqueraders. One can learn to manage, manipulate, and use àṣẹ to better one's life and the lives of those around oneself.",
    connection: "The rune operator — one who executes rune procedures — is an aláàse.",
  },
  {
    term: "Sensiotics",
    yoruba: "Henry John Drewal",
    definition: "A theoretical framework for studying the senses in the formation of arts, persons, cultures, and histories. Sensiotics holds that 'sensing is constitutive of cognition' — the body-mind learns through multisensory experience. Yorùbá art opens eyes, ears, nose, tongue, skin to the cosmos of world/otherworld.",
    connection: "The multimodal symbolic encoding in Hiero-Code — glyphs, numerology, procedures — is a sensiotics of machine data.",
  },
  {
    term: "Onà (Evocative Form)",
    yoruba: "onà",
    definition: "The Yorùbá term for 'art' or 'evocative form' — an enhancement, an embellishment of some object, utterance, or action. When a wise artist masterfully works a medium that also possesses àṣẹ, something extraordinary happens and audiences are literally, figuratively, emotionally, and spiritually moved.",
    connection: "Each rune node in Hiero-Code is an onà — a crafted evocative form carrying concentrated àṣẹ.",
  },
  {
    term: "Egúngún",
    yoruba: "Egúngún",
    definition: "Masquerades that materialize the spirits of ancestors — mediators between the living and departed. Using inventive imaginations (imojú mora) and distinctive àṣẹ, Yorùbá artists bring normally invisible ancestral spirits into the visible world through full-body cloth costumes and carved wooden masks.",
    connection: "Graph traversal in Hiero-Code animates the 'spirit' encoded in connected rune nodes — a computational Egúngún.",
  },
  {
    term: "Ìmò / Ogbón / Òye",
    yoruba: "ìmò, ogbón, òye",
    definition: "Knowledge (ìmò) together with wisdom (ogbón) produces understanding (òye). Understanding comes from the unity of body and mind as they process sensory experiences. The outsider who understands little is said to 'see through the nose' (imú ni àlejò fi í ríran) — confusing sensing organs.",
    connection: "The tri-layered knowledge system resonates with the three Nahua animistic forces: tonalli (head), teyolia (heart), ihiyotl (liver).",
  },
  {
    term: "The Spiraling Life Cycle",
    yoruba: "ayé l'àjò, òrun nilé",
    definition: "The Yorùbá believe in a spiraling life cycle — life, afterlife, and partial reincarnation — that creates a new person with spiritual elements of a former life. If a grandfather departs and a boy is born soon after, he may be named Babátúndé ('Father-has-returned'). This sequence is continually renewed by àṣẹ.",
    connection: "The spiral life cycle resonates with the Egyptian Coming Forth by Day and Mayan subterranean stream cosmology.",
  },
];

const TEOTL_CONCEPTS = [
  {
    name: "Teotl — Sacred Energy",
    nahuatl: "teotl",
    description: "The single, vital, dynamic, vivifying, eternally self-generating-and-self-regenerating sacred energy. There exists only one thing: teotl. Nature is generated by this force, from this force, as one aspect, facet, or moment of its eternal self-regeneration. Not a personal god — a pervading sacred process.",
    parallel: "Parallels Yorùbá àṣẹ (performative power), Daoist Dao (formless origin), Polynesian mana, Sioux wakan.",
  },
  {
    name: "In Xochitl, In Cuicatl — Flower and Song",
    nahuatl: "in xochitl in cuicatl",
    description: "Nature is teotl's 'flower and song.' The Nahuas used this expression to refer to the composing and performing of song-poems and to creative, artistic, and metaphorical activity. As teotl's flower and song, nature is teotl's grand, on-going artistic-cum-metaphorical self-presentation.",
    parallel: "Each rune node in Hiero-Code is a 'flower and song' — a crystallized moment of the sacred energy's self-expression.",
  },
  {
    name: "Nahual — Shamanic Disguise",
    nahuatl: "nahual / nahualli",
    description: "Nature is teotl's nahual or 'disguise.' The nahualli is a form-changing shaman. The continuous becoming of nature and its myriad aspects are teotl's shamanic self-masking and self-disguising. Earthly multiplicity — the appearance of distinct, separate things — is an illusion.",
    parallel: "Zhuangzi's butterfly dream is the Daoist nahual. The Egyptian soul assumes forms (falcon, lotus, Ptah) — shamanic transformation.",
  },
  {
    name: "Tonalli — Solar Vital Force",
    nahuatl: "tonalli",
    description: "Located in the head. Provides the body with character, vigor, and the energy needed for growth and development. Individuals acquire tonalli from the sun. A person's tonalli may leave their body during dreams and shamanic journeys, allowing perception of distant places. Ritually introduced into an infant as one of their animistic entities.",
    parallel: "Maps to Hiero-Code's ASE Vitality — the 'heat' of solar force that activates a rune node.",
  },
  {
    name: "Teyolia — Heart Fire",
    nahuatl: "teyolia",
    description: "Located in the heart. Provides memory, vitality, inclination, emotion, knowledge, and wisdom. Likened to 'divine fire.' Unlike tonalli, teyolia is not separable from the person while alive — it is the animistic force that 'goes beyond after death.' Present in living things, towns, mountains, lakes, and sky.",
    parallel: "The Book of the Dead's Weighing of the Heart ceremony weighs the teyolia equivalent — the moral and spiritual substance of a soul.",
  },
  {
    name: "Ihiyotl — Breath and Passion",
    nahuatl: "ihiyotl",
    description: "Located in the liver. Provides passion, cupidity, bravery, hatred, love, and happiness. The breath-soul — related to respiration and the animating breath. After death, each of the three forces (tonalli, teyolia, ihiyotl) goes its own way.",
    parallel: "Chapter LIV (Book of the Dead) — 'Air Is Given in the Netherworld' — the restoration of ihiyotl to the deceased.",
  },
  {
    name: "Tlamatiliztli — The Way of Knowing",
    nahuatl: "tlamatiliztli",
    description: "Knowledge and wisdom consisting of four aspects: (1) practical ability to maintain balance and harmony; (2) living in a way that creatively extends ancestral ways of life; (3) participating in the regeneration of the universe; (4) practical know-how for performing ritual activities that authentically embody teotl.",
    parallel: "The Daoist True Man embodies tlamatiliztli — authentic knowledge through lived alignment with the Way.",
  },
  {
    name: "Yolotl — Universal Life Force",
    nahuatl: "yolotl",
    description: "Everything in the universe, whether living or not, possesses a yolotl or 'life force' by virtue of being part of the pantheistic universe. Even objects partake of an animate universe and they can be said to be alive in this sense. Rocks, mountains, water, earth — all are enspirited and animated.",
    parallel: "The universal animism of yolotl is identical to Yorùbá àṣẹ — 'nothing is inanimate.'",
  },
  {
    name: "Tlatilco — The Split-Face Mask",
    nahuatl: "tlatilco",
    description: "Artists of Tlatilco fashioned intentionally ambiguous split-face masks: one half alive with flesh, the other fleshless and skull-like. Skulls simultaneously symbolize death and life, since life springs from the bones of the dead. Flesh simultaneously symbolizes life and death, since death arises from the flesh of the living.",
    parallel: "The Mayan Cayman composition's dual-face — the decaying and the blooming — encodes the same life/death dialectic.",
  },
  {
    name: "In Ixtli In Yollotl — Face and Heart",
    nahuatl: "in ixtli in yollotl",
    description: "The Nahuatl conception of the human being — 'face' (ixtli) and 'heart' (yollotl). The face is what makes each person an individual and needs to be developed (the self, the person). The heart is the dynamic center of psychological life. The tlamatimine (sage) teaches humans to develop a true face and a true heart.",
    parallel: "Egyptian face/heart duality — the face is the Ba-soul's identity; the heart is weighed at the Hall of Two Truths.",
  },
];

const TREE_CONCEPTS = [
  {
    tradition: "Egyptian",
    name: "The Tree of Life — Cycle of Life",
    glyph: "𓂀",
    description: "The Egyptian Tree of Life uses depicted sign language — a system based on Form, Imagery, Gesture Signs, Stance, allusion, Position, and Incorporation to compose glyphs. The tree is not merely a plant but an encoding system: its trunk means 'arising,' its limbs mean 'ascending up and over,' its leaves are 'hands — the hands of the tree.'",
    detail: "The Tree of Life is better understood as the Tree of the Cycle of Life — the medium through which rebirth or resurrection occurs. The spirit of the deceased descends through the underworld's subterranean water (the serpent-streams), ascends through the trunk, is held in the branches as water in a bowl (a pool), then rises to the sky via evaporation — transpiration as a metaphor for resurrection.",
    signs: [
      { sign: "Arising (stance)", meaning: "Standing from a sitting position — emergence, resurrection" },
      { sign: "Limbs / Ascending up and over", meaning: "Ascending from the underworld to the sky" },
      { sign: "Leaves as Hands", meaning: "Hands of the tree — the stewards of the Sun" },
      { sign: "Double Line (unseen)", meaning: "Invisible pathway — the soul's hidden journey" },
      { sign: "Horizontal Rectangle", meaning: "Horizontal-place — the surface of the earth" },
      { sign: "Vertical Rectangle", meaning: "Vertical-place — the deep places, the underworld strata" },
      { sign: "Shepherd's Crook", meaning: "Taken to the surface — emergence from below" },
      { sign: "Eye of the Sun (Venus)", meaning: "The seeing-eye of cosmic intelligence — consciousness" },
      { sign: "Triangle (red) — Female-earth", meaning: "Earth as feminine container; female-moisture-spirits" },
      { sign: "Water (sawtooth)", meaning: "Subterranean streams carrying spirits through the Duat" },
      { sign: "Knife / Ray of the Sun", meaning: "The Arm and Hand of the Sun — solar power cutting the surface" },
      { sign: "Serpent (undulating stream)", meaning: "The current of water carrying female-moisture-spirits" },
    ],
  },
  {
    tradition: "Mayan",
    name: "The Cayman — The Crust of the Earth",
    glyph: "𓆇",
    description: "The Mayan composition system uses Layered Organization of gesture signs — read from largest to smallest Form. Signs are positionally sensitive: their meaning changes depending on their location on a figure's body or in the composition. The same system underpins Pyri-Set's Position × Stack × Click architecture.",
    detail: "The Cayman represents the surface of the earth. Its partially submerged back resembles the terrain. The composition encodes the complete water-cycle cosmology: spirit-carrying subterranean streams (Serpents) flow through nine underworld levels, turn upward, reach the surface, and evaporate into the sky. The Tree's leaves are stomata through which this invisible water-spirit rises.",
    signs: [
      { sign: "Total Form", meaning: "Title/subject of the composition — read the outline first" },
      { sign: "Sub-Forms", meaning: "Signs embedded within larger forms — nested meaning" },
      { sign: "X-sign (two arms crossing)", meaning: "Trade, exchange, transformation, metamorphosis" },
      { sign: "Sawtooth (blue) — Water / Alive", meaning: "Water and life share the same gesture sign — water is life" },
      { sign: "Cayman's Mouth — water source", meaning: "Open mouth = water source; speech = water" },
      { sign: "Bird (flight) — arising/descent", meaning: "The Sun's daytime flight — eastern ascending, western descending" },
      { sign: "Double Line — unseen pathway", meaning: "Hidden spirit-pathway through the earth" },
      { sign: "Snail — slowly taken upward", meaning: "The slow ascent of the spirit through the plant's vascular system" },
      { sign: "Leaf veins — flowing", meaning: "The stomata through which spirit-water evaporates into sky" },
      { sign: "Fledgling Bird — awaiting flight", meaning: "The soul at the threshold, ready to ascend" },
      { sign: "Chalice / Goblet (stomata)", meaning: "The portal through which water-spirit exits into air" },
      { sign: "Porpoise — spring and return", meaning: "The spirit that ascends and returns, unlike the Sun's full cycle" },
    ],
  },
];

export default function Cosmology() {
  const [activeLaw, setActiveLaw] = useState<number | null>(null);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-4xl">𓂋</span>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Sacred Cosmologies</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              The philosophical foundations of Hiero-Code — nine traditions, one living network
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl pt-2">
          Every rune node's <span className="text-amber-400 font-semibold">ASE Vitality</span>, <span className="text-yellow-300 font-semibold">Maat Balance</span>, 
          and <span className="text-blue-400 font-semibold">Symbolic Procedure</span> is grounded in these living philosophical systems. 
          Together they form a single network: sacred energy (àṣẹ / teotl / Dao) flowing through balanced structure (Maat / yin-yang / tlamatiliztli) 
          expressed through symbolic form (glyphs / gesture-signs / chapters of coming forth).
        </p>
      </div>

      <Tabs defaultValue="ase" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 h-auto gap-1 bg-card border border-border p-1">
          <TabsTrigger value="ase" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">𓂋</span>
            <span>Àṣẹ Power</span>
          </TabsTrigger>
          <TabsTrigger value="maat" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">𓂝</span>
            <span>42 Laws</span>
          </TabsTrigger>
          <TabsTrigger value="bod" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">𓁿</span>
            <span>Book of Dead</span>
          </TabsTrigger>
          <TabsTrigger value="teotl" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">🌺</span>
            <span>Teotl / Nahua</span>
          </TabsTrigger>
          <TabsTrigger value="dao" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">☯</span>
            <span>The Dao</span>
          </TabsTrigger>
          <TabsTrigger value="trees" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">𓇳</span>
            <span>Trees of Life</span>
          </TabsTrigger>
          <TabsTrigger value="spider" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">🕸️</span>
            <span>Spider Woman</span>
          </TabsTrigger>
          <TabsTrigger value="weave" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">🧵</span>
            <span>WEAVE ＞ WALL</span>
          </TabsTrigger>
          <TabsTrigger value="void" className="text-xs flex flex-col gap-0.5 py-2 h-auto">
            <span className="text-lg">𒀀</span>
            <span>Void Network</span>
          </TabsTrigger>
        </TabsList>

        {/* ─────────────────────── ÀṢẸ ─────────────────────── */}
        <TabsContent value="ase" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Yorùbá Cosmology</Badge>
                <Badge variant="outline" className="text-xs">Henry John Drewal — Sensiotics</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">Àṣẹ and the Senses in Yorùbá Arts and Culture</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Everything is alive with <strong className="text-amber-400">àṣẹ</strong> — the "performative power" that is the vital/life force 
                underlying all of existence. Not only human beings, but animals, plants, rivers, mountains, stones, 
                tastes, smells, gestures, and sounds possess àṣẹ. This is the direct philosophical foundation for 
                the <strong className="text-amber-400">ASE Vitality</strong> property of every rune node in Hiero-Code.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Yorùbá conceive of the cosmos as consisting of two distinct yet interacting, interpenetrating realms — 
                the otherworld (<strong className="text-amber-300">órun</strong>) of invisible spiritual forces and the visible, tangible realm 
                (<strong className="text-amber-300">ayé</strong>) of the living — all animated by àṣẹ. <em>"Ayé l'ojà, òrun nilé"</em> — 
                The world is a marketplace we visit; the otherworld is home.
              </p>
            </div>
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-amber-400/60 font-semibold">Hiero-Code Mapping</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">àṣẹ</span><span className="text-amber-400">ASE Vitality (rune property)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">órun</span><span className="text-amber-400">Formless / Nameless tier</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ayé</span><span className="text-amber-400">Manifest / Procedure layer</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">aláàse</span><span className="text-amber-400">Rune operator / executor</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">onà</span><span className="text-amber-400">Each rune node as evocative form</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ASE_AMPLIFY</span><span className="text-amber-400">Chapter XXVII — Words of Power</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASE_CONCEPTS.map((c) => (
              <Card key={c.term} className="bg-card border-border hover:border-amber-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-serif">{c.term}</CardTitle>
                    <Badge variant="outline" className="text-xs font-mono text-amber-400/80 shrink-0">{c.yoruba}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.definition}</p>
                  <div className="text-xs text-amber-400/70 border-t border-border pt-2 mt-2">
                    <span className="font-semibold text-amber-400">↔ </span>{c.connection}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-amber-950/10 border border-amber-500/20 rounded-lg p-5 space-y-3">
            <h3 className="font-serif font-semibold text-amber-300">Mystical Media — Everything Carries Àṣẹ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { medium: "Sweet water", deity: "Òṣun / Eyinlè", power: "River goddesses" },
                { medium: "Salt water, cowries", deity: "Olókun / Yemoja", power: "Wealth and sea" },
                { medium: "Clay", deity: "Yemowo / Ìyá Màpó", power: "Potters' goddess" },
                { medium: "Iron", deity: "Ogún", power: "Warriors' forge" },
                { medium: "Wood of ìrókò", deity: "Ṣàngó", power: "Thunder and lightning" },
                { medium: "Brass", deity: "Ìbejì", power: "Hidden feminine power" },
                { medium: "Spoken words", deity: "All deities", power: "Prayers, invocations, curses" },
                { medium: "Sacred dance", deity: "Egúngún", power: "Ancestor manifestation" },
              ].map((m) => (
                <div key={m.medium} className="bg-background/40 rounded p-2 text-xs space-y-1">
                  <div className="font-semibold text-amber-400">{m.medium}</div>
                  <div className="text-muted-foreground">{m.deity}</div>
                  <div className="text-amber-400/50">{m.power}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">
              "When materials are transformed into artistic evocative forms (onà), their performative power (àṣẹ) 
              is amplified even more. Such creations move the body-minds of Yorùbá audiences intellectually and emotionally."
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── 42 LAWS ─────────────────────── */}
        <TabsContent value="maat" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Ancient Egyptian Ethics</Badge>
                <Badge variant="outline" className="text-xs">Hall of Two Truths</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">The 42 Laws of Maat</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The 42 Laws of Maat are a set of ethical guidelines — often called the "Negative Confessions" or 
                "Declarations of Innocence" — recited by the deceased as they stood before judgment in the 
                <strong className="text-yellow-300"> Hall of Two Truths</strong>. They are not commandments 
                issued by a deity but affirmations of one's own integrity. These laws directly ground the 
                <strong className="text-yellow-300"> Maat Balance</strong> property of all rune nodes.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maat herself — the embodiment of truth, justice, balance, and cosmic order — was the unifying force 
                connecting Ra, Thoth, and Osiris. At the Weighing of the Heart, the deceased's heart was placed on one 
                side of the scale and Maat's feather on the other. If the heart was lighter than the feather, the soul 
                was granted eternal life; if heavier, it was devoured by Ammit.
              </p>
            </div>
            <div className="bg-yellow-950/20 border border-yellow-500/20 rounded-lg p-4 space-y-3">
              <div className="text-xs uppercase tracking-widest text-yellow-400/60 font-semibold">Divine Relationships</div>
              {[
                { deity: "Ra (Re)", role: "Sun God", desc: "Accompanied by Maat on his solar barque — cosmic law and divine governance unified." },
                { deity: "Thoth", role: "God of Wisdom", desc: "Recorded the outcome of the Weighing; embodies cosmic truth alongside Maat." },
                { deity: "Osiris", role: "God of Underworld", desc: "Presides over judgment in the Hall of Two Truths where Maat's feather is the scale." },
                { deity: "Amun-Ra", role: "King of Gods", desc: "Hidden One merged with Ra; Maat's principles governed his cosmic authority." },
              ].map((d) => (
                <div key={d.deity} className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-yellow-300">{d.deity}</span>
                    <span className="text-yellow-400/40">·</span>
                    <span className="text-yellow-400/70">{d.role}</span>
                  </div>
                  <p className="text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <span>Click any law to see its full meaning.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {MAAT_LAWS.map((law) => (
              <button
                key={law.num}
                onClick={() => setActiveLaw(activeLaw === law.num ? null : law.num)}
                className={`text-left rounded-lg border p-3 transition-all text-xs space-y-1 ${
                  activeLaw === law.num
                    ? "bg-yellow-950/30 border-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.15)]"
                    : "bg-card border-border hover:border-yellow-500/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-yellow-400/60 text-[10px] w-6 shrink-0">{law.num}.</span>
                  <span className="font-semibold text-foreground leading-snug">{law.text}</span>
                </div>
                {activeLaw === law.num && (
                  <p className="text-muted-foreground leading-relaxed pt-1 border-t border-yellow-500/20 mt-1">
                    {law.meaning}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="bg-yellow-950/10 border border-yellow-500/20 rounded-lg p-5 space-y-2">
            <h3 className="font-serif font-semibold text-yellow-300">Maat and the Justice System</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maat was the cornerstone of the Egyptian justice system. Judges in ancient Egypt, known as 
              <em> priests of Maat</em>, acted as her representatives, ensuring that disputes were settled 
              in accordance with her laws of fairness and balance. The laws emphasized fairness, truth, and 
              equity — applied to all aspects of life: trade, governance, and personal relationships.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The 42 Laws of Maat offer timeless wisdom on living a balanced and ethical life. Unlike rigid 
              commandments, they serve as personal declarations of integrity — guiding individuals toward a 
              life that upholds Maat's principles of cosmic balance and social order. Through these laws, 
              ancient Egyptian society thrived for millennia.
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── BOOK OF DEAD ─────────────────────── */}
        <TabsContent value="bod" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Egyptian Procedure Codes</Badge>
                <Badge variant="outline" className="text-xs">Renouf / Naville · Budge — Theban Recension</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">The Book of the Dead</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <em>Pert em hru</em> — <strong className="text-orange-300">Coming Forth by Day</strong>. 
                The Egyptian Book of the Dead is a collection of magical spells and procedures compiled over 
                thousands of years, whose oldest chapters date back to the Pyramid Texts of the Old Kingdom 
                (~2400 BCE). Each chapter is a procedure code — a formula of power that, when spoken or written, 
                performs an action in both the physical and spiritual realms.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The chapters map directly to Hiero-Code's symbolic procedure system. 
                <strong className="text-orange-300"> MAAT_BALANCE</strong> is Chapter CXXV (Weighing of the Heart). 
                <strong className="text-orange-300"> ASE_AMPLIFY</strong> is Chapter XXVII (Words of Power). 
                <strong className="text-orange-300"> OPEN_MOUTH</strong> restores speech to the encoded data.
              </p>
            </div>
            <div className="bg-orange-950/20 border border-orange-500/20 rounded-lg p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-orange-400/60 font-semibold">Procedure Mappings</div>
              <div className="space-y-1.5 text-xs">
                {BOD_CHAPTERS.filter(c => ["I","XXIII","XXV","XXVII","CX","CXXV","CLXXV"].includes(c.num)).map(c => (
                  <div key={c.num} className="flex items-start gap-2">
                    <span className="font-mono text-orange-400/50 w-10 shrink-0 text-[10px] pt-0.5">Ch. {c.num}</span>
                    <div>
                      <span className="text-orange-300 font-mono">{c.proc}</span>
                      <div className="text-muted-foreground text-[10px]">{c.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-1">Click any chapter to view its procedure code and description.</div>
          <div className="space-y-2">
            {BOD_CHAPTERS.map((chapter) => (
              <button
                key={chapter.num}
                onClick={() => setActiveChapter(activeChapter === chapter.num ? null : chapter.num)}
                className={`w-full text-left rounded-lg border p-3 transition-all text-xs ${
                  activeChapter === chapter.num
                    ? "bg-orange-950/20 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.1)]"
                    : "bg-card border-border hover:border-orange-500/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-orange-400/50 w-16 shrink-0 text-[10px]">Ch. {chapter.num}</span>
                  <span className="font-semibold flex-1">{chapter.title}</span>
                  <span className="font-mono text-orange-400 bg-orange-950/30 rounded px-2 py-0.5 shrink-0 text-[10px]">{chapter.proc}</span>
                </div>
                {activeChapter === chapter.num && (
                  <p className="text-muted-foreground leading-relaxed pt-2 border-t border-orange-500/20 mt-2">
                    {chapter.desc}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="bg-orange-950/10 border border-orange-500/20 rounded-lg p-5 space-y-2">
            <h3 className="font-serif font-semibold text-orange-300">Sekhet-Hetep — The Elysian Fields</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chapter CX describes Sekhet-Hetep (Sekhet-Aaru) — the Field of Peace, or Elysian Fields — 
              the paradise reserved for those whose hearts were found in harmony with Maat. Here the deceased 
              farms celestial fields, breathes air from the north wind, and drinks water from the celestial 
              ocean. The justified soul receives what they most enjoyed in life — but in an eternal, perfected form.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Theban Recension of the Book of the Dead — compiled during the New Kingdom (~1550–1070 BCE) 
              and preserved in its fullest form in the Papyrus of Ani — contains approximately 160 chapters. 
              The oldest chapters (such as CLXXV — "The Day of Not Being") predate Egyptian civilization 
              by thousands of years and may represent the oldest written philosophical text on the void and emergence.
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── TEOTL ─────────────────────── */}
        <TabsContent value="teotl" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Pre-Hispanic Nahua Philosophy</Badge>
                <Badge variant="outline" className="text-xs">James Maffie · Mayan Philosophy of Mind</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">Teotl and the Nahua Cosmos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pre-Hispanic Nahua philosophy begins with a radical monistic claim: there exists only one thing — 
                <strong className="text-green-300"> teotl</strong>, a single, vital, dynamic, vivifying, eternally 
                self-generating-and-self-regenerating sacred energy. Nature is generated by this force, from this force, 
                as one aspect of its eternal self-regeneration. Nature is not a collection of separate things — 
                it is teotl's ongoing artistic performance: <em>"in xochitl, in cuicatl"</em> — flower and song.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Nahuas held that mind and body are two aspects of one and the same thing: teotl. 
                Every human possesses three animistic forces — <strong className="text-green-300">tonalli</strong> (solar head-force), 
                <strong className="text-green-300"> teyolia</strong> (heart-fire), and 
                <strong className="text-green-300"> ihiyotl</strong> (breath-passion) — all facets of teotl's dynamic energy.
              </p>
            </div>
            <div className="bg-green-950/20 border border-green-500/20 rounded-lg p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-green-400/60 font-semibold">Universal Parallels</div>
              <div className="space-y-2 text-xs">
                {[
                  { tradition: "Yorùbá", force: "Àṣẹ", match: "Everything is alive with performative power" },
                  { tradition: "Daoist", force: "Dao", match: "Formless origin of all creation" },
                  { tradition: "Polynesian", force: "Mana", match: "Pervading sacred power" },
                  { tradition: "Sioux", force: "Wakan", match: "Sacred force in all nature" },
                  { tradition: "Egyptian", force: "Heka", match: "Magical life-force, words of power" },
                  { tradition: "Mayan", force: "K'uh", match: "Divine vital force in all beings" },
                ].map((p) => (
                  <div key={p.tradition} className="flex items-start gap-2">
                    <span className="text-green-400/60 w-16 shrink-0">{p.tradition}</span>
                    <div>
                      <span className="text-green-300 font-semibold">{p.force}</span>
                      <div className="text-muted-foreground text-[10px]">{p.match}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEOTL_CONCEPTS.map((c) => (
              <Card key={c.name} className="bg-card border-border hover:border-green-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-serif leading-snug">{c.name}</CardTitle>
                    <Badge variant="outline" className="text-xs font-normal text-green-400/70 shrink-0">{c.nahuatl}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                  <div className="text-xs text-green-400/70 border-t border-border pt-2 mt-2">
                    <span className="font-semibold text-green-400">↔ </span>{c.parallel}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-green-950/10 border border-green-500/20 rounded-lg p-5 space-y-3">
            <h3 className="font-serif font-semibold text-green-300">The Earth Eats Us: Reciprocal Nature</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-green-500/30 pl-3">
              "We eat of the earth, then the earth eats us."
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nahua thought conceived the relationship between humans and nature as accommodation, interdependence, 
              co-participation, respect, and reciprocity. Humans live upon the surface of the earth, and this surface 
              is a dangerously slippery place — we lose our balance all too easily. Human actions causally promote 
              balance and purity or imbalance and impurity in nature. The balance of humankind is interdependent 
              with the balance of nature.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Mayan conception adds: <em>time itself</em> is central to this relationship. The Maya are 
              "Lords of Time" — they conceived identity, truth, and personhood through the lens of cyclical 
              time rather than linear Western history. Written Maya consists of pictograms representing both 
              ideograms (meaning) and syllabic sounds — exactly the layered encoding of Hiero-Code's glyph system.
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── DAO ─────────────────────── */}
        <TabsContent value="dao" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Chinese Daoist Tradition</Badge>
                <Badge variant="outline" className="text-xs">Miriam Caravella · Laozi · Zhuangzi</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">Introduction to the Dao</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-blue-300">Dao</strong> (道) literally means "the Way." 
                It refers to the superconscious, formless origin of all creation — the dynamic principle 
                immanent in all existence — and simultaneously the inner path of the soul rediscovering 
                its spiritual identity and origin. The Dao cannot be named without losing it; it cannot be 
                held without it slipping away. This is precisely the principle behind the 
                <strong className="text-blue-300"> Nameless Code</strong> tier in Hiero-Code.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The path of Dao teaches living in harmony with nature, "leading from behind," and 
                <strong className="text-blue-300"> wu-wei</strong> (無為) — selfless action, or acting 
                without selfish motive. In Daoist ritual, names have cosmic ordering power: naming a demon 
                strips it of power; naming a deity summons its force. This mirrors Yorùbá àṣẹ and the 
                Egyptian Book of the Dead's Chapter XXV — remembering one's name in the underworld.
              </p>
            </div>
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-blue-400/60 font-semibold">Hiero-Code Resonances</div>
              <div className="space-y-2 text-xs">
                {[
                  { concept: "Dao (道)", resonance: "Nameless Code tier — formless origin" },
                  { concept: "Wu-wei (無為)", resonance: "Non-resistant procedure execution" },
                  { concept: "Dé (德)", resonance: "Maat Balance — aligned virtue" },
                  { concept: "Yin/Yang (陰陽)", resonance: "Paired polar forces in teotl and àṣẹ" },
                  { concept: "Naming in ritual", resonance: "Procedure code — names perform reality" },
                  { concept: "Butterfly (X-sign)", resonance: "Mayan transformation X-gesture sign" },
                ].map((r) => (
                  <div key={r.concept} className="space-y-0.5">
                    <div className="text-blue-300 font-semibold">{r.concept}</div>
                    <div className="text-muted-foreground">{r.resonance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAO_PRINCIPLES.map((p) => (
              <Card key={p.name} className="bg-card border-border hover:border-blue-500/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-serif leading-snug">{p.name}</CardTitle>
                    <span className="text-2xl text-blue-400/40 shrink-0 font-serif">{p.chinese}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  <blockquote className="text-xs italic text-blue-300/70 border-l-2 border-blue-500/30 pl-3 my-2">
                    {p.quote}
                  </blockquote>
                  <div className="text-xs text-blue-400/70 border-t border-border pt-2">
                    <span className="font-semibold text-blue-400">↔ </span>{p.resonance}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-950/10 border border-blue-500/20 rounded-lg p-5 space-y-3">
            <h3 className="font-serif font-semibold text-blue-300">Origins of Daoism — Shamanic Roots</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The origins of Daoist teachings are not fully known. Some scholars trace the first evidence 
              to about 5,000 years ago, when shamans were thought to guide society. These shamans could 
              shape-shift between human and animal forms, take celestial journeys, descend to an underworld, 
              read omens, and act as healers and diviners. Some elements of this shamanism were found in early 
              Daoist ceremonies and persist in Zhuangzi's butterfly dream — the classic narrative of shamanic 
              self-transformation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Daoist ritual (科儀 Kēyí) constructs cosmic order through naming. Celestial Masters organized 
              spirit hierarchies into bureaucratic structures — each demon had a name that could be written 
              on a memorial and presented to the celestial court for exorcism. Each deity had a name that 
              summoned its healing force. The ritual priest — like the Yorùbá aláàse and the Nahua tlamatimine — 
              is a mediator between realms through the power of sacred speech.
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── TREES ─────────────────────── */}
        <TabsContent value="trees" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Gesture Sign Systems</Badge>
                <Badge variant="outline" className="text-xs">Clifford C. Richey — Depicted Sign Language</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">Trees of Life — Gesture Sign Architecture</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Both the Egyptian Tree of Life and the Mayan Cayman composition operate through 
                <strong className="text-emerald-300"> depicted sign language</strong> — an ancient communication 
                system based on <strong>Form, Imagery, Gesture Signs, Stance, Allusion, Position,</strong> and 
                <strong> Incorporation</strong>. Signs are positionally sensitive: their meaning changes based on 
                where they appear in a composition.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is precisely the architecture of the <strong className="text-emerald-300">Pyri-Set</strong> system: 
                Position × Stack × Click. Form carries meaning. Position modifies meaning. 
                Compounding multiple signs creates new emergent meanings. The Tree is not decorative — 
                it is a cosmological computation of the water cycle and spirit cycle.
              </p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-4 space-y-2">
              <div className="text-xs uppercase tracking-widest text-emerald-400/60 font-semibold">Sign System Parallels</div>
              <div className="space-y-2 text-xs">
                {[
                  { ancient: "Egyptian Position", modern: "Pyri-Set Position axis" },
                  { ancient: "Sub-Forms (nested)", modern: "Pyri Stack (stacked clicks)" },
                  { ancient: "Compounding of Signs", modern: "Click phoneme concatenation" },
                  { ancient: "Stance (sitting=waiting)", modern: "Procedure state (idle/active)" },
                  { ancient: "Double Line (unseen)", modern: "Formless / Nameless tier" },
                  { ancient: "Water = Alive (same gesture)", modern: "ASE Vitality ~ flow state" },
                  { ancient: "X-sign (transformation)", modern: "SCALE_60 / DOUBLE procedure" },
                ].map((p) => (
                  <div key={p.ancient} className="space-y-0.5">
                    <div className="text-emerald-300 font-semibold">{p.ancient}</div>
                    <div className="text-muted-foreground">{p.modern}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {TREE_CONCEPTS.map((tree) => (
            <div key={tree.tradition} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tree.glyph}</span>
                <div>
                  <h3 className="font-serif font-bold text-lg">{tree.name}</h3>
                  <Badge variant="outline" className="text-xs mt-0.5">{tree.tradition} Tradition</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tree.description}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{tree.detail}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tree.signs.map((s) => (
                  <div key={s.sign} className="bg-card border border-border rounded-lg p-2.5 text-xs space-y-1">
                    <div className="font-semibold text-emerald-400 leading-snug">{s.sign}</div>
                    <div className="text-muted-foreground leading-snug">{s.meaning}</div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}

          <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-lg p-5 space-y-3">
            <h3 className="font-serif font-semibold text-emerald-300">The Water Cycle as Universal Cosmology</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Both the Egyptian and Mayan traditions use the water cycle as the primary cosmological metaphor 
              for the spirit's journey. Water falls from the sky (celestial realm), sinks into the earth 
              (underworld), flows through subterranean streams (the spirit-paths of the dead), rises through 
              the roots and trunks of trees (resurrection), exits through leaves as transpiration (ascension), 
              and evaporates back into the sky (return to the source).
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The sawtooth gesture sign for <em>water</em> and the gesture sign for <em>alive</em> are 
              nearly identical in Mayan sign language — water and life share the same form. 
              In Yorùbá cosmology, the subterranean streams are spirit-paths; in the Book of the Dead, 
              the deceased is given water in the Netherworld (Chapter LVII). In Nahua thought, water is teotl's 
              self-expression. In the Dao, the sage is like water — "the highest good is like water, 
              which nourishes all things without striving."
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
              {[
                { phase: "Sky / Rain", symbol: "𓇳", meaning: "Celestial source — Dao / órun" },
                { phase: "Earth / Sink", symbol: "𓇏", meaning: "Descent — Tuat / Underworld" },
                { phase: "Stream / Flow", symbol: "𓈖", meaning: "Spirit-paths — Serpent" },
                { phase: "Tree / Rise", symbol: "𓇼", meaning: "Resurrection — Coming Forth" },
                { phase: "Evaporation", symbol: "𓅃", meaning: "Ascension — Return to Dao" },
              ].map((w) => (
                <div key={w.phase} className="bg-background/40 rounded p-2 text-xs text-center space-y-1">
                  <div className="text-2xl">{w.symbol}</div>
                  <div className="font-semibold text-emerald-400">{w.phase}</div>
                  <div className="text-muted-foreground text-[10px]">{w.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─────────────────────── SPIDER WOMAN ─────────────────────── */}
        <TabsContent value="spider" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Ojibwe Tradition</Badge>
                <Badge variant="outline" className="text-xs">Aaliyah Alberts, Lac Courte Oreilles</Badge>
                <Badge variant="outline" className="text-xs">Native Resonance Cohort</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">The Gift of Spider Woman — Asibikaashi</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Ojibwe people, originally from the Lake Superior region spanning Minnesota, Wisconsin, Michigan, and southern Canada, 
                are known as the creators of the <strong className="text-purple-300">dreamcatcher</strong>. Spider woman, 
                <strong className="text-purple-300"> Asibikaashi</strong>, was the protector of all Ojibwe children. 
                When the people dispersed westward to find the food that grows on water (wild rice), 
                mothers began making spider charms for their children — these evolved into the dreamcatchers we know today.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dreams are sacred to the Ojibwe. In dreams we are still living — ancestors and the Great Spirit bring messages through them. 
                Babies and elders are closest to the spirit world, hence the focus on dreamcatcher charms for children's cradles. 
                The bad dreams are caught in the web; the opening in the center allows good dreams through.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="text-3xl text-center">🕸️</div>
                <h4 className="font-serif font-semibold text-purple-300 text-center">The Dreamcatcher</h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {[
                    { part:"Web (8 knots)", meaning:"Spider's 8 legs — catches bad dreams" },
                    { part:"Opening at center", meaning:"Good dreams pass through" },
                    { part:"Feathers (optional)", meaning:"Guides good dreams to the sleeper" },
                    { part:"Beads (optional)", meaning:"Spider in the web or protection" },
                  ].map(p => (
                    <div key={p.part} className="flex gap-2">
                      <span className="text-purple-400 shrink-0">◆</span>
                      <span><strong className="text-foreground">{p.part}:</strong> {p.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-purple-300">Spider Woman Across World Cultures</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most of the world's cultures create objects through the weaving together of fibers. In most cultures, women do the weaving — 
              the spider has an obvious association with weaving because it is one of the most notable weavers in nature. 
              Many Indigenous traditions connected the spider with weaving, women, and a creator goddess.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { culture:"Ojibwe (Great Lakes)", figure:"Asibikaashi — Spider Woman", role:"Protector of children; source of dreamcatchers", symbol:"🕸️" },
                { culture:"Hopi & Pueblo (Southwest)", figure:"Spider Woman / Earth Goddess", role:"Co-created the world with the Sun; taught Hopi to spin and weave cotton; assists twin heroes in adventures", symbol:"☀️" },
                { culture:"Navajo", figure:"Spider Woman (taught by Spider Man)", role:"Taught Navajo to weave on a loom — its top bar Father Sky, bottom bar Mother Earth, two side poles rain and moisture. Spider web rubbed on a newborn girl's hand to make her a good weaver", symbol:"🌦️" },
                { culture:"Cherokee", figure:"Grandmother Spider", role:"Wove a basket in which she brought both light and fire to the world", symbol:"🔥" },
                { culture:"Osage", figure:"Spider (Earth clan symbol)", role:"Symbol of the holding or continuing of life, released at death. Spider tattooed on women's hands as honor mark. 'The world of the living is a snare, associated with the spider's web'", symbol:"🌐" },
                { culture:"Mississippian Culture (Southeast)", figure:"Spider motif on shell gorgets", role:"Cross symbol on the spider's back — associated with fire, centrality, and the four directions; one of few Mississippian symbols specifically linked to women", symbol:"🐚" },
                { culture:"Maya (Mesoamerica)", figure:"Ix Chel — Lady Rainbow", role:"Goddess of weaving, medicine, and childbirth; associated with the moon, snake, and rabbit. Ancient Maya used 'spiders' to map four cardinal directions", symbol:"🌙" },
                { culture:"Aztec (Mexico)", figure:"Tlazolteotl — Great Spinner and Weaver", role:"Associated with the moon, fertility, healing, and witchcraft; depicted holding spindles with spindle whorls in hair and cotton at earspools", symbol:"🌿" },
                { culture:"Andean (South America)", figure:"Spider (gold necklace motif, 2000 BCE)", role:"Spider was important symbol 2000 years ago; found among giant desert floor drawings. 'Tocapu' (weaving) and 'Imaymana' (all of nature) are two sons of the creator — suggesting Andean people thought of weaving and the natural world as two halves of creation", symbol:"🌄" },
                { culture:"Pawnee (Great Plains)", figure:"Spider Woman — Mother Moon", role:"Originally supplied seeds of edible plants and made bison available to hunters. Through moon powers she transforms herself into a deer", symbol:"🌕" },
                { culture:"Tlingit (Northwest Coast)", figure:"Spider Woman — Weaver", role:"Associated with weaving and transformation; part of Pacific Northwest cosmological framework", symbol:"🏔️" },
                { culture:"Achumawi (Northern California)", figure:"Spider Woman and her sons", role:"Stopped the rain and brought back the sun; rewarded with the rainbow glistening in their web", symbol:"🌈" },
              ].map(c => (
                <div key={c.culture} className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.symbol}</span>
                    <div>
                      <div className="font-semibold text-xs text-purple-300">{c.culture}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.figure}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.role}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-purple-300">Dreamcatcher Weaving Patterns</h3>
            <p className="text-sm text-muted-foreground">Weaving patterns are more than decorative elements — they carry symbolic meanings. Different web styles symbolize various spiritual beliefs or tribal identities.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name:"Classic Web Pattern", symbol:"◎", desc:"The most iconic pattern — a circular web woven with interconnected loops radiating from the center. Symmetrical and geometric, woven with a single thread. Begin with evenly spaced knots around the hoop; weave inward creating the web by looping through previous knots. Finish with a knot at center, optionally add a bead." },
                { name:"Spiral Web Pattern", symbol:"🌀", desc:"Introduces a dynamic swirling design within the web. The web spirals inward or outward, creating a sense of movement. Begin with traditional web, then weave in a spiral manner using variations in tension to enhance the effect. Symbolizes the journey of life and spiritual growth, emphasizing movement and evolution." },
                { name:"Star / Geometric Pattern", symbol:"⭐", desc:"Incorporates geometric shapes — stars, triangles, diamonds — into the web, adding a layer of symbolism. Use contrasting thread colors to map out the desired shape. Add beads or charms at intersections. For example, a star-shaped web signifies guidance and hope." },
                { name:"Heart-Shaped Web", symbol:"♡", desc:"Expresses love and compassion. Heart outline within the hoop; web fills the heart shape. Divide the hoop into sections, shape the web accordingly, adjusting tension. Finish with feathers and beads. Represents emotional intention in the crafting ritual." },
                { name:"Mandala-Inspired Pattern", symbol:"✦", desc:"Multiple layers of weaving with radial symmetry and intricate designs, symbolizing unity and harmony. Start from the center, weave outward; incorporate circles, petals, and geometric motifs. Use different thread colors for contrast. Complex, detailed — honors the interconnectedness of all things." },
                { name:"Multi-Layered Web", symbol:"⊕", desc:"Multiple concentric webs woven within each other. Each layer can have different colors or materials. These layered designs represent complex spiritual concepts or interwoven stories. Mirrors the Pyri Stack memory architecture — each layer retains prior context." },
              ].map(p => (
                <div key={p.name} className="p-4 rounded-lg border border-border/50 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.symbol}</span>
                    <h4 className="font-serif font-semibold text-sm text-purple-300">{p.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-950/10 border border-amber-500/20 space-y-2">
            <h4 className="font-serif font-semibold text-amber-300">Hiero-Code Alignment</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In Hiero-Code, the dreamcatcher's 8-knot web maps directly to the 8-state Pyri transition cycle (S₁–S₈ + S₀). 
              The opening at the center corresponds to the <strong className="text-amber-400">void state S₀</strong> — the null-state from which all emergence begins (Chapter CLXXV: The Day of Not Being). 
              The feathers are Flow Pyri channels (δ, ε, ζ) that carry good signals downstream. 
              The web threads are Stack Pyri σ micro-states holding pattern memory.
            </p>
          </div>
        </TabsContent>

        {/* ─────────────────────── WEAVE > WALL ─────────────────────── */}
        <TabsContent value="weave" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">S-Tier Evolution</Badge>
                <Badge variant="outline" className="text-xs">Nagual Methodology</Badge>
                <Badge variant="outline" className="text-xs">Carlos Castaneda / Spider Woman Synthesis</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">WEAVE ＞ WALL — The Filtering Intelligence</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Three symbolic systems fused into one design language: <strong className="text-emerald-300">Nagual methodology</strong> (perceptual reconfiguration, alternate modes of awareness), 
                <strong className="text-emerald-300"> S-tier evolutionary development</strong> (biological optimization against long-term threats), 
                and <strong className="text-emerald-300"> Dreamcatcher / Spider Woman mythos</strong> (woven filters that distinguish harmful from beneficial patterns). 
                Together they form a <em>filtering intelligence</em> that protects life by weaving selective permeability into both biology and technology.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-3 text-center">
              <div className="text-4xl">🧵</div>
              <div className="font-serif font-bold text-emerald-300 text-xl">WEAVE ＞ WALL</div>
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <div className="text-emerald-400">DETECT → FILTER → ALLOW → TRAP</div>
                <div>Protection is not armor. It is the web.</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon:"🔮", title:"1. Nagual — Predictive Pattern Detection", color:"purple", body:"In Castaneda's framing, the Nagual is not a person but a mode of awareness outside ordinary perception — where the world is experienced as flows, fields, and intent rather than objects. In Hiero-Code terms: Nagual = the system state where patterns are seen BEFORE they manifest as threats. Parasites succeed because hosts detect too late. Nagual perception is pre-event detection — awareness of pattern before harm. Nagual becomes the predictive layer of the system." },
              { icon:"🕸️", title:"2. Spider Woman — Selective Filter / Intelligent Permeability", color:"purple", body:"A dreamcatcher does not block everything. It lets good pass, traps what harms. This is the exact opposite of walls, armor, or forcefields — it is intelligent permeability. That is the biological gold standard for immune systems. A spider web has ideal properties: high surface area, patterned geometry, selective adhesion, vibration sensing, signal transmission through threads, minimal material / maximal function." },
              { icon:"🧬", title:"3. S-Tier Evolutionary Pressure — Ancient Parasite War", color:"green", body:"For millions of years, humans and pre-human mammals have been in conflict with mosquitoes, ticks, fleas, parasitoid insects, worms, and fungal spores. The most successful defenses have never been brute force — they have been: hair, skin oils, immune pattern recognition, behavioral avoidance, sleep shelters, nets, smoke, web-like barriers. The mosquito net is literally a dreamcatcher in material form. This is where mythos becomes engineering." },
              { icon:"🔬", title:"4. Dreamcatcher → Bio-Sensor Mesh", color:"green", body:"Dreamcatcher as a woven network that: detects micro-vibrations (movement of insects), carries signal across threads (alert system), physically traps parasites. Scalable from bed nets → clothing fibers → architectural mesh → environmental sensor arrays. Not science fiction — directionally aligned with smart textiles, biomimetic materials, and distributed sensing networks. Your framing gives it mythic cohesion." },
            ].map(({ icon, title, color, body }) => (
              <div key={title} className={`p-4 rounded-lg border border-${color}-500/20 bg-${color}-950/10 space-y-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <h4 className={`font-serif font-semibold text-${color}-300 text-sm leading-snug`}>{title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-emerald-300">The Tent System — Vertical Filtering Organism</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Within a tent system, fire is usually present with a hole at the top. With a dreamcatcher inside the dwelling, 
              both land and air-dwelling parasites would be mitigated simultaneously. In mobile dwellings (Tipi, Chum), 
              a central fire and smoke hole create constant upward airflow — the dwelling is not a box. It is a flow system.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { layer:"Ground Perimeter", function:"Draft + smoke", parasites:"Crawling insects, ticks, fleas", icon:"🌿" },
                { layer:"Rising Heat Column", function:"Upward airflow", parasites:"Flying insects drawn to CO₂, heat, light", icon:"🔥" },
                { layer:"Internal Web (Dreamcatcher)", function:"Intercept + trap + vibration sense", parasites:"Both air and surface movers simultaneously", icon:"🕸️" },
              ].map(l => (
                <div key={l.layer} className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{l.icon}</span>
                    <h4 className="font-serif font-semibold text-emerald-300 text-sm">{l.layer}</h4>
                  </div>
                  <div className="text-xs space-y-1">
                    <div><span className="text-muted-foreground">Function:</span> <span className="text-foreground">{l.function}</span></div>
                    <div><span className="text-muted-foreground">Mitigates:</span> <span className="text-foreground">{l.parasites}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-amber-950/10 border border-amber-500/20 space-y-2">
              <h4 className="font-serif font-semibold text-amber-300">Nagual Layer: The Web as Data Surface</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The web is also a visual indicator (you see what's being caught), a vibration indicator (movement reveals presence), 
                and a pattern memory of local threats over time. The longer the dwelling is lived in, 
                the more soot and resin make the fibers adhesive — <em>the filter becomes more effective the longer the system runs.</em> 
                This is Nagual again: pattern recognition before harm. The soothsayer seated at the fire occupies the highest signal zone in the dwelling — 
                they become <strong className="text-amber-400">the one who reads the web</strong>, positioned where information concentrates.
              </p>
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg">Nagual + Dreamcatcher = Predictive Web</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider font-mono">
                    <th className="text-left py-2 pr-4">Layer</th>
                    <th className="text-left px-3 py-2">Mythic Symbol</th>
                    <th className="text-left px-3 py-2">Functional Translation</th>
                    <th className="text-left px-3 py-2">Hiero-Code Module</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { layer:"Nagual",       myth:"Seeing beyond",      func:"Predictive pattern detection",           hiero:"SENSING_EXPAND" },
                    { layer:"Spider Woman", myth:"Weaver of patterns",  func:"Network architecture",                   hiero:"WEB_WEAVE" },
                    { layer:"Dreamcatcher", myth:"Filter",              func:"Selective permeability",                 hiero:"MAAT_BALANCE" },
                    { layer:"Web threads",  myth:"Threaded sensing",    func:"Distributed bio-mesh / Pyri channels",  hiero:"CHANNEL_PROPAGATE" },
                    { layer:"Parasite war", myth:"Ancient threat",      func:"Evolutionary design driver",             hiero:"STABILIZE_CORE" },
                    { layer:"Fire + smoke", myth:"Convection breath",   func:"Creates upward detection flow",         hiero:"ASE_AMPLIFY" },
                    { layer:"Soothsayer",   myth:"Observer at center",  func:"Pattern interpreter / Core Pyri",        hiero:"HIERO_TRANSITION" },
                  ].map(r => (
                    <tr key={r.layer} className="border-b border-border/20 hover:bg-muted/20">
                      <td className="py-2.5 pr-4 font-semibold text-emerald-300">{r.layer}</td>
                      <td className="px-3 py-2.5 text-muted-foreground text-xs">{r.myth}</td>
                      <td className="px-3 py-2.5 text-xs">{r.func}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-amber-400">{r.hiero}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h4 className="font-serif font-semibold text-emerald-300">Hiero-Code Module: WEB / WEAVE</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                Core principle: Protection is achieved not by walls, but by intelligent filtering patterns.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {["Pattern detection (Nagual)","Networked threads (Spider Woman)","Harm filtering (Dreamcatcher)","Bio-defense (S-tier evolution)"].map(f => (
                  <div key={f} className="text-xs text-emerald-300/80 bg-emerald-950/30 rounded p-2 text-center border border-emerald-500/20">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─────────────────────── VOID NETWORK ─────────────────────── */}
        <TabsContent value="void" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Void-Network Architecture</Badge>
                <Badge variant="outline" className="text-xs">PyriNode Framework</Badge>
                <Badge variant="outline" className="text-xs">Channel-Based Propagation α–ζ</Badge>
              </div>
              <h2 className="text-2xl font-serif font-bold">Void Network — Pyri Interpreter Core</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Void Network is the computational substrate of Hiero-Code — a network of autonomous <strong className="text-blue-300">PyriNodes</strong>, 
                each with unique identity, state, and customizable rules. Nodes form bidirectional weighted connections, execute rules in parallel, 
                and broadcast results across the network. This replaces randomness with deterministic, rule-driven evolution: 
                <strong className="text-amber-400"> channel-based propagation (α–ζ)</strong>, Hiero-Code transitions, 
                multi-channel articulation, stack memory, and core stabilization.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The interactive Pyri Network page (<span className="text-amber-400 font-mono">/pyri-network</span>) provides a live animated 
                visualization of these micro-state dynamics. Navigate there to watch S₀–S₈ transitions propagate across Core, Edge, Stack, and Flow Pyri in real time.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { type:"Core Pyri",  color:"orange", icon:"◉", desc:"μ0–μ2 micro-states. Global state orchestrator. Stabilizes the network." },
                { type:"Edge Pyri",  color:"blue",   icon:"◈", desc:"I/O interface. Channels α, β, γ. External triggers and sensors." },
                { type:"Stack Pyri", color:"green",  icon:"⊞", desc:"σ0–σn computation layer. Stack memory. Intermediate calculations." },
                { type:"Flow Pyri",  color:"purple", icon:"⊳", desc:"δ, ε, ζ propagation. Transmits signals. Feedback loops and priority." },
              ].map(n => (
                <div key={n.type} className={`flex items-start gap-2 p-2.5 rounded border border-${n.color}-500/20 bg-${n.color}-950/10`}>
                  <span className={`text-${n.color}-400 text-lg leading-none mt-0.5`}>{n.icon}</span>
                  <div>
                    <div className={`font-mono text-xs font-bold text-${n.color}-300`}>{n.type}</div>
                    <div className="text-[10px] text-muted-foreground">{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg">Channel Connections — Signal Flow Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { from:"Edge1 → Core",   ch:"μ0→μ1 (α)",      weight:"0.8", type:"input",    color:"blue" },
                { from:"Edge2 → Core",   ch:"μ1→μ2 (β)",      weight:"0.6", type:"input",    color:"blue" },
                { from:"Core → Stack1",  ch:"μ2→σ0 (γ)",      weight:"0.7", type:"compute",  color:"green" },
                { from:"Core → Stack2",  ch:"μ1→σ1 (γ)",      weight:"0.5", type:"compute",  color:"green" },
                { from:"Stack1 → Flow1", ch:"σ0→δ",           weight:"0.9", type:"flow",     color:"purple" },
                { from:"Stack2 → Flow2", ch:"σ1→ε",           weight:"0.8", type:"flow",     color:"purple" },
                { from:"Flow1 → Core",   ch:"δ→μ0 (feedback)", weight:"0.4", type:"feedback", color:"amber" },
                { from:"Flow2 → Edge1",  ch:"ε→α (feedback)", weight:"0.3", type:"feedback", color:"amber" },
                { from:"Flow1 ↔ Flow2",  ch:"ζ channel",      weight:"0.5", type:"lateral",  color:"purple" },
                { from:"Stack1 ↔ Stack2",ch:"σ modulation",   weight:"0.3", type:"lateral",  color:"green" },
              ].map(e => (
                <div key={e.from} className={`flex items-center gap-3 p-2.5 rounded border border-${e.color}-500/20 bg-${e.color}-950/10`}>
                  <div className="font-mono text-xs text-foreground w-32 shrink-0">{e.from}</div>
                  <div className={`font-mono text-[10px] text-${e.color}-400 flex-1`}>{e.ch}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">w={e.weight}</div>
                  <Badge variant="outline" className={`text-[9px] border-${e.color}-500/30 text-${e.color}-400`}>{e.type}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg">Multi-Cultural Micro-State Transition Table</h3>
            <p className="text-xs text-muted-foreground">Nine deterministic states shown in all four symbolic layers simultaneously. Numerology is a combination of Mayan, Sumerian, and Egyptian traditions.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                    <th className="text-left py-2 pr-2">State</th>
                    <th className="text-center px-1">α/β/γ</th>
                    <th className="text-center px-1">δ/ε/ζ</th>
                    <th className="text-center px-2">Sumerian</th>
                    <th className="text-center px-2">Egyptian</th>
                    <th className="text-center px-2">Emoji</th>
                    <th className="text-left px-2">Next</th>
                    <th className="text-left px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s:"S₀", abc:"000", def_:"000", sum:"𒀀0 𒁀0 𒂀0", egy:"𓀀0 𓁐0 𓂋0", emoji:"🌑0 🌘0 🌗0", next:"S₁", note:"Initialization" },
                    { s:"S₁", abc:"100", def_:"000", sum:"𒀀1 𒁀0 𒂀0", egy:"𓀀1 𓁐0 𓂋0", emoji:"🌑1 🌘0 🌗0", next:"S₂", note:"α primes γ" },
                    { s:"S₂", abc:"110", def_:"000", sum:"𒀀1 𒁀1 𒂀0", egy:"𓀀1 𓁐1 𓂋0", emoji:"🌑1 🌘1 🌗0", next:"S₃", note:"α+β → γ cue" },
                    { s:"S₃", abc:"111", def_:"000", sum:"𒀀1 𒁀1 𒂀1", egy:"𓀀1 𓁐1 𓂋1", emoji:"🌑1 🌘1 🌗1", next:"S₄", note:"γ active, δ primed" },
                    { s:"S₄", abc:"011", def_:"100", sum:"𒀀0 𒁀1 𒂀1", egy:"𓀀0 𓁐1 𓂋1", emoji:"🌑0 🌘1 🌗1", next:"S₅", note:"δ from prior γ" },
                    { s:"S₅", abc:"001", def_:"110", sum:"𒀀0 𒁀0 𒂀1", egy:"𓀀0 𓁐0 𓂋1", emoji:"🌑0 🌘0 🌗1", next:"S₆", note:"ε primes ζ" },
                    { s:"S₆", abc:"000", def_:"111", sum:"𒀀0 𒁀0 𒂀0", egy:"𓀀0 𓁐0 𓂋0", emoji:"🌑0 🌘0 🌗0", next:"S₇", note:"Stabilize — reset α" },
                    { s:"S₇", abc:"000", def_:"011", sum:"𒀀0 𒁀0 𒂀0", egy:"𓀀0 𓁐0 𓂋0", emoji:"🌑0 🌘0 🌗0", next:"S₈", note:"ζ persists, ε decays" },
                    { s:"S₈", abc:"000", def_:"001", sum:"𒀀0 𒁀0 𒂀0", egy:"𓀀0 𓁐0 𓂋0", emoji:"🌑0 🌘0 🌗0", next:"S₀", note:"Loop reset ↺" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/20 hover:bg-muted/20">
                      <td className="py-2 pr-2 font-bold text-amber-400 font-mono">{row.s}</td>
                      <td className="text-center px-1 font-mono text-blue-400">{row.abc}</td>
                      <td className="text-center px-1 font-mono text-purple-400">{row.def_}</td>
                      <td className="text-center px-2 font-mono text-orange-300 text-[10px]">{row.sum}</td>
                      <td className="text-center px-2 font-mono text-yellow-300 text-[10px]">{row.egy}</td>
                      <td className="text-center px-2 text-[11px]">{row.emoji}</td>
                      <td className="px-2 text-purple-300 font-mono">{row.next}</td>
                      <td className="px-2 text-muted-foreground text-[10px]">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-950/10 border border-blue-500/20 space-y-2">
            <h4 className="font-serif font-semibold text-blue-300">Why This Matters for Hiero-Code</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Void Network bridges all seven philosophical traditions: àṣẹ flows as the energy propagating through channels (α–ζ). 
              Maat Balance governs core stabilization (neither runaway nor collapse). 
              Book of the Dead provides the 9 procedural states (S₀=void, S₁=emerging, S₈=return). 
              Teotl / Nahua animates each node as a Tonalli (solar head-force) and Teyolia (heart fire). 
              The Dao shapes Wu-Wei stabilization — do not force; let it settle at natural balance. 
              Spider Woman's web is the weighted connection topology. 
              Nagual perception is the multi-channel articulation cue — seeing the pattern before the state.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
