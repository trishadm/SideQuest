/**
 * Smart Matching Engine for SideQuest
 * Calculates weighted compatibility percentage and exact matching rationales.
 */

function calculateCompatibility(currentUser, targetUser) {
  let score = 0;
  const breakdown = {};
  const rationales = [];

  // 1. Teach/Learn Compatibility (Weight: 40%)
  // Check if targetUser teaches something currentUser wants to learn
  let targetTeachesWhatIWant = null;
  for (const want of currentUser.learningSkills || []) {
    const match = (targetUser.teachingSkills || []).find(t => 
      t.name.toLowerCase().trim() === want.name.toLowerCase().trim() ||
      t.category === want.category
    );
    if (match) {
      targetTeachesWhatIWant = match;
      break;
    }
  }

  // Check if currentUser teaches something targetUser wants to learn
  let iTeachWhatTargetWants = null;
  for (const targetWant of targetUser.learningSkills || []) {
    const match = (currentUser.teachingSkills || []).find(t => 
      t.name.toLowerCase().trim() === targetWant.name.toLowerCase().trim() ||
      t.category === targetWant.category
    );
    if (match) {
      iTeachWhatTargetWants = match;
      break;
    }
  }

  let teachLearnScore = 0;
  if (targetTeachesWhatIWant && iTeachWhatTargetWants) {
    teachLearnScore = 40;
    rationales.push(`✓ You can teach ${iTeachWhatTargetWants.name}`);
    rationales.push(`✓ They can teach ${targetTeachesWhatIWant.name}`);
  } else if (targetTeachesWhatIWant) {
    teachLearnScore = 24;
    rationales.push(`✓ They teach ${targetTeachesWhatIWant.name} (Your target skill)`);
  } else if (iTeachWhatTargetWants) {
    teachLearnScore = 20;
    rationales.push(`✓ You teach ${iTeachWhatTargetWants.name} (Their desired skill)`);
  } else {
    teachLearnScore = 10;
  }
  breakdown.teachLearn = teachLearnScore;
  score += teachLearnScore;

  // 2. Skill Level Compatibility (Weight: 15%)
  let levelScore = 0;
  if (targetTeachesWhatIWant) {
    const wantObj = currentUser.learningSkills.find(l => l.name.toLowerCase() === targetTeachesWhatIWant.name.toLowerCase());
    const desired = wantObj ? wantObj.desiredLevel : 3;
    const actual = targetTeachesWhatIWant.level || 3;
    
    if (actual >= desired) {
      levelScore = 15;
      rationales.push(`✓ Skill level (${actual}/5) meets your target requirement (${desired}/5)`);
    } else if (actual === desired - 1) {
      levelScore = 10;
    } else {
      levelScore = 5;
    }
  } else {
    levelScore = 10;
  }
  breakdown.skillLevel = levelScore;
  score += levelScore;

  // 3. Availability Match (Weight: 15%)
  const currentAvail = currentUser.availability || [];
  const targetAvail = targetUser.availability || [];
  const sharedAvail = currentAvail.filter(a => targetAvail.includes(a));

  let availScore = 0;
  if (sharedAvail.length > 0) {
    availScore = 15;
    rationales.push(`✓ Both available on ${sharedAvail.join(', ')}`);
  } else if (currentAvail.includes('Flexible') || targetAvail.includes('Flexible')) {
    availScore = 12;
    rationales.push(`✓ Flexible schedule match`);
  } else {
    availScore = 5;
  }
  breakdown.availability = availScore;
  score += availScore;

  // 4. Location Match (Weight: 10%)
  let locationScore = 0;
  const currentLoc = (currentUser.location || '').toLowerCase();
  const targetLoc = (targetUser.location || '').toLowerCase();

  if (currentLoc && targetLoc && (currentLoc.includes(targetLoc) || targetLoc.includes(currentLoc))) {
    locationScore = 10;
    rationales.push(`✓ Same city/location (${targetUser.location})`);
  } else if (currentUser.onlinePreference === 'Online' || targetUser.onlinePreference === 'Online' || currentUser.onlinePreference === 'Flexible') {
    locationScore = 8;
    rationales.push(`✓ Compatible remote teaching preferences`);
  } else {
    locationScore = 4;
  }
  breakdown.location = locationScore;
  score += locationScore;

  // 5. Language Match (Weight: 10%)
  const currentLangs = (currentUser.languages || []).map(l => l.toLowerCase());
  const targetLangs = (targetUser.languages || []).map(l => l.toLowerCase());
  const sharedLangs = targetLangs.filter(l => currentLangs.includes(l));

  let langScore = 0;
  if (sharedLangs.length > 0) {
    langScore = 10;
    rationales.push(`✓ Both speak ${sharedLangs.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}`);
  } else {
    langScore = 3;
  }
  breakdown.language = langScore;
  score += langScore;

  // 6. User Rating (Weight: 10%)
  const rating = (targetUser.ratings && targetUser.ratings.overall) ? targetUser.ratings.overall : 5.0;
  let ratingScore = Math.round((rating / 5.0) * 10);
  breakdown.userRating = ratingScore;
  score += ratingScore;

  if (rating >= 4.5) {
    rationales.push(`✓ Top rated mentor (${rating.toFixed(1)}★ overall rating)`);
  }

  // Ensure total score is capped at 99% max (or 100%)
  const finalScore = Math.min(Math.max(Math.round(score), 35), 98);

  return {
    compatibilityScore: finalScore,
    breakdown,
    rationales
  };
}

module.exports = { calculateCompatibility };
