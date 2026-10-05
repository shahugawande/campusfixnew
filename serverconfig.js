// Single source of truth for categories, SLA hours and dropdown data.
const CATS = {
  classroom: { label: 'Classroom', icon: '🏫', dept: 'Maintenance', sla: 48, subs: ['Projector not working', 'AC not working', 'Benches / desks broken', 'Classroom not cleaned', 'Lights / fans not working', 'Board / smart board issue'] },
  seminar: { label: 'Seminar Hall', icon: '🎤', dept: 'Maintenance', sla: 48, subs: ['Projector / AV issue', 'AC not working', 'Mic / sound system', 'Seating or cleanliness'] },
  lab: { label: 'Laboratory', icon: '🔬', dept: 'Lab Department', sla: 72, subs: ['Computers not working', 'Equipment broken / missing', 'Safety hazard', 'Software / network issue', 'Lab not cleaned'] },
  washroom: { label: 'Washroom', icon: '🚻', dept: 'Housekeeping', sla: 12, subs: ['Not clean', 'No water', 'Leakage / flush broken', 'Door / lock broken', 'No soap / supplies'] },
  canteen: { label: 'Canteen', icon: '🍽️', dept: 'Canteen Committee', sla: 24, subs: ['Food quality is poor', 'Overpricing / rates too high', 'Hygiene problem', 'Foreign object found in food', 'Stale or expired items', 'Poor service / long waiting'] },
  library: { label: 'Library', icon: '📚', dept: 'Library', sla: 48, subs: ['Books not available', 'Noise / cleanliness', 'AC / lights issue', 'Staff issue'] },
  network: { label: 'Wi-Fi & Internet', icon: '📶', dept: 'IT Cell', sla: 48, subs: ['Wi-Fi not working', 'Very slow internet', 'Portal / login problem'] },
  accounts: { label: 'Accounts Section', icon: '💰', dept: 'Accounts', sla: 72, subs: ['Staff not responding / not working', 'Fee receipt delay', 'Scholarship / refund pending', 'Wrong fee entry'] },
  nonteach: { label: 'Non-teaching Staff', icon: '🧑‍💼', dept: 'Admin Office', sla: 72, subs: ['Not working properly', 'Rude behaviour', 'Delay in documents', 'Office unattended'] },
  staff: { label: 'Teaching Staff', icon: '👨‍🏫', dept: 'Admin Office', sla: 96, conf: true, subs: ['Lectures not conducted', 'Unprofessional behaviour', 'Unfair evaluation', 'Other concern'] },
  campus: { label: 'Campus & Ground', icon: '🌳', dept: 'Maintenance', sla: 72, subs: ['Parking problem', 'Ground / sports facility', 'Lighting / security', 'Water cooler'] },
  bully: { label: 'Bullying / Ragging (optional)', icon: '🛡️', dept: 'Anti-Ragging Cell', sla: 6, conf: true, forceAnon: true, forceUrgent: true, subs: ['Bullying', 'Ragging', 'Harassment', 'Threat / intimidation'] }
};
const META = {
  years: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
  branches: ['Computer Engineering', 'Information Technology', 'AI & Data Science', 'Electronics & Telecom', 'Mechanical', 'Civil', 'Electrical'],
  buildings: ['Main Building', 'Library', 'Canteen', 'Lab Block', 'Seminar Hall Block', 'Admin & Accounts Block', 'Sports Ground', 'Parking'],
  depts: [...new Set(Object.values(CATS).map(c => c.dept))],
  statuses: ['Reported', 'Assigned', 'In Progress', 'Fixed']
};
module.exports = { CATS, META };
