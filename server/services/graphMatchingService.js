/**
 * Graph-based Indirect Skill Exchange Recommendation System (Bonus Feature)
 * 
 * Supports finding 3-way (and multi-user) indirect skill exchange chains:
 * Example: User A teaches User B (e.g. Python)
 *          User B teaches User C (e.g. Guitar)
 *          User C teaches User A (e.g. Spanish)
 */

function findIndirectExchangeChains(users, maxChainLength = 3) {
  // Build adjacency list: user Map by ID
  const userMap = new Map();
  users.forEach(u => userMap.set(u._id.toString(), u));

  // Build directed graph edges: Edge (A -> B) means A CAN TEACH B
  const graph = new Map();
  const edgeDetails = new Map(); // key: "A->B", value: { teachSkill, learnSkill }

  users.forEach(uA => {
    const idA = uA._id.toString();
    if (!graph.has(idA)) graph.set(idA, []);

    users.forEach(uB => {
      const idB = uB._id.toString();
      if (idA === idB) return;

      // Check if uA teaches something uB wants to learn
      let matchingTeachSkill = null;
      let matchingLearnSkill = null;

      for (const teachSkill of uA.teachingSkills || []) {
        const want = (uB.learningSkills || []).find(l => 
          l.name.toLowerCase().trim() === teachSkill.name.toLowerCase().trim() ||
          l.category === teachSkill.category
        );
        if (want) {
          matchingTeachSkill = teachSkill.name;
          matchingLearnSkill = want.name;
          break;
        }
      }

      if (matchingTeachSkill) {
        graph.get(idA).push(idB);
        edgeDetails.set(`${idA}->${idB}`, {
          teacherId: idA,
          teacherName: uA.name,
          studentId: idB,
          studentName: uB.name,
          skillExchanged: matchingTeachSkill
        });
      }
    });
  });

  // Find Cycles using Depth First Search (DFS)
  const chains = [];
  const visited = new Set();
  const path = [];

  function dfs(currId, startId, depth) {
    path.push(currId);
    visited.add(currId);

    const neighbors = graph.get(currId) || [];
    for (const neighborId of neighbors) {
      if (neighborId === startId && depth >= 2 && depth <= maxChainLength) {
        // Found a valid cycle!
        const cycleUsers = path.map(id => userMap.get(id));
        const cycleSteps = [];

        for (let i = 0; i < path.length; i++) {
          const fromId = path[i];
          const toId = (i === path.length - 1) ? startId : path[i + 1];
          const edge = edgeDetails.get(`${fromId}->${toId}`);
          cycleSteps.push(edge);
        }

        // Avoid duplicate permutations by ordering by smallest user ID
        const minId = [...path].sort()[0];
        if (path[0] === minId) {
          chains.push({
            chainLength: path.length,
            users: cycleUsers.map(u => ({ id: u._id, name: u.name, username: u.username, avatar: u.avatar })),
            steps: cycleSteps,
            summary: cycleSteps.map(s => `${s.teacherName} teaches ${s.studentName} (${s.skillExchanged})`).join(' ➔ ')
          });
        }
      } else if (!visited.has(neighborId) && depth < maxChainLength) {
        dfs(neighborId, startId, depth + 1);
      }
    }

    path.pop();
    visited.delete(currId);
  }

  // Run DFS from every node
  const userIds = Array.from(userMap.keys());
  userIds.forEach(id => {
    dfs(id, id, 1);
  });

  return chains;
}

module.exports = { findIndirectExchangeChains };
