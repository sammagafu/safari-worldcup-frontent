/**
 * World Cup 2026 – all 48 national teams and their players.
 * Squad per team: 2 GK, 5 DEF, 5 MID, 3 FWD (15 players).
 */

// All 48 national teams (FIFA World Cup 2026)
export const worldCupTeams = [
  // Hosts (3)
  'United States', 'Mexico', 'Canada',
  // South America (6)
  'Argentina', 'Brazil', 'Uruguay', 'Colombia', 'Ecuador', 'Paraguay',
  // Europe (16)
  'France', 'Germany', 'Spain', 'England', 'Portugal', 'Netherlands', 'Belgium', 'Italy',
  'Croatia', 'Switzerland', 'Austria', 'Scotland', 'Norway', 'Wales', 'Poland', 'Denmark',
  // Africa (9)
  'Morocco', 'Senegal', 'Egypt', 'Nigeria', 'Ghana', 'Ivory Coast', 'Tunisia', 'Algeria', 'South Africa',
  // Asia (8)
  'Japan', 'South Korea', 'Australia', 'Iran', 'Saudi Arabia', 'Qatar', 'Uzbekistan', 'Jordan',
  // CONCACAF (5)
  'Costa Rica', 'Panama', 'Jamaica', 'Haiti', 'Curaçao',
  // Oceania (1)
  'New Zealand',
]

// Name pools for realistic variety (surnames by region style)
const namePool = {
  first: [
    'Lucas', 'Marcos', 'Diego', 'Thiago', 'Neymar', 'Vinicius', 'Rodrygo', 'Emiliano', 'Lautaro', 'Julian',
    'Kylian', 'Antoine', 'Theo', 'Joshua', 'Kai', 'Pedri', 'Gavi', 'Harry', 'Jude', 'Phil', 'Cristiano',
    'Bruno', 'Rafael', 'Virgil', 'Frenkie', 'Memphis', 'Nicolo', 'Federico', 'Kevin', 'Romelu', 'Darwin',
    'Christian', 'Tyler', 'Weston', 'Luis', 'Luka', 'Andrej', 'Hakim', 'Yassine', 'Granit', 'Enzo',
    'Moises', 'Takefusa', 'Son', 'Mathew', 'Ederson', 'Alisson', 'Marquinhos', 'Casemiro', 'Richarlison',
    'Nahuel', 'Angel', 'Paulo', 'Gabriel', 'Raphinha', 'Serge', 'Ousmane', 'Aurelien', 'Ibrahima', 'Dayot',
    'Jamal', 'Florian', 'Marc-Andre', 'Ilkay', 'Leroy', 'Thomas', 'Dani', 'Pau', 'Alejandro', 'Mikel',
    'Bukayo', 'Declan', 'Jordan', 'Kobbie', 'Diogo', 'Joao', 'Ruben', 'Bernardo', 'Virgil', 'Nathan',
    'Cody', 'Donyell', 'Matthijs', 'Frenkie', 'Steven', 'Teun', 'Xavi', 'Romelu', 'Yannick', 'Dodi',
    'Andre', 'Youri', 'Charles', 'Wout', 'Mike', 'Gianluigi', 'Nicolo', 'Lorenzo', 'Federico', 'Davide',
    'Marcelo', 'Luka', 'Mateo', 'Josko', 'Andrej', 'Mario', 'Dominik', 'Granit', 'Manuel', 'Remo',
    'David', 'Scott', 'Andrew', 'John', 'Kieran', 'Erling', 'Martin', 'Mohamed', 'Achraf', 'Hakim',
    'Youssef', 'Sofyan', 'Azzedine', 'Sadio', 'Kalidou', 'Ismaila', 'Edouard', 'Mohamed', 'Trevor', 'Thomas',
    'Victor', 'Jordan', 'Mohammed', 'Kudus', 'Iñaki', 'Andre', 'Sebastien', 'Serge', 'Lee', 'Hee-chan',
    'Hwang', 'Min-jae', 'Kim', 'Min-jae', 'Kaoru', 'Ritsu', 'Wataru', 'Takehiro', 'Junya', 'Daizen',
    'Mitchell', 'Jackson', 'Martin', 'Craig', 'Mathew', 'Ajdin', 'Riley', 'Sardar', 'Mehdi', 'Alireza',
    'Salem', 'Salem', 'Abdullah', 'Hassan', 'Almoez', 'Akram', 'Eldor', 'Jaloliddin', 'Oday', 'Ayman',
    'Keylor', 'Joel', 'Bryan', 'Celso', 'Jewison', 'Andre', 'Damion', 'Shamar', 'Leandro', 'Alberth',
    'Chris', 'Winston', 'Michael', 'Liberato', 'Alex', 'Winston', 'Matthew', 'Mark', 'Chris',
  ],
  last: [
    'Silva', 'Paqueta', 'Martinez', 'Alvarez', 'Mbappe', 'Griezmann', 'Hernandez', 'Kimmich', 'Havertz',
    'Garcia', 'Rodri', 'Kane', 'Bellingham', 'Foden', 'Ronaldo', 'Fernandes', 'Leao', 'van Dijk', 'de Jong',
    'Depay', 'Barella', 'Chiesa', 'De Bruyne', 'Lukaku', 'Nunez', 'Valverde', 'Pulisic', 'Adams', 'McKennie',
    'Suarez', 'Modric', 'Kramaric', 'Kovacic', 'Brozovic', 'Sosa', 'Gvardiol', 'Xhaka', 'Shaqiri', 'Akanji',
    'Freuler', 'Odegaard', 'Haaland', 'Salah', 'Mane', 'Koulibaly', 'Mendy', 'Diaz', 'Nunez', 'Alisson',
    'Ederson', 'Marquinhos', 'Casemiro', 'Richarlison', 'Otamendi', 'Di Maria', 'Dybala', 'Diaz', 'Jesus',
    'Dembele', 'Tchouameni', 'Konate', 'Upamecano', 'Musiala', 'Wirtz', 'Neuer', 'Gundogan', 'Muller', 'Rudiger',
    'Laporte', 'Torres', 'Grimaldo', 'Oyarzabal', 'Merino', 'Rice', 'Pickford', 'Henderson', 'Mainoo', 'Felix',
    'Palhinha', 'Dias', 'Neves', 'Cancelo', 'Gakpo', 'Malen', 'Weghorst', 'Simons', 'Gravenberch', 'Blind',
    'Onana', 'Lukebakio', 'Batshuayi', 'Carrasco', 'Castagne', 'Donnarumma', 'Barella', 'Pellegrini', 'Dimarco',
    'Di Lorenzo', 'Brozovic', 'Modric', 'Kovacic', 'Perisic', 'Pasalic', 'Livakovic', 'Fernandes', 'Neves',
    'Aebischer', 'Elvedi', 'Sow', 'Robertson', 'McTominay', 'McGinn', 'Tierney', 'Odegaard', 'Berge', 'Nyland',
    'Benzema', 'Bounou', 'Ziyech', 'Amrabat', 'En-Nesyri', 'Ziyech', 'Mane', 'Koulibaly', 'Sarr', 'Mendy',
    'Kudus', 'Partey', 'Williams', 'Onana', 'Aurier', 'Haller', 'Bensebaini', 'Bennacer', 'Mahrez',
    'Kubo', 'Mitoma', 'Doan', 'Ito', 'Kamada', 'Tomiyasu', 'Ito', 'Ito', 'Furuhashi', 'Ueda',
    'Duke', 'Irvine', 'Goodwin', 'Boyle', 'Ryan', 'McGree', 'Hrustic', 'Strain', 'Baccus', 'Taremi',
    'Azmoun', 'Jahanbakhsh', 'Taremi', 'Al-Dawsari', 'Al-Bulaihi', 'Al-Shehri', 'Afif', 'Hassan', 'Shomurodov',
    'Kamilov', 'Abu Amarah', 'Al-Rashid', 'Navas', 'Campbell', 'Ruiz', 'Borges', 'Antonio', 'Bailey', 'Reid',
    'Bacuna', 'Lozano', 'Elis', 'Perez', 'Wood', 'Reid', 'Cacace', 'Singh', 'Boxall', 'Bell',
  ],
}

function pickName(seed, type) {
  const arr = namePool[type]
  return arr[seed % arr.length]
}

/** Deterministic simulated value: 0..max from seed (for reproducible data) */
function sim(seed, max) {
  return ((seed * 1103515245 + 12345) >>> 0) % (max + 1)
}

/** Price in 0.5 steps: min to max by position (for budget) */
function simPrice(seed, position) {
  const ranges = { GK: [4, 6.5], DEF: [4, 8], MID: [5, 12], FWD: [6, 15] }
  const [min, max] = ranges[position]
  const steps = Math.round((max - min) * 2)
  const step = sim(seed, steps)
  return Math.round((min + (step / 2) * 0.5) * 10) / 10
}

/** Total points earned so far (simulated season), and last gameweek points */
function simPoints(seed, position) {
  const maxTotal = position === 'GK' ? 80 : position === 'DEF' ? 120 : position === 'MID' ? 140 : 160
  const total = sim(seed, maxTotal)
  const gw = sim(seed + 1, 18)
  return { total, gameweekPoints: gw }
}

let id = 1
const players = []

for (const team of worldCupTeams) {
  const teamSeed = worldCupTeams.indexOf(team) * 31

  for (let i = 0; i < 2; i++) {
    const s = teamSeed + id + i
    const { total, gameweekPoints } = simPoints(s, 'GK')
    players.push({
      id: `p${id++}`,
      name: `${pickName(s, 'first')} ${pickName(s + 7, 'last')}`,
      team,
      position: 'GK',
      jerseyNumber: i + 1,
      price: simPrice(s, 'GK'),
      points: total,
      gameweekPoints,
    })
  }

  for (let i = 0; i < 5; i++) {
    const s = teamSeed + id + i
    const { total, gameweekPoints } = simPoints(s, 'DEF')
    players.push({
      id: `p${id++}`,
      name: `${pickName(s, 'first')} ${pickName(s + 11, 'last')}`,
      team,
      position: 'DEF',
      jerseyNumber: 2 + (i % 5),
      price: simPrice(s, 'DEF'),
      points: total,
      gameweekPoints,
    })
  }

  for (let i = 0; i < 5; i++) {
    const s = teamSeed + id + i
    const { total, gameweekPoints } = simPoints(s, 'MID')
    players.push({
      id: `p${id++}`,
      name: `${pickName(s, 'first')} ${pickName(s + 13, 'last')}`,
      team,
      position: 'MID',
      jerseyNumber: 6 + (i % 6),
      price: simPrice(s, 'MID'),
      points: total,
      gameweekPoints,
    })
  }

  for (let i = 0; i < 3; i++) {
    const s = teamSeed + id + i
    const { total, gameweekPoints } = simPoints(s, 'FWD')
    players.push({
      id: `p${id++}`,
      name: `${pickName(s, 'first')} ${pickName(s + 17, 'last')}`,
      team,
      position: 'FWD',
      jerseyNumber: 9 + (i % 3),
      price: simPrice(s, 'FWD'),
      points: total,
      gameweekPoints,
    })
  }
}

export const mockPlayers = players

export const scoringRules = {
  goal: { FWD: 4, MID: 5, DEF: 6, GK: 6 },
  assist: 3,
  cleanSheet: { GK: 4, DEF: 4, MID: 1 },
  penaltySave: 5,
  yellowCard: -1,
  redCard: -3,
  captainMultiplier: 2,
  tripleCaptainMultiplier: 3,
}
